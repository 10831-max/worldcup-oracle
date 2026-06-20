/**
 * 主控制器 - 应用初始化、事件绑定、数据管理
 */

const App = {
  // 全局状态
  state: {
    currentGroup: 'A',
    teamMap: {},
    allMatches: {},       // { A: [...6场], B: [...6场], ... }
    groupResults: {},      // { A: result, B: result, ... }
    globalResults: {},     // 跨组结果
    isDirty: false,
  },

  /**
   * 初始化应用
   */
  async init() {
    console.log('⚽ 足球小组赛出线分析工具 v2.1');
    console.log('   纯浏览器端计算 | 手动更新比分 | 稳定可靠');

    try {
      await this.loadData();
      this.loadSavedScores();
      this.recalculateAll();
      Renderer.renderAll(this.state);
      this.updateApiStatus();
      this.bindEvents();
      this.bindKeyboard();
      console.log('✅ 初始化完成');
    } catch (err) {
      console.error('初始化失败：', err);
      document.getElementById('standings-container').innerHTML =
        `<div class="error-state">初始化失败：${err.message}</div>`;
    }
  },

  /**
   * 加载数据（优先使用内嵌数据，确保本地双击打开也能用）
   */
  async loadData() {
    let teams, matches;

    // 尝试从 fetch 加载（适用于服务器部署）
    try {
      const teamsResp = await fetch('data/teams.json');
      if (teamsResp.ok) {
        teams = await teamsResp.json();
        const matchesResp = await fetch('data/matches.json');
        if (matchesResp.ok) {
          matches = await matchesResp.json();
        }
      }
    } catch (e) {
      // fetch 失败，使用内嵌数据
    }

    // 降级到内嵌数据
    if (!teams || !matches) {
      console.log('📦 使用内嵌数据（本地模式）');
      teams = EMBEDDED_TEAMS;
      matches = EMBEDDED_MATCHES;
    }

    teams.forEach(t => { this.state.teamMap[t.id] = t; });

    // 按组分组
    this.state.allMatches = {};
    matches.forEach(m => {
      if (!this.state.allMatches[m.group]) {
        this.state.allMatches[m.group] = [];
      }
      this.state.allMatches[m.group].push(m);
    });
  },

  /**
   * 从localStorage加载已保存的比分
   */
  loadSavedScores() {
    try {
      const saved = localStorage.getItem('yz_football_scores_v3');
      if (saved) {
        const scores = JSON.parse(saved);
        for (const [matchId, score] of Object.entries(scores)) {
          for (const [group, matches] of Object.entries(this.state.allMatches)) {
            const match = matches.find(m => m.id === matchId);
            if (match) {
              match.homeScore = score.homeScore;
              match.awayScore = score.awayScore;
              match.played = true;
            }
          }
        }
        console.log(`📂 从本地存储恢复 ${Object.keys(scores).length} 场比分`);
        return; // 有保存数据，不加载默认值
      }
    } catch (e) {
      console.warn('读取本地存储失败：', e);
    }
    // localStorage 为空 → 内嵌数据中已包含实际赛果，无需额外加载
    console.log('📦 使用内嵌数据中的默认赛果');
  },

  /**
   * 更新API状态指示器
   */
  updateApiStatus() {
    const el = document.getElementById('api-status');
    if (!el) return;
    el.textContent = '📝 手动更新模式';
  },

  /**
   * 保存比分到localStorage
   */
  saveScores() {
    try {
      const scores = {};
      for (const [group, matches] of Object.entries(this.state.allMatches)) {
        matches.forEach(m => {
          if (m.homeScore !== null && m.awayScore !== null) {
            scores[m.id] = { homeScore: m.homeScore, awayScore: m.awayScore };
          }
        });
      }
      localStorage.setItem('yz_football_scores_v3', JSON.stringify(scores));
    } catch (e) {
      console.warn('保存到本地存储失败：', e);
    }
  },

  /**
   * 重新计算所有组
   */
  recalculateAll() {
    const startTime = performance.now();

    // 先计算每个组
    for (const [group, matches] of Object.entries(this.state.allMatches)) {
      const remainingCount = matches.filter(m => m.homeScore === null || m.awayScore === null).length;
      const strategy = Engine.getStrategy(remainingCount);
      const useSampling = strategy.method === 'montecarlo';

      const result = Engine.analyzeGroup(group, matches, this.state.teamMap, useSampling);

      // 计算 totalQualifyRate（直接出线 + 第三名晋级估算）+ 颜色状态
      for (const [tid, r] of Object.entries(result.results)) {
        // 第三名晋级概率估算
        const thirdEst = Engine.estimateThirdPlaceQualification(r, result);
        r.thirdQualEstimate = thirdEst.qualifyProb;
        r.thirdQualTier = thirdEst.tier;
        // 总出线概率 = 直接出线概率 + (拿第三的概率 × 第三名晋级概率)
        const thirdQualContrib = (r.thirdPlaceRate / 100) * (thirdEst.qualifyProb / 100) * 100;
        r.totalQualifyRate = r.directQualifyRate + thirdQualContrib;

        r.colorStatus = ColorSystem.getStatus(r.totalQualifyRate, {
          lockedFirst: r.lockedFirst,
          lockedSecond: r.lockedSecond,
          lockedTop2: r.lockedTop2,
        });
        r.teamName = this.state.teamMap[tid] ? this.state.teamMap[tid].name : tid;
        r.teamFlag = this.state.teamMap[tid] ? this.state.teamMap[tid].flag : '';
      }

      // 附加积分榜排名信息
      const fullMatches = this.buildCurrentMatches(matches);
      result.standings = Rules.computeStandings(result.teams, fullMatches);

      this.state.groupResults[group] = result;
    }

    // 全局跨组分析
    this.state.globalResults = Engine.analyzeAllGroups(
      this.state.groupResults,
      this.state.teamMap
    );

    const elapsed = performance.now() - startTime;
    console.log(`🔄 全部计算完成，耗时 ${elapsed.toFixed(1)} ms`);
  },

  /**
   * 构建当前实际比赛数据（用于显示积分榜）
   * 只包含已完赛的比赛
   */
  buildCurrentMatches(matches) {
    return matches
      .filter(m => m.homeScore !== null && m.awayScore !== null)
      .map(m => ({ ...m }));
  },

  /**
   * 绑定UI事件
   */
  bindEvents() {
    // 比分编辑弹窗
    document.getElementById('btn-save-score').addEventListener('click', () => this.saveMatchScore());
    document.getElementById('btn-cancel-score').addEventListener('click', () => Renderer.hideEditModal());
    document.getElementById('btn-clear-score').addEventListener('click', () => this.clearMatchScore());

    // 弹窗关闭
    document.getElementById('edit-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) Renderer.hideEditModal();
    });

    // 详情弹窗关闭
    document.getElementById('detail-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) Renderer.hideDetailModal();
    });
    document.getElementById('btn-close-detail').addEventListener('click', () => Renderer.hideDetailModal());

    // 比分输入框回车提交
    ['modal-home-score', 'modal-away-score'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.saveMatchScore();
      });
    });

    // 全局重置按钮
    const resetBtn = document.getElementById('btn-reset-all');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetAllScores());
    }

    // 导出数据按钮
    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportData());
    }

    // 导入数据按钮
    const importBtn = document.getElementById('btn-import');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        document.getElementById('import-file-input').click();
      });
    }
    const importFile = document.getElementById('import-file-input');
    if (importFile) {
      importFile.addEventListener('change', (e) => this.importData(e));
    }
  },

  /**
   * 键盘快捷键
   */
  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      // 不在输入框内时响应
      if (e.target.tagName === 'INPUT') return;

      const groups = 'ABCDEFGHIJKL'.split('');
      const idx = groups.indexOf(e.key.toUpperCase());
      if (idx >= 0) {
        this.switchGroup(groups[idx]);
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          this.navigateGroup(-1);
          break;
        case 'ArrowRight':
          this.navigateGroup(1);
          break;
        case 'Escape':
          Renderer.hideEditModal();
          Renderer.hideDetailModal();
          break;
        case 'r':
          if (e.ctrlKey) break;
          this.recalculateAll();
          Renderer.renderAll(this.state);
          break;
      }
    });
  },

  /**
   * 切换小组
   */
  switchGroup(group) {
    this.state.currentGroup = group;
    Renderer.renderAll(this.state);
  },

  navigateGroup(delta) {
    const groups = 'ABCDEFGHIJKL'.split('');
    const idx = groups.indexOf(this.state.currentGroup);
    const newIdx = (idx + delta + groups.length) % groups.length;
    this.switchGroup(groups[newIdx]);
  },

  /**
   * 保存比赛比分
   */
  saveMatchScore() {
    const matchId = document.getElementById('modal-match-id').value;
    const hg = parseInt(document.getElementById('modal-home-score').value);
    const ag = parseInt(document.getElementById('modal-away-score').value);

    // 校验
    if (isNaN(hg) || isNaN(ag) || hg < 0 || ag < 0 || hg > 9 || ag > 9) {
      alert('请输入 0~9 的有效进球数');
      return;
    }

    // 更新比赛数据
    for (const [group, matches] of Object.entries(this.state.allMatches)) {
      const match = matches.find(m => m.id === matchId);
      if (match) {
        match.homeScore = hg;
        match.awayScore = ag;
        match.played = true;
        break;
      }
    }

    // 保存到本地
    this.saveScores();

    // 关闭弹窗
    Renderer.hideEditModal();

    // 重新计算
    this.recalculateAll();

    // 刷新界面
    Renderer.renderAll(this.state);

    console.log(`⚽ ${matchId}: ${hg} - ${ag} 已保存`);
  },

  /**
   * 清除比赛比分
   */
  clearMatchScore() {
    const matchId = document.getElementById('modal-match-id').value;

    for (const [group, matches] of Object.entries(this.state.allMatches)) {
      const match = matches.find(m => m.id === matchId);
      if (match) {
        match.homeScore = null;
        match.awayScore = null;
        match.played = false;
        break;
      }
    }

    this.saveScores();
    Renderer.hideEditModal();
    this.recalculateAll();
    Renderer.renderAll(this.state);

    console.log(`🗑️ ${matchId} 比分已清除`);
  },

  /**
   * 重置所有比分
   */
  resetAllScores() {
    if (!confirm('确定要清除所有已输入的比分吗？此操作不可撤销。')) return;

    for (const [group, matches] of Object.entries(this.state.allMatches)) {
      matches.forEach(m => {
        m.homeScore = null;
        m.awayScore = null;
        m.played = false;
      });
    }

    localStorage.removeItem('yz_football_scores_v3');
    this.recalculateAll();
    Renderer.renderAll(this.state);

    console.log('🗑️ 所有比分已重置');
  },

  /**
   * 导出数据
   */
  exportData() {
    const scores = {};
    for (const [group, matches] of Object.entries(this.state.allMatches)) {
      matches.forEach(m => {
        if (m.homeScore !== null && m.awayScore !== null) {
          scores[m.id] = { homeScore: m.homeScore, awayScore: m.awayScore };
        }
      });
    }

    const blob = new Blob([JSON.stringify(scores, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `worldcup2026_scores_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('📤 数据已导出');
  },

  /**
   * 导入数据
   */
  importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const scores = JSON.parse(ev.target.result);

        // 应用导入的比分
        for (const [matchId, score] of Object.entries(scores)) {
          for (const [group, matches] of Object.entries(this.state.allMatches)) {
            const match = matches.find(m => m.id === matchId);
            if (match) {
              match.homeScore = score.homeScore;
              match.awayScore = score.awayScore;
              match.played = true;
            }
          }
        }

        this.saveScores();
        this.recalculateAll();
        Renderer.renderAll(this.state);

        console.log(`📥 导入了 ${Object.keys(scores).length} 场比分`);
      } catch (err) {
        alert('导入失败：文件格式不正确');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }
};

// ==================== 全局函数（HTML onclick 调用） ====================
function switchGroup(group) { App.switchGroup(group); }
function editMatch(matchId) {
  for (const [group, matches] of Object.entries(App.state.allMatches)) {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      Renderer.showEditModal(match, App.state);
      return;
    }
  }
}
function showTeamDetail(teamId) {
  // 跳转到球队详情页
  Renderer.showTeamPage(teamId, App.state);
}
function backToGroup() {
  Renderer.hideTeamPage();
}

// ==================== Hash 路由处理 ====================
function handleHashChange() {
  const hash = window.location.hash;
  if (hash.startsWith('#team/')) {
    const teamId = hash.replace('#team/', '');
    if (App.state && App.state.teamMap && App.state.teamMap[teamId]) {
      // 自动切换到该球队所在的小组
      const team = App.state.teamMap[teamId];
      if (team.group && App.state.currentGroup !== team.group) {
        App.switchGroup(team.group);
      }
      // 延迟渲染确保数据就绪
      setTimeout(() => Renderer.showTeamPage(teamId, App.state), 100);
    }
  } else if (!hash) {
    if (document.getElementById('team-page') && document.getElementById('team-page').style.display !== 'none') {
      Renderer.hideTeamPage();
    }
  }
}
window.addEventListener('hashchange', handleHashChange);

// ==================== 启动 ====================
document.addEventListener('DOMContentLoaded', () => {
  App.init().then(() => {
    // 初始加载后检查 hash
    if (window.location.hash) {
      handleHashChange();
    }
  });
});
