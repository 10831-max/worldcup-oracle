/**
 * 界面渲染器 - 所有DOM操作集中在这里
 */

const Renderer = {
  /**
   * 渲染整个页面
   */
  renderAll(appState) {
    this.renderGroupNav(appState);
    this.renderStandings(appState);
    this.renderMatches(appState);
    this.renderSummary(appState);
  },

  /**
   * 顶部小组导航
   */
  renderGroupNav(appState) {
    const nav = document.getElementById('group-nav');
    if (!nav) return;

    const groups = 'ABCDEFGHIJKL'.split('');
    nav.innerHTML = groups.map(g => {
      const active = g === appState.currentGroup ? 'active' : '';
      const hasScores = this.groupHasScores(g, appState);
      const dot = hasScores ? '<span class="nav-dot"></span>' : '';
      return `<button class="group-btn ${active}" onclick="switchGroup('${g}')">
        ${dot}${g}组
      </button>`;
    }).join('');
  },

  groupHasScores(group, appState) {
    const matches = appState.allMatches[group] || [];
    return matches.some(m => m.homeScore !== null && m.awayScore !== null);
  },

  /**
   * 积分榜渲染
   */
  renderStandings(appState) {
    const container = document.getElementById('standings-container');
    if (!container) return;

    const result = appState.groupResults[appState.currentGroup];
    if (!result) {
      container.innerHTML = '<div class="empty-state">加载中...</div>';
      return;
    }

    const standings = result.standings;
    if (!standings || standings.length === 0) {
      container.innerHTML = '<div class="empty-state">暂无数据</div>';
      return;
    }

    const teamResultMap = {};
    if (result.results) {
      for (const [tid, r] of Object.entries(result.results)) {
        teamResultMap[tid] = r;
      }
    }

    container.innerHTML = `
      <table class="standings-table">
        <thead>
          <tr>
            <th class="col-rank">#</th>
            <th class="col-team">球队</th>
            <th class="col-pld">场</th>
            <th class="col-w">胜</th>
            <th class="col-d">平</th>
            <th class="col-l">负</th>
            <th class="col-gf">进</th>
            <th class="col-ga">失</th>
            <th class="col-gd">±</th>
            <th class="col-pts">分</th>
            <th class="col-status">出线形势</th>
            <th class="col-rate">出线概率</th>
          </tr>
        </thead>
        <tbody>
          ${standings.map((s, i) => {
            const tr = teamResultMap[s.teamId];
            const status = tr ? tr.colorStatus : null;
            const totalRate = tr ? tr.totalQualifyRate : (s.rank <= 2 ? 100 : s.rank === 3 ? 50 : 0);

            let rankIcon = '';
            if (i === 0) rankIcon = ' 🥇';
            else if (i === 1) rankIcon = ' 🥈';
            else if (i === 2) rankIcon = ' 🥉';

            return `
              <tr class="standing-row rank-${s.rank} ${status ? status.cssClass : ''}"
                  onclick="showTeamDetail('${s.teamId}')"
                  style="--row-bg: ${status ? status.bgColor : 'transparent'}">
                <td class="col-rank">${s.rank}${rankIcon}</td>
                <td class="col-team">
                  <span class="team-flag">${tr ? tr.teamFlag : ''}</span>
                  <span class="team-name">${tr ? tr.teamName : s.teamId}</span>
                  ${status && status.icon ? `<span class="status-icon">${status.icon}</span>` : ''}
                </td>
                <td class="col-pld">${s.played}</td>
                <td class="col-w">${s.wins}</td>
                <td class="col-d">${s.draws}</td>
                <td class="col-l">${s.losses}</td>
                <td class="col-gf">${s.goalsFor}</td>
                <td class="col-ga">${s.goalsAgainst}</td>
                <td class="col-gd ${s.goalDiff > 0 ? 'positive' : s.goalDiff < 0 ? 'negative' : ''}">${s.goalDiff > 0 ? '+' + s.goalDiff : s.goalDiff}</td>
                <td class="col-pts"><strong>${s.points}</strong></td>
                <td class="col-status">
                  ${status ? `<span class="status-badge" style="background:${status.color};color:#fff">${status.label}</span>` : '-'}
                </td>
                <td class="col-rate">
                  ${this.renderRateBar(totalRate)}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  },

  /**
   * 概率进度条
   */
  renderRateBar(rate) {
    const r = Math.max(0, Math.min(100, rate));
    const gradient = ColorSystem.getProgressGradient(r);
    const textColor = ColorSystem.getTextColor(r);
    return `
      <div class="rate-bar-container">
        <div class="rate-bar" style="width:${r.toFixed(1)}%;background:${gradient}"></div>
        <span class="rate-text" style="color:${textColor}">${r.toFixed(1)}%</span>
      </div>
    `;
  },

  /**
   * 剩余比赛列表
   */
  renderMatches(appState) {
    const container = document.getElementById('matches-container');
    if (!container) return;

    const matches = appState.allMatches[appState.currentGroup] || [];

    const grouped = { 1: [], 2: [], 3: [] };
    matches.forEach(m => {
      if (!grouped[m.matchday]) grouped[m.matchday] = [];
      grouped[m.matchday].push(m);
    });

    container.innerHTML = [1, 2, 3].map(md => {
      const ms = grouped[md] || [];
      const allPlayed = ms.every(m => m.homeScore !== null && m.awayScore !== null);
      return `
        <div class="matchday-group ${allPlayed ? 'matchday-done' : ''}">
          <div class="matchday-header">
            <span class="matchday-title">第 ${md} 轮</span>
            ${allPlayed ? '<span class="matchday-done-badge">✓ 全部完赛</span>' : ''}
          </div>
          ${ms.map(m => this.renderMatchCard(m, appState)).join('')}
        </div>
      `;
    }).join('');
  },

  /**
   * 单场比赛卡片
   */
  renderMatchCard(match, appState) {
    const played = match.homeScore !== null && match.awayScore !== null;
    const homeTeam = appState.teamMap[match.home];
    const awayTeam = appState.teamMap[match.away];

    return `
      <div class="match-card ${played ? 'played' : 'unplayed'}" id="match-${match.id}">
        <div class="match-teams">
          <div class="match-team home">
            <span class="match-flag">${homeTeam ? homeTeam.flag : ''}</span>
            <span class="match-name">${homeTeam ? homeTeam.name : match.home}</span>
          </div>
          <div class="match-score-container">
            ${played
              ? `<span class="match-score" onclick="editMatch('${match.id}')">${match.homeScore} - ${match.awayScore}</span>`
              : `<button class="btn-edit-score" onclick="editMatch('${match.id}')">更新比分</button>`
            }
          </div>
          <div class="match-team away">
            <span class="match-name">${awayTeam ? awayTeam.name : match.away}</span>
            <span class="match-flag">${awayTeam ? awayTeam.flag : ''}</span>
          </div>
        </div>
        ${played
          ? `<div class="match-edit-hint">点击比分修改</div>`
          : ''
        }
      </div>
    `;
  },

  /**
   * 概览面板
   */
  renderSummary(appState) {
    const container = document.getElementById('summary-container');
    if (!container) return;

    const result = appState.groupResults[appState.currentGroup];
    if (!result) return;

    const locked = [];
    const safe = [];
    const hopeful = [];
    const slim = [];
    const out = [];

    for (const [tid, r] of Object.entries(result.results)) {
      const s = r.colorStatus;
      if (s.level >= 4) locked.push(r);
      else if (s.level === 3) safe.push(r);
      else if (s.level === 2) hopeful.push(r);
      else if (s.level === 1) slim.push(r);
      else out.push(r);
    }

    container.innerHTML = `
      <div class="summary-grid">
        ${this.renderSummaryCard('✅ 锁定出线', locked, '#00C853')}
        ${this.renderSummaryCard('🟢 形势乐观', safe, '#4CAF50')}
        ${this.renderSummaryCard('🟡 仍有希望', hopeful, '#FF9800')}
        ${this.renderSummaryCard('⚫ 形势严峻', slim, '#757575')}
        ${this.renderSummaryCard('💀 已经出局', out, '#424242')}
      </div>
      <div class="summary-info">
        <span>剩余未赛：${result.remainingMatches || 0} 场</span>
        <span>穷举场景：${result.totalScenarios ? result.totalScenarios.toLocaleString() : 0} 个</span>
        <span>计算方法：${Engine.getStrategy(result.remainingMatches || 6).reason}</span>
      </div>
    `;
  },

  renderSummaryCard(title, teams, color) {
    if (teams.length === 0) return '';
    return `
      <div class="summary-card" style="border-left: 3px solid ${color}">
        <div class="summary-card-title">${title}</div>
        <div class="summary-card-teams">
          ${teams.map(t => `<span class="summary-team">${t.teamFlag} ${t.teamName}</span>`).join('')}
        </div>
      </div>
    `;
  },

  /**
   * 比分输入弹窗
   */
  showEditModal(match, appState) {
    const modal = document.getElementById('edit-modal');
    const homeTeam = appState.teamMap[match.home];
    const awayTeam = appState.teamMap[match.away];

    document.getElementById('modal-home-name').textContent = homeTeam ? homeTeam.name : match.home;
    document.getElementById('modal-away-name').textContent = awayTeam ? awayTeam.name : match.away;
    document.getElementById('modal-home-flag').textContent = homeTeam ? homeTeam.flag : '';
    document.getElementById('modal-away-flag').textContent = awayTeam ? awayTeam.flag : '';

    const homeInput = document.getElementById('modal-home-score');
    const awayInput = document.getElementById('modal-away-score');
    homeInput.value = match.homeScore !== null ? match.homeScore : '';
    awayInput.value = match.awayScore !== null ? match.awayScore : '';

    document.getElementById('modal-match-id').value = match.id;
    modal.classList.add('show');
    homeInput.focus();
  },

  hideEditModal() {
    document.getElementById('edit-modal').classList.remove('show');
  },

  /**
   * 球队详情弹窗
   */
  showTeamDetail(teamId, appState) {
    const result = appState.groupResults[appState.currentGroup];
    if (!result) return;

    const tr = result.results ? result.results[teamId] : null;
    if (!tr) return;

    // 安全取值（防止 undefined.toFixed 崩溃）
    const totalRate = tr.totalQualifyRate || (tr.directQualifyRate + (tr.thirdPlaceRate || 0) * 0.5) || 0;
    const directRate = tr.directQualifyRate || 0;
    const firstRate = tr.firstPlaceRate || 0;
    const secondRate = tr.secondPlaceRate || 0;
    const thirdRate = tr.thirdPlaceRate || 0;
    const avgPts = tr.avgPoints || 0;
    const totalScn = tr.totalScenarios || 0;
    const cs = tr.colorStatus || ColorSystem.getStatus(totalRate, {});
    const thirdEst = tr.thirdQualEstimate;
    const thirdTier = tr.thirdQualTier || '';

    const modal = document.getElementById('detail-modal');
    document.getElementById('detail-team-name').textContent = (tr.teamFlag || '') + ' ' + (tr.teamName || teamId);
    document.getElementById('detail-status').innerHTML = `
      <span class="status-badge" style="background:${cs.color};color:#fff;font-size:14px;padding:4px 12px;">
        ${cs.icon} ${cs.label}
      </span>
    `;

    document.getElementById('detail-total-rate').textContent = totalRate.toFixed(1) + '%';
    document.getElementById('detail-direct-rate').textContent = directRate.toFixed(1) + '%';
    document.getElementById('detail-first-rate').textContent = firstRate.toFixed(1) + '%';
    document.getElementById('detail-second-rate').textContent = secondRate.toFixed(1) + '%';
    document.getElementById('detail-third-rate').textContent = thirdRate.toFixed(1) + '%';
    document.getElementById('detail-avg-pts').textContent = avgPts.toFixed(2);
    document.getElementById('detail-scenarios').textContent = totalScn.toLocaleString();

    if (thirdEst !== undefined && thirdEst !== null) {
      document.getElementById('detail-third-estimate').textContent = thirdEst.toFixed(0) + '%';
      document.getElementById('detail-third-tier').textContent = thirdTier;
      document.getElementById('detail-third-row').style.display = '';
    } else {
      document.getElementById('detail-third-row').style.display = 'none';
    }

    const eggs = [];
    if (tr.lockedFirst) eggs.push('🥇 已锁定小组第一！');
    if (tr.lockedSecond) eggs.push('🥈 已锁定小组第二！');
    if (tr.lockedTop2 && !tr.lockedFirst && !tr.lockedSecond) eggs.push('🔒 已锁定直接出线！');
    if (totalRate < 1 && totalRate > 0) eggs.push('理论上仍有可能...');
    if (totalRate === 0) eggs.push('💀 下届再来！');
    if (totalRate >= 99.99) eggs.push('🎉 可以提前庆祝了！');
    document.getElementById('detail-easter-egg').textContent = eggs.join(' | ') || '形势未定，继续关注';

    // ===== 出线条件分析 =====
    this.renderConditions(teamId, appState);

    modal.classList.add('show');
  },

  /**
   * 渲染出线条件分析
   */
  renderConditions(teamId, appState) {
    const container = document.getElementById('detail-conditions-body');
    if (!container) return;

    const group = appState.currentGroup;
    const matches = appState.allMatches[group] || [];
    const groupResult = appState.groupResults[group];

    // 调用引擎计算条件
    const conditions = Engine.getTeamConditions(
      teamId, group, matches, appState.teamMap,
      groupResult, appState.groupResults
    );

    if (!conditions) {
      container.innerHTML = '<div class="condition-item"><div class="condition-detail">暂无出线条件数据</div></div>';
      return;
    }

    let html = '';

    // 总结
    html += `<div class="condition-summary">${conditions.summary}</div>`;

    // 各场景
    for (const sc of conditions.scenarios) {
      html += '<div class="condition-item">';
      html += `<div class="condition-label">`;

      // 类型标签
      const typeLabels = {
        'locked': '🔒 已锁定',
        'out': '💀 已出局',
        'own_match': '⚽ 自身比赛',
        'other_match': '🔍 关键关联战',
        'third_place': '🌍 跨组竞争',
        'no_control': '👀 听天由命'
      };
      const typeLabel = typeLabels[sc.type] || sc.type;
      html += `<span class="condition-type-badge ${sc.type}">${typeLabel}</span>`;
      html += ` ${sc.label}`;
      html += `</div>`;

      // 自身比赛的模拟结果
      if (sc.type === 'own_match' && sc.simResults && sc.simResults.length > 0) {
        html += '<div class="condition-outcome-grid">';
        for (const sr of sc.simResults) {
          const rateClass = sr.totalQualifyRate > 66 ? 'high' : sr.totalQualifyRate > 33 ? 'mid' : 'low';
          html += `
            <div class="condition-outcome">
              <div class="condition-outcome-label">${sr.outcome}</div>
              <div class="condition-outcome-rate ${rateClass}">${sr.totalQualifyRate.toFixed(1)}%</div>
              <div style="font-size:0.68rem;color:var(--text-muted)">总出线率</div>
              <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px">
                直出${sr.directQualifyRate.toFixed(0)}% / 前三${sr.thirdPlaceRate.toFixed(0)}%
              </div>
            </div>`;
        }
        html += '</div>';
      }

      // 详情文本
      if (sc.detail) {
        html += `<div class="condition-detail">${sc.detail}</div>`;
      }

      // 第三名分析详情
      if (sc.type === 'third_place' && sc.thirdAnalysis) {
        const ta = sc.thirdAnalysis;
        html += `
          <div class="condition-pts-analysis">
            <div>📊 12组第三名预期积分排名：该队排第 <strong>${ta.myRank}/12</strong></div>
            <div>📏 第8名晋级线：约 <strong>${ta.cutoffPoints.toFixed(1)} 分</strong>（净胜球 ${ta.cutoffGoalDiff.toFixed(1)}）</div>
            <div>🎯 该队预期积分：<strong>${ta.myAvgPoints.toFixed(1)} 分</strong>（净胜球 ${ta.myAvgGoalDiff.toFixed(1)}）</div>
            <div style="margin-top:4px;font-size:0.72rem;">💡 ${ta.ptsAnalysis}</div>
          </div>`;
      }

      html += '</div>';
    }

    container.innerHTML = html;
  },

  hideDetailModal() {
    document.getElementById('detail-modal').classList.remove('show');
  },

  /**
   * 显示球队详情页（替代主视图）
   */
  showTeamPage(teamId, appState) {
    const group = appState.currentGroup;
    const result = appState.groupResults[group];
    if (!result) return;

    const tr = result.results ? result.results[teamId] : null;
    if (!tr) return;

    const team = appState.teamMap[teamId];
    const profile = (typeof TEAM_PROFILES !== 'undefined') ? TEAM_PROFILES[teamId] : null;
    const confNames = { 'UEFA': '欧洲足联', 'CONMEBOL': '南美足联', 'CONCACAF': '中北美足联', 'AFC': '亚洲足联', 'CAF': '非洲足联', 'OFC': '大洋洲足联' };
    const conf = team ? (confNames[team.confederation] || team.confederation) : '-';

    // 填充分组信息
    document.getElementById('tp-flag').textContent = tr.teamFlag || '';
    document.getElementById('tp-name').textContent = tr.teamName || teamId;
    document.getElementById('tp-nickname').textContent = profile ? `「${profile.nickname}」` : '';
    document.getElementById('tp-group-badge').textContent = `${group} 组`;

    // Hero 区域 - 尝试本地图片，降级到Emoji
    const regionMap = { 'eu': '🌍 欧洲', 'sa': '🌎 南美洲', 'na': '🌎 中北美洲', 'af': '🌍 非洲', 'as': '🌏 亚洲', 'oc': '🌏 大洋洲' };
    const regionName = profile ? (regionMap[profile.region] || '') : '';
    const countryName = team ? team.nameEn : '';
    const heroDiv = document.getElementById('tp-hero-flag');
    if (heroDiv) {
      // 尝试加载本地图片 img/teams/{teamId}.jpg
      const localImg = new Image();
      localImg.onload = function() {
        heroDiv.style.backgroundImage = `url('img/teams/${teamId}.jpg')`;
        heroDiv.style.backgroundSize = 'contain';
        heroDiv.style.backgroundPosition = 'center';
        heroDiv.style.backgroundRepeat = 'no-repeat';
        heroDiv.textContent = '';
        heroDiv.style.fontSize = '0';
      };
      localImg.onerror = function() {
        // 降级：使用超大Emoji国旗
        heroDiv.style.display = 'flex';
        heroDiv.style.alignItems = 'center';
        heroDiv.style.justifyContent = 'center';
        heroDiv.style.fontSize = '8rem';
        heroDiv.textContent = tr.teamFlag || '⚽';
        heroDiv.style.background = 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 40%, rgba(0,0,0,0.3) 100%)';
      };
      localImg.src = `img/teams/${teamId}.jpg`;
    }
    document.getElementById('tp-hero-location').innerHTML = profile
      ? `${regionName} · ${countryName}`
      : '';

    // 球队资料
    document.getElementById('tp-rank').textContent = profile ? `第 ${profile.rank} 名` : '-';
    document.getElementById('tp-conf').textContent = conf;
    document.getElementById('tp-desc').textContent = profile ? profile.desc : '暂无球队简介';
    document.getElementById('tp-history').textContent = profile ? profile.history : '-';
    document.getElementById('tp-stars').textContent = profile ? profile.stars : '-';

    // 趣梗
    document.getElementById('tp-meme').textContent = profile ? profile.meme : '暂无趣梗';

    // 当前状态
    const cs = tr.colorStatus || ColorSystem.getStatus(tr.totalQualifyRate || 0, {});
    const standing = result.standings ? result.standings.find(s => s.teamId === teamId) : null;
    let statusHtml = '';
    if (standing) {
      statusHtml = `
        <div class="tp-status-row"><span class="tp-status-label">当前排名</span><span class="tp-status-value">小组第 ${standing.rank} 名</span></div>
        <div class="tp-status-row"><span class="tp-status-label">战绩</span><span class="tp-status-value">${standing.played}场 ${standing.wins}胜 ${standing.draws}平 ${standing.losses}负</span></div>
        <div class="tp-status-row"><span class="tp-status-label">进球/失球</span><span class="tp-status-value">${standing.goalsFor} / ${standing.goalsAgainst}（净胜球 ${standing.goalDiff > 0 ? '+' + standing.goalDiff : standing.goalDiff}）</span></div>
        <div class="tp-status-row"><span class="tp-status-label">积分</span><span class="tp-status-value" style="font-size:1.2rem;color:var(--gold-light)">${standing.points} 分</span></div>
        <div class="tp-status-row"><span class="tp-status-label">状态</span><span class="tp-status-value"><span class="status-badge" style="background:${cs.color};color:#fff">${cs.icon} ${cs.label}</span></span></div>
        <div class="tp-status-row"><span class="tp-status-label">总出线概率</span><span class="tp-status-value" style="font-size:1.15rem;color:${ColorSystem.getTextColor(tr.totalQualifyRate || 0)}">${(tr.totalQualifyRate || 0).toFixed(1)}%</span></div>
      `;
    }
    document.getElementById('tp-status-body').innerHTML = statusHtml;

    // 出线路径
    const paths = Engine.getQualificationPaths(teamId, group, appState.allMatches[group] || [], appState.teamMap, result, appState.groupResults);
    document.getElementById('tp-paths-summary').textContent = paths.summary || '';

    let pathsHtml = '';
    if (paths.paths && paths.paths.length > 0) {
      for (const path of paths.paths) {
        const probClass = path.probability > 66 ? 'high' : path.probability > 33 ? 'mid' : 'low';
        pathsHtml += `<div class="tp-path-card">
          <div class="tp-path-header">
            <span class="tp-path-label">${path.label}</span>
            <span class="tp-path-prob ${probClass}">出线概率 ${path.probability.toFixed(1)}%</span>
          </div>
          <div class="tp-condition-list">`;

        for (const cond of (path.conditions || [])) {
          const tagClass = cond.type || '';
          const tagLabels = { own: '自身', other: '关联', gd: '净胜球', third: '第三名', locked: '锁定', out: '出局', no_control: '被动' };
          const tagLabel = tagLabels[tagClass] || '';
          pathsHtml += `
            <div class="tp-condition-item">
              <span class="tp-condition-num">${cond.idx}</span>
              <span class="tp-condition-text">${cond.detail}<span class="tp-condition-tag ${tagClass}">${tagLabel}</span></span>
            </div>`;
        }

        pathsHtml += `</div></div>`;
      }
    } else {
      pathsHtml = '<div style="padding:24px;text-align:center;color:var(--text-muted)">暂无出线路径数据</div>';
    }

    // 跨组第三名具体条件
    if (tr.thirdPlaceRate > 5) {
      const crossConditions = Engine.getCrossGroupMatchConditions(teamId, group, appState.allMatches, appState.teamMap, appState.groupResults);
      if (crossConditions.length > 0) {
        pathsHtml += `<div class="tp-path-card" style="border-left:3px solid #a78bfa;">
          <div class="tp-path-header">
            <span class="tp-path-label">🌍 跨组第三名有利条件</span>
            <span style="font-size:0.78rem;color:var(--text-muted)">期望其他组出现以下结果</span>
          </div>
          <div class="tp-condition-list">`;
        let crossIdx = 1;
        for (const cc of crossConditions) {
          pathsHtml += `
            <div class="tp-condition-item">
              <span class="tp-condition-num">${crossIdx++}</span>
              <span class="tp-condition-text">${cc.detail}<span class="tp-condition-tag third">跨组</span></span>
            </div>`;
        }
        pathsHtml += `</div></div>`;
      }
    }
    document.getElementById('tp-paths-body').innerHTML = pathsHtml;

    // 切换视图
    document.querySelector('.group-nav-container').style.display = 'none';
    document.querySelector('.main-content').style.display = 'none';
    document.querySelector('.keyboard-hints').style.display = 'none';
    document.getElementById('team-page').style.display = 'block';
    window.scrollTo(0, 0);
  },

  /**
   * 隐藏球队详情页，恢复小组视图
   */
  hideTeamPage() {
    document.getElementById('team-page').style.display = 'none';
    document.querySelector('.group-nav-container').style.display = '';
    document.querySelector('.main-content').style.display = '';
    document.querySelector('.keyboard-hints').style.display = '';
    window.location.hash = '';
  }
};
