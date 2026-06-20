/**
 * 核心计算引擎 - 穷举场景、积分计算、出线判定
 * 所有计算在浏览器本地完成，零依赖
 */

const Engine = {
  // 比分穷举范围
  scoreRange: [0, 1, 2, 3, 4],

  // 蒙特卡洛采样数
  monteCarloSamples: 100000,

  // 球队强度缓存
  _strengthCache: null,

  /**
   * 构建球队强度映射（基于FIFA排名，排名越小越强）
   */
  buildStrengthMap(teamMap) {
    if (this._strengthCache) return this._strengthCache;
    const map = {};
    for (const [tid, team] of Object.entries(teamMap)) {
      // 从TEAM_PROFILES获取排名，默认50
      const profile = (typeof TEAM_PROFILES !== 'undefined') ? TEAM_PROFILES[tid] : null;
      const rank = profile ? profile.rank : 50;
      // 强度值：排名1→强度100，排名80→强度15
      map[tid] = Math.max(5, Math.min(100, 120 - rank));
    }
    this._strengthCache = map;
    return map;
  },

  /**
   * 根据两队强度生成加权进球概率分布
   * @returns {object} {homeProbs: [5], awayProbs: [5]} 各5个进球的概率权重
   */
  getGoalProbabilities(homeTeamId, awayTeamId, teamMap) {
    const strength = this.buildStrengthMap(teamMap);
    const hs = strength[homeTeamId] || 30;
    const as = strength[awayTeamId] || 30;
    const ratio = hs / Math.max(1, as);
    const invRatio = 1 / Math.max(0.1, ratio);

    // 基础分布：0球,1球,2球,3球,4球
    const baseProbs = [10, 20, 30, 25, 15];

    // 根据强度比调整进球分布（更激进的模型）
    const adjustProbs = (probs, isFavored) => {
      return probs.map((p, i) => {
        let adj = p;
        if (isFavored && ratio > 1.15) {
          // 强队：大幅增加高进球概率，减少0球概率
          const factor = Math.pow(ratio, 1.8); // ratio^1.8 更激进
          if (i >= 3) adj *= factor;
          else if (i >= 2) adj *= Math.sqrt(factor);
          else if (i === 0) adj /= Math.max(1.1, Math.sqrt(factor));
        } else if (!isFavored && ratio > 1.15) {
          // 弱队：大幅减少高进球概率，增加0球概率
          const factor = Math.pow(ratio, 1.8);
          if (i === 0) adj *= Math.sqrt(factor);
          else if (i <= 1) adj *= 1;
          else if (i >= 3) adj /= factor;
          else adj /= Math.sqrt(factor);
        } else if (isFavored && invRatio > 1.15) {
          // 客队强的情况
          const factor = Math.pow(invRatio, 1.8);
          if (i >= 3) adj *= factor;
          else if (i >= 2) adj *= Math.sqrt(factor);
          else if (i === 0) adj /= Math.max(1.1, Math.sqrt(factor));
        } else if (!isFavored && invRatio > 1.15) {
          const factor = Math.pow(invRatio, 1.8);
          if (i === 0) adj *= Math.sqrt(factor);
          else if (i >= 3) adj /= factor;
          else if (i >= 2) adj /= Math.sqrt(factor);
        }
        return Math.max(1, Math.round(adj));
      });
    };

    const homeFavored = ratio > 1.15;
    const awayFavored = invRatio > 1.15;

    const homeProbs = adjustProbs([...baseProbs], homeFavored);
    const awayProbs = adjustProbs([...baseProbs], awayFavored);

    return { homeProbs, awayProbs };
  },

  /**
   * 生成所有可能的比分组合（含权重）
   */
  generateAllScores(homeTeamId, awayTeamId, teamMap) {
    const { homeProbs, awayProbs } = this.getGoalProbabilities(homeTeamId, awayTeamId, teamMap);
    const scores = [];
    for (let hg = 0; hg <= 4; hg++) {
      for (let ag = 0; ag <= 4; ag++) {
        scores.push({
          homeScore: hg,
          awayScore: ag,
          weight: homeProbs[hg] * awayProbs[ag] // 联合概率权重
        });
      }
    }
    return scores;
  },

  /**
   * 生成加权随机比分（用于蒙特卡洛采样）
   */
  generateRandomScore(homeTeamId, awayTeamId, teamMap) {
    const { homeProbs, awayProbs } = this.getGoalProbabilities(homeTeamId, awayTeamId, teamMap);

    // 加权随机选择主队进球
    const hg = this.weightedRandom(homeProbs);
    const ag = this.weightedRandom(awayProbs);

    return { homeScore: hg, awayScore: ag };
  },

  /**
   * 加权随机选择（返回索引0-4）
   */
  weightedRandom(probs) {
    const total = probs.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < probs.length; i++) {
      r -= probs[i];
      if (r <= 0) return i;
    }
    return probs.length - 1;
  },

  /**
   * 笛卡尔积辅助函数
   */
  cartesianProduct(arrays) {
    if (arrays.length === 0) return [[]];
    return arrays.reduce((acc, curr) => {
      const result = [];
      for (const a of acc) {
        for (const c of curr) {
          result.push(a.concat([c]));
        }
      }
      return result;
    }, [[]]);
  },

  /**
   * 核心：分析一个小组的出线形势
   * @param {string} groupName - 小组名（如 "A"）
   * @param {Array} matches - 该组6场比赛（含已输入比分）
   * @param {object} teamMap - 所有球队数据Map
   * @param {boolean} useSampling - 是否使用蒙特卡洛采样
   * @returns {object} 分析结果
   */
  analyzeGroup(groupName, matches, teamMap, useSampling = false) {
    const teams = matches.reduce((acc, m) => {
      if (!acc.includes(m.home)) acc.push(m.home);
      if (!acc.includes(m.away)) acc.push(m.away);
      return acc;
    }, []);

    // 分离已完赛和未完赛的比赛
    const playedMatches = matches.filter(m => m.homeScore !== null && m.awayScore !== null);
    const remainingMatches = matches.filter(m => m.homeScore === null || m.awayScore === null);

    // 为每场剩余比赛生成加权比分组合
    const weightedScoreSets = remainingMatches.map(m =>
      this.generateAllScores(m.home, m.away, teamMap)
    );

    // 初始化统计（使用加权计数）
    const teamStats = {};
    teams.forEach(tid => {
      teamStats[tid] = {
        directQualify: 0,
        firstPlace: 0, secondPlace: 0, thirdPlace: 0, fourthPlace: 0,
        totalPoints: 0, totalGoalDiff: 0, totalGoalsFor: 0,
        lockedFirst: true, lockedSecond: true, lockedTop2: true,
        totalWeight: 0,
      };
    });

    let totalWeight = 0;

    if (useSampling) {
      // 蒙特卡洛采样（加权随机）
      for (let i = 0; i < this.monteCarloSamples; i++) {
        const combo = remainingMatches.map(m =>
          this.generateRandomScore(m.home, m.away, teamMap)
        );
        const fullMatches = this.buildFullMatches(playedMatches, remainingMatches, combo);
        const standings = Rules.computeStandings(teams, fullMatches);

        standings.forEach(s => {
          const ts = teamStats[s.teamId];
          ts.totalPoints += s.points;
          ts.totalGoalDiff += s.goalDiff;
          ts.totalGoalsFor += s.goalsFor;
          totalWeight++;

          if (s.rank === 1) { ts.firstPlace++; ts.directQualify++; }
          else if (s.rank === 2) { ts.secondPlace++; ts.directQualify++; }
          else if (s.rank === 3) { ts.thirdPlace++; }
          else { ts.fourthPlace++; }

          if (s.rank !== 1) ts.lockedFirst = false;
          if (s.rank !== 2) ts.lockedSecond = false;
          if (s.rank > 2) ts.lockedTop2 = false;
        });
      }
    } else {
      // 完整穷举（带权重）
      const scoreCombos = this.cartesianProduct(weightedScoreSets);

      for (const combo of scoreCombos) {
        // 计算该组合的权重（各比分概率之积）
        const weight = combo.reduce((w, sc) => w * (sc.weight || 1), 1);

        const fullMatches = this.buildFullMatches(playedMatches, remainingMatches, combo);
        const standings = Rules.computeStandings(teams, fullMatches);

        standings.forEach(s => {
          const ts = teamStats[s.teamId];
          ts.totalPoints += s.points * weight;
          ts.totalGoalDiff += s.goalDiff * weight;
          ts.totalGoalsFor += s.goalsFor * weight;
          ts.totalWeight += weight;

          if (s.rank === 1) { ts.firstPlace += weight; ts.directQualify += weight; }
          else if (s.rank === 2) { ts.secondPlace += weight; ts.directQualify += weight; }
          else if (s.rank === 3) { ts.thirdPlace += weight; }
          else { ts.fourthPlace += weight; }

          if (s.rank !== 1) ts.lockedFirst = false;
          if (s.rank !== 2) ts.lockedSecond = false;
          if (s.rank > 2) ts.lockedTop2 = false;
        });

        totalWeight += weight;
      }
    }

    const n = useSampling ? this.monteCarloSamples : totalWeight;

    // 计算百分比
    const results = {};
    teams.forEach(tid => {
      const ts = teamStats[tid];
      const denom = useSampling ? n : Math.max(1, ts.totalWeight);
      results[tid] = {
        teamId: tid,
        group: groupName,
        teamName: teamMap[tid] ? teamMap[tid].name : tid,
        teamFlag: teamMap[tid] ? teamMap[tid].flag : '',
        directQualifyRate: denom > 0 ? (ts.directQualify / denom * 100) : 0,
        firstPlaceRate: denom > 0 ? (ts.firstPlace / denom * 100) : 0,
        secondPlaceRate: denom > 0 ? (ts.secondPlace / denom * 100) : 0,
        thirdPlaceRate: denom > 0 ? (ts.thirdPlace / denom * 100) : 0,
        fourthPlaceRate: denom > 0 ? (ts.fourthPlace / denom * 100) : 0,
        avgPoints: denom > 0 ? (ts.totalPoints / denom) : 0,
        avgGoalDiff: denom > 0 ? (ts.totalGoalDiff / denom) : 0,
        avgGoalsFor: denom > 0 ? (ts.totalGoalsFor / denom) : 0,
        lockedFirst: ts.lockedFirst && denom > 0,
        lockedSecond: ts.lockedSecond && denom > 0,
        lockedTop2: ts.lockedTop2 && denom > 0,
        totalScenarios: useSampling ? n : Math.round(totalWeight),
        directCount: Math.round(ts.directQualify),
        thirdCount: Math.round(ts.thirdPlace),
      };
    });

    return {
      group: groupName,
      totalScenarios: useSampling ? n : Math.round(totalWeight),
      remainingMatches: remainingMatches.length,
      results,
      teams,
    };
  },

  /**
   * 构建完整比赛数据
   */
  buildFullMatches(playedMatches, remainingMatches, scoreCombo) {
    const full = [...playedMatches.map(m => ({ ...m }))];
    const combo = Array.isArray(scoreCombo) ? scoreCombo : [scoreCombo];

    for (let i = 0; i < remainingMatches.length; i++) {
      const rm = remainingMatches[i];
      const score = combo[i] || { homeScore: 0, awayScore: 0 };
      full.push({
        ...rm,
        homeScore: score.homeScore,
        awayScore: score.awayScore,
        played: true,
      });
    }

    return full;
  },

  /**
   * 全局分析：跨所有12组
   * @param {object} allGroupResults - { A: groupResult, B: ..., ... }
   * @returns {object} 包含第三名跨组比较的完整结果
   */
  analyzeAllGroups(allGroupResults, teamMap) {
    // 收集所有组的第三名信息
    // 对每个全局场景，需要跨组比较第三名
    // 简化处理：基于单组分析结果 + 统计模型估算第三名晋级概率

    const allResults = {};

    for (const [groupName, groupResult] of Object.entries(allGroupResults)) {
      for (const [teamId, result] of Object.entries(groupResult.results)) {
        // 第三名出线概率估算
        const thirdQualEstimate = this.estimateThirdPlaceQualification(
          result, groupResult, allGroupResults
        );

        const totalQualifyRate = result.directQualifyRate +
          (result.thirdPlaceRate * thirdQualEstimate.qualifyProb / 100);

        allResults[teamId] = {
          ...result,
          thirdQualEstimate: thirdQualEstimate.qualifyProb,
          thirdQualTier: thirdQualEstimate.tier,
          totalQualifyRate,
          colorStatus: ColorSystem.getStatus(totalQualifyRate, {
            lockedFirst: result.lockedFirst,
            lockedSecond: result.lockedSecond,
            lockedTop2: result.lockedTop2,
          }),
        };
      }
    }

    return allResults;
  },

  /**
   * 估算小组第三跨组晋级概率
   * 基于历史数据模型：
   * - 6分+：极高概率（~95%+）
   * - 5分：高概率（~85%）
   * - 4分正净胜球：中等偏高（~65%）
   * - 4分负净胜球：中等偏低（~40%）
   * - 3分正净胜球：较低（~20%）
   * - 3分负净胜球：很低（~5%）
   * - 2分及以下：几乎不可能（~1%）
   */
  estimateThirdPlaceQualification(result, groupResult, allGroupResults) {
    const avgPts = result.avgPoints;
    const avgGD = result.avgGoalDiff || 0; // 需要从standings计算

    let qualifyProb = 0;
    let tier = '';

    if (avgPts >= 6.0) {
      qualifyProb = 96;
      tier = '几乎锁定';
    } else if (avgPts >= 5.0) {
      qualifyProb = 85;
      tier = '大概率晋级';
    } else if (avgPts >= 4.5) {
      qualifyProb = 70;
      tier = '较大概率';
    } else if (avgPts >= 4.0) {
      qualifyProb = avgGD >= 0 ? 60 : 40;
      tier = avgGD >= 0 ? '有希望' : '不乐观';
    } else if (avgPts >= 3.0) {
      qualifyProb = avgGD >= 0 ? 20 : 5;
      tier = avgGD >= 0 ? '需要奇迹' : '几乎出局';
    } else {
      qualifyProb = 1;
      tier = '几乎不可能';
    }

    return { qualifyProb, tier };
  },

  /**
   * 获取推荐的穷举策略
   */
  getStrategy(remainingCount) {
    if (remainingCount <= 4) return { method: 'full', reason: `完整穷举(${remainingCount}场)` };
    if (remainingCount === 5) return { method: 'full', reason: `完整穷举(5场, ~1M场景)` };
    return { method: 'montecarlo', reason: `蒙特卡洛采样(6场, ${this.monteCarloSamples}样本)` };
  },

  /**
   * 获取球队出线条件分析
   * @param {string} teamId - 球队ID
   * @param {string} groupName - 小组名
   * @param {Array} matches - 该组所有比赛
   * @param {object} teamMap - 球队数据Map
   * @param {object} groupResult - 该组的分析结果
   * @param {object} allGroupResults - 所有组的分析结果 {A: result, B: ...}
   * @returns {object} 出线条件
   */
  getTeamConditions(teamId, groupName, matches, teamMap, groupResult, allGroupResults) {
    const tr = groupResult.results[teamId];
    if (!tr) return null;

    const cs = tr.colorStatus || ColorSystem.getStatus(tr.totalQualifyRate || 0, {});
    const teamName = teamMap[teamId] ? teamMap[teamId].name : teamId;
    const teamFlag = teamMap[teamId] ? teamMap[teamId].flag : '';

    // 当前积分榜
    const playedMatches = matches.filter(m => m.homeScore !== null && m.awayScore !== null);
    const remainingMatches = matches.filter(m => m.homeScore === null || m.awayScore === null);
    const currentStandings = groupResult.standings || [];
    const myStanding = currentStandings.find(s => s.teamId === teamId);

    const conditions = {
      teamId, teamName, teamFlag,
      status: cs,
      totalQualifyRate: tr.totalQualifyRate || 0,
      directQualifyRate: tr.directQualifyRate || 0,
      thirdPlaceRate: tr.thirdPlaceRate || 0,
      thirdQualEstimate: tr.thirdQualEstimate || 0,
      lockedTop2: tr.lockedTop2 || false,
      scenarios: []
    };

    // ===== 1. 已锁定 / 已出局 =====
    if (tr.lockedTop2) {
      if (tr.lockedFirst) {
        conditions.summary = '🥇 无论剩余比赛结果如何，已锁定小组第一直接出线！';
      } else if (tr.lockedSecond) {
        conditions.summary = '🥈 无论剩余比赛结果如何，已锁定小组第二直接出线！';
      } else {
        conditions.summary = '✅ 无论剩余比赛结果如何，已确保直接出线（小组前二）！';
      }
      conditions.scenarios.push({
        label: '锁定状态',
        detail: '所有剩余比赛场景均已穷举，该队在任何情况下排名均为小组前二。',
        type: 'locked'
      });
      return conditions;
    }

    if (tr.totalQualifyRate < 0.01 || (tr.directQualifyRate < 0.01 && tr.thirdPlaceRate < 0.01)) {
      conditions.summary = '💀 所有出线路径均已断绝，已确定出局。';
      conditions.scenarios.push({
        label: '已出局',
        detail: '即使在最理想的情况下（剩余比赛全胜且其他比赛结果最有利），该队仍无法进入小组前二或成为前8的小组第三。',
        type: 'out'
      });
      return conditions;
    }

    // ===== 2. 分析剩余比赛 =====
    const myRemainingMatches = remainingMatches.filter(m =>
      m.home === teamId || m.away === teamId
    );
    const otherRemainingMatches = remainingMatches.filter(m =>
      m.home !== teamId && m.away !== teamId
    );

    // 获取同组对手
    const opponents = [];
    for (const s of currentStandings) {
      if (s.teamId !== teamId) opponents.push(s);
    }

    // 2a. 分析自己能控制的比赛
    if (myRemainingMatches.length > 0) {
      for (const match of myRemainingMatches) {
        const oppId = match.home === teamId ? match.away : match.home;
        const oppName = teamMap[oppId] ? teamMap[oppId].name : oppId;
        const oppFlag = teamMap[oppId] ? teamMap[oppId].flag : '';
        const isHome = match.home === teamId;

        // 模拟：如果赢/平/输这场比赛
        const simResults = this.simulateOwnMatchOutcome(
          teamId, oppId, match, matches, teamMap, groupName
        );

        conditions.scenarios.push({
          label: `${isHome ? '主场' : '客场'} vs ${oppFlag} ${oppName}`,
          detail: '',
          type: 'own_match',
          matchId: match.id,
          opponent: oppName,
          opponentFlag: oppFlag,
          isHome,
          simResults
        });
      }
    } else {
      conditions.scenarios.push({
        label: '自身比赛',
        detail: '该队已无剩余比赛，出线完全取决于其他场次结果。',
        type: 'no_control'
      });
    }

    // 2b. 其他影响出线的比赛
    if (otherRemainingMatches.length > 0 && !tr.lockedTop2) {
      const criticalOthers = this.findCriticalOtherMatches(
        teamId, otherRemainingMatches, matches, teamMap, groupName, groupResult
      );
      if (criticalOthers.length > 0) {
        for (const co of criticalOthers) {
          conditions.scenarios.push({
            label: `关键战：${co.label}`,
            detail: co.detail,
            type: 'other_match'
          });
        }
      }
    }

    // ===== 3. 第三名跨组分析 =====
    if (tr.thirdPlaceRate > 1) {
      const thirdAnalysis = this.analyzeThirdPlaceCrossGroup(
        teamId, groupName, groupResult, allGroupResults
      );
      if (thirdAnalysis) {
        conditions.scenarios.push({
          label: '小组第三 · 跨组竞争',
          detail: thirdAnalysis.detail,
          type: 'third_place',
          thirdAnalysis
        });
      }
    }

    // ===== 4. 生成总结 =====
    conditions.summary = this.generateConditionSummary(conditions, opponents, teamMap);

    return conditions;
  },

  /**
   * 模拟自己一场比赛的三种结果对出线概率的影响
   */
  simulateOwnMatchOutcome(teamId, oppId, targetMatch, allMatches, teamMap, groupName) {
    const outcomes = [
      { label: '赢', homeScore: targetMatch.home === teamId ? 1 : 0, awayScore: targetMatch.home === teamId ? 0 : 1 },
      { label: '平', homeScore: 1, awayScore: 1 },
      { label: '输', homeScore: targetMatch.home === teamId ? 0 : 1, awayScore: targetMatch.home === teamId ? 1 : 0 }
    ];

    // 根据实际进球范围微调
    const resultScores = {
      win: targetMatch.home === teamId ? { hs: 2, as: 1 } : { hs: 1, as: 2 },
      draw: { hs: 1, as: 1 },
      lose: targetMatch.home === teamId ? { hs: 0, as: 1 } : { hs: 1, as: 0 }
    };

    const results = [];
    for (const key of ['win', 'draw', 'lose']) {
      const sc = resultScores[key];
      // 构建场景：固定此场比赛结果，穷举其他剩余比赛
      const fixedMatch = {
        ...targetMatch,
        homeScore: sc.hs,
        awayScore: sc.as,
        played: true
      };

      // 替换原比赛
      const modifiedMatches = allMatches.map(m =>
        m.id === targetMatch.id ? fixedMatch : { ...m }
      );

      const simResult = this.analyzeGroup(groupName, modifiedMatches, teamMap, false);
      const teamResult = simResult.results[teamId];
      if (teamResult) {
        const thirdEst = this.estimateThirdPlaceQualification(teamResult, simResult);
        const totalQual = teamResult.directQualifyRate +
          (teamResult.thirdPlaceRate / 100) * (thirdEst.qualifyProb / 100) * 100;

        results.push({
          outcome: key === 'win' ? '获胜' : key === 'draw' ? '战平' : '失利',
          outcomeShort: key === 'win' ? '赢' : key === 'draw' ? '平' : '输',
          directQualifyRate: teamResult.directQualifyRate,
          thirdPlaceRate: teamResult.thirdPlaceRate,
          totalQualifyRate: totalQual,
          avgPoints: teamResult.avgPoints,
          firstPlaceRate: teamResult.firstPlaceRate,
          secondPlaceRate: teamResult.secondPlaceRate,
        });
      }
    }

    return results;
  },

  /**
   * 找出对球队出线有重大影响的其他比赛
   */
  findCriticalOtherMatches(teamId, otherMatches, allMatches, teamMap, groupName, groupResult) {
    const critical = [];
    const tr = groupResult.results[teamId];
    if (!tr) return critical;

    for (const match of otherMatches) {
      const homeName = teamMap[match.home] ? teamMap[match.home].name : match.home;
      const awayName = teamMap[match.away] ? teamMap[match.away].name : match.away;

      // 模拟主队赢 vs 客队赢，比较对该队出线率的影响
      const winForHome = { ...match, homeScore: 1, awayScore: 0, played: true };
      const winForAway = { ...match, homeScore: 0, awayScore: 1, played: true };
      const drawResult = { ...match, homeScore: 1, awayScore: 1, played: true };

      const modHome = allMatches.map(m => m.id === match.id ? winForHome : { ...m });
      const modAway = allMatches.map(m => m.id === match.id ? winForAway : { ...m });

      const resHome = this.analyzeGroup(groupName, modHome, teamMap, false);
      const resAway = this.analyzeGroup(groupName, modAway, teamMap, false);

      const homeTeamRes = resHome.results[teamId];
      const awayTeamRes = resAway.results[teamId];

      if (homeTeamRes && awayTeamRes) {
        const homeDR = homeTeamRes.directQualifyRate || 0;
        const awayDR = awayTeamRes.directQualifyRate || 0;
        const diff = Math.abs(homeDR - awayDR);

        // 如果结果对出线率影响超过10%，视为关键比赛
        if (diff > 10) {
          const favorable = homeDR > awayDR ? `${homeName} 胜` : `${awayName} 胜`;
          critical.push({
            label: `${homeName} vs ${awayName}`,
            detail: `该场比赛结果对出线形势有显著影响。${favorable} 对该队更有利（出线概率差 ${diff.toFixed(0)}%）。`
          });
        }
      }
    }

    return critical;
  },

  /**
   * 第三名跨组竞争分析
   * 模拟所有12组，确定第三名晋级的典型分数线
   */
  analyzeThirdPlaceCrossGroup(teamId, groupName, groupResult, allGroupResults) {
    const allThirds = [];
    for (const [grp, result] of Object.entries(allGroupResults)) {
      if (!result || !result.results) continue;
      for (const [tid, r] of Object.entries(result.results)) {
        if (r.thirdPlaceRate > 5) {
          allThirds.push({
            teamId: tid, group: grp,
            avgPoints: r.avgPoints || 0,
            avgGoalDiff: r.avgGoalDiff || 0,
            avgGoalsFor: r.avgGoalsFor || 0,
            thirdPlaceRate: r.thirdPlaceRate || 0,
            thirdQualEstimate: r.thirdQualEstimate || 0,
          });
        }
      }
    }
    allThirds.sort((a, b) => b.avgPoints - a.avgPoints || b.avgGoalDiff - a.avgGoalDiff);

    const cutoff = allThirds.length >= 8 ? allThirds[7] : (allThirds.length > 0 ? allThirds[allThirds.length - 1] : null);
    const myThird = allThirds.find(t => t.teamId === teamId);
    if (!myThird) return null;

    const rank = allThirds.findIndex(t => t.teamId === teamId) + 1;
    let detail = '';

    // 找出前面和后面的竞争对手
    const ahead = []; // 排在本队前面的其他组第三名
    const behind = []; // 紧挨身后的其他组第三名
    for (let i = 0; i < allThirds.length; i++) {
      const t = allThirds[i];
      if (t.teamId === teamId || t.group === groupName) continue;
      if (i < rank - 1) ahead.push(t);
      else if (i < rank + 2) behind.push(t);
    }

    if (rank <= 8) {
      detail = `当前预期跨组排名第 ${rank}/12，处于晋级区（前8）。`;
      if (behind.length > 0) {
        detail += ` 身后有 ${behind.length} 个追赶者，需保持积分优势。`;
      }
    } else {
      detail = `当前预期跨组排名第 ${rank}/12，未进入前8晋级区。`;
      if (ahead.length > 0) {
        const closestAhead = ahead[ahead.length - 1];
        detail += ` 需超越至少1队（身前最近对手约${closestAhead.avgPoints.toFixed(1)}分）。`;
      }
    }

    // 生成具体条件：找其他组可能威胁或可超越的第三名
    const specificConditions = [];
    const focusTeams = rank <= 8 ? behind.slice(0, 3) : ahead.slice(-3);
    for (const comp of focusTeams) {
      const diff = comp.avgPoints - myThird.avgPoints;
      specificConditions.push({
        group: comp.group,
        teamId: comp.teamId,
        avgPoints: comp.avgPoints,
        pointDiff: diff,
        detail: `${comp.group}组第3名 (${comp.teamId})：预期 ${comp.avgPoints.toFixed(1)}分，${diff >= 0 ? '高' : '低'}于本队${Math.abs(diff).toFixed(1)}分`
      });
    }

    const ptsLevels = [6, 5, 4, 3, 2, 1];
    const ptsAnalysis = [];
    for (const pts of ptsLevels) {
      const above = allThirds.filter(t => t.avgPoints >= pts).length;
      const chance = above <= 8 ? '高' : above <= 10 ? '中' : '低';
      ptsAnalysis.push(`${pts}分+: ${above}队≥该线→${chance}`);
    }

    return {
      detail, specificConditions,
      myRank: rank,
      totalThirdCandidates: allThirds.length,
      cutoffPoints: cutoff ? cutoff.avgPoints : 0,
      cutoffGoalDiff: cutoff ? cutoff.avgGoalDiff : 0,
      myAvgPoints: myThird.avgPoints,
      myAvgGoalDiff: myThird.avgGoalDiff,
      ptsAnalysis: ptsAnalysis.join('；'),
    };
  },

  /**
   * 生成跨组具体比赛条件
   * 分析其他组剩余比赛，找出对本队第三名晋级有直接影响的场次
   */
  getCrossGroupMatchConditions(teamId, groupName, allMatches, teamMap, allGroupResults) {
    const conditions = [];
    const myGroup = allGroupResults[groupName];
    if (!myGroup || !myGroup.results) return conditions;

    const myResult = myGroup.results[teamId];
    if (!myResult || myResult.thirdPlaceRate < 5) return conditions;

    const myThirdPts = myResult.avgPoints || 0;

    // 遍历其他11个组
    for (const [grp, result] of Object.entries(allGroupResults)) {
      if (grp === groupName || !result || !result.results) continue;

      const grpMatches = allMatches[grp] || [];
      const grpRemaining = grpMatches.filter(m => m.homeScore === null || m.awayScore === null);
      if (grpRemaining.length === 0) continue;

      // 找出该组可能拿第三的球队
      for (const [tid, r] of Object.entries(result.results)) {
        if (r.thirdPlaceRate < 15 || r.avgPoints < myThirdPts - 0.5) continue;

        const candTeam = teamMap[tid];
        if (!candTeam) continue;

        // 找该候选人剩余比赛
        const candRemaining = grpRemaining.filter(m => m.home === tid || m.away === tid);
        for (const match of candRemaining) {
          const oppId = match.home === tid ? match.away : match.home;
          const oppTeam = teamMap[oppId];
          if (!oppTeam) continue;

          // 模拟：候选人输球 vs 赢球，看本队排名变化
          const loseForCand = match.home === tid ? { hs: 0, as: 2 } : { hs: 2, as: 0 };
          const fixedLose = { ...match, homeScore: loseForCand.hs, awayScore: loseForCand.as, played: true };
          const modMatches = grpMatches.map(m => m.id === match.id ? fixedLose : { ...m });
          const simLose = this.analyzeGroup(grp, modMatches, teamMap, false);
          const candLose = simLose.results[tid];

          if (candLose && candLose.avgPoints < myThirdPts) {
            conditions.push({
              group: grp,
              detail: `期望 ${oppTeam.flag}${oppTeam.name} 战胜 ${candTeam.flag}${candTeam.name}，降低${grp}组第三名积分`,
              opponentTeam: oppTeam.name,
              candidateTeam: candTeam.name,
            });
            break; // 每组只取一个最有效条件
          }
        }
      }
    }

    return conditions.slice(0, 6); // 最多返回6条
  },

  /**
   * 生成出线条件总结
   */
  generateConditionSummary(conditions, opponents, teamMap) {
    const tr = conditions;
    const parts = [];

    // 看自己比赛的模拟结果
    const ownScenarios = conditions.scenarios.filter(s => s.type === 'own_match');
    for (const sc of ownScenarios) {
      if (sc.simResults && sc.simResults.length > 0) {
        const winResult = sc.simResults.find(r => r.outcomeShort === '赢');
        const drawResult = sc.simResults.find(r => r.outcomeShort === '平');
        const loseResult = sc.simResults.find(r => r.outcomeShort === '输');

        if (winResult && winResult.directQualifyRate > 99) {
          parts.push(`✅ 只要${winResult.outcome}${sc.opponent}，即可确保直接出线`);
        } else if (winResult && winResult.totalQualifyRate > 95) {
          parts.push(`🟢 ${winResult.outcome}${sc.opponent}：总出线概率 ${winResult.totalQualifyRate.toFixed(0)}%`);
        } else if (winResult && winResult.totalQualifyRate > 50) {
          parts.push(`🟡 ${winResult.outcome}${sc.opponent}：总出线率 ${winResult.totalQualifyRate.toFixed(0)}%`);
        }

        if (drawResult && drawResult.totalQualifyRate > 60) {
          parts.push(`🤝 战平${sc.opponent}：总出线率 ${drawResult.totalQualifyRate.toFixed(0)}%`);
        }

        if (loseResult && loseResult.totalQualifyRate < 5) {
          parts.push(`⚠️ 输给${sc.opponent}则出线概率极低（${loseResult.totalQualifyRate.toFixed(1)}%）`);
        }
      }
    }

    if (parts.length === 0 && tr.totalQualifyRate > 0 && tr.totalQualifyRate < 99.99) {
      parts.push(`当前总出线概率 ${tr.totalQualifyRate.toFixed(1)}%，形势未定。`);
    }

    // 第三名路径
    if (tr.thirdPlaceRate > 5 && tr.directQualifyRate < 90) {
      const thirdSc = conditions.scenarios.find(s => s.type === 'third_place');
      if (thirdSc && thirdSc.thirdAnalysis) {
        parts.push(`📊 小组第三路径：预期 ${thirdSc.thirdAnalysis.myAvgPoints.toFixed(1)} 分，跨组排名第 ${thirdSc.thirdAnalysis.myRank}/12。`);
      }
    }

    return parts.join('；') || '形势复杂，请查看下方详细分析。';
  },

  /**
   * 获取具体出线路径（编号条件列表）
   * 返回出线需要满足的具体条件，按路径分组
   */
  getQualificationPaths(teamId, groupName, matches, teamMap, groupResult, allGroupResults) {
    const tr = groupResult.results[teamId];
    if (!tr) return { paths: [], summary: '暂无数据' };

    const paths = [];
    const teamInfo = teamMap[teamId];
    const remainingMatches = matches.filter(m => m.homeScore === null || m.awayScore === null);
    const myRemaining = remainingMatches.filter(m => m.home === teamId || m.away === teamId);
    const otherRemaining = remainingMatches.filter(m => m.home !== teamId && m.away !== teamId);
    const playedMatches = matches.filter(m => m.homeScore !== null && m.awayScore !== null);

    // 已锁定
    if (tr.lockedTop2) {
      const pos = tr.lockedFirst ? '小组第一' : tr.lockedSecond ? '小组第二' : '小组前二';
      return {
        paths: [{ label: '已锁定出线', probability: 100, conditions: [
          { idx: 1, detail: `✅ 无论剩余比赛结果如何，已确保以${pos}身份直接出线`, type: 'locked' }
        ]}],
        summary: `🥇 已锁定${pos}！`
      };
    }

    // 已出局
    if (tr.totalQualifyRate < 0.01) {
      return {
        paths: [{ label: '已出局', probability: 0, conditions: [
          { idx: 1, detail: '💀 所有出线路径均已断绝，下届再战', type: 'out' }
        ]}],
        summary: '💀 已确定出局'
      };
    }

    // 分析每条出线路径

    // 对自身比赛穷举，分析条件
    if (myRemaining.length > 0) {
      const ownMatch = myRemaining[0]; // 取第一场自身剩余比赛
      const oppId = ownMatch.home === teamId ? ownMatch.away : ownMatch.home;
      const oppName = teamMap[oppId] ? teamMap[oppId].name : oppId;
      const oppFlag = teamMap[oppId] ? teamMap[oppId].flag : '';

      // 模拟：赢/平/输
      for (const outcome of [
        { key: 'win', label: '获胜', hs: ownMatch.home === teamId ? 2 : 1, as: ownMatch.home === teamId ? 1 : 2 },
        { key: 'draw', label: '战平', hs: 1, as: 1 },
        { key: 'lose', label: '失利', hs: ownMatch.home === teamId ? 0 : 1, as: ownMatch.home === teamId ? 1 : 0 }
      ]) {
        const fixedOwn = { ...ownMatch, homeScore: outcome.hs, awayScore: outcome.as, played: true };
        const modMatches = matches.map(m => m.id === ownMatch.id ? fixedOwn : { ...m });
        const simResult = this.analyzeGroup(groupName, modMatches, teamMap, false);
        const sr = simResult.results[teamId];
        if (!sr) continue;

        const thirdEst = this.estimateThirdPlaceQualification(sr, simResult);
        const totalQ = sr.directQualifyRate + (sr.thirdPlaceRate / 100) * (thirdEst.qualifyProb / 100) * 100;

        if (totalQ > 10) {
          const conditions = [];
          let condIdx = 1;

          // 自身条件
          conditions.push({
            idx: condIdx++, detail: `${oppFlag} ${outcome.label === '获胜' ? '战胜' : outcome.label} ${oppName}`, type: 'own'
          });

          // 分析其他比赛的关键条件
          if (sr.directQualifyRate < 99.9 && sr.directQualifyRate > 0 && otherRemaining.length > 0) {
            const critical = this.findCriticalConditions(teamId, groupName, modMatches, teamMap, sr, otherRemaining);
            for (const c of critical) {
              conditions.push({ idx: condIdx++, detail: c, type: 'other' });
            }
          }

          // 净胜球条件
          if (sr.directQualifyRate > 0 && sr.directQualifyRate < 95) {
            const standings = Rules.computeStandings(simResult.teams, modMatches.filter(m => m.homeScore !== null && m.awayScore !== null));
            const myStanding = standings.find(s => s.teamId === teamId);
            const rival = standings.find(s => s.rank === 2 || (s.rank === 3 && s.teamId !== teamId));
            if (myStanding && rival && Math.abs(myStanding.points - rival.points) < 2) {
              conditions.push({ idx: condIdx++, detail: `需确保净胜球优势（当前${myStanding.goalDiff}，对手${rival.goalDiff}）`, type: 'gd' });
            }
          }

          // 第三名路径
          if (sr.thirdPlaceRate > 10 && sr.directQualifyRate < 80) {
            const thirAnalysis = this.analyzeThirdPlaceCrossGroup(teamId, groupName, simResult, allGroupResults);
            if (thirAnalysis) {
              conditions.push({
                idx: condIdx++,
                detail: `如获小组第三：需跨组排名前8/12（预期${thirAnalysis.myAvgPoints.toFixed(1)}分排第${thirAnalysis.myRank}，第8线约${thirAnalysis.cutoffPoints.toFixed(1)}分）`,
                type: 'third'
              });
            }
          }

          const pathLabel = outcome.key === 'win' ? '路径A：取胜路线' : outcome.key === 'draw' ? '路径B：战平路线' : '路径C：失利路线（靠其他结果）';
          if (conditions.length > 0 && totalQ > 5) {
            paths.push({
              label: pathLabel,
              probability: totalQ,
              conditions,
              totalQualifyRate: totalQ,
              directQualifyRate: sr.directQualifyRate,
            });
          }
        }
      }
    } else {
      // 无自身剩余比赛，完全依赖其他场次
      const conditions = [];
      let condIdx = 1;
      conditions.push({ idx: condIdx++, detail: '自身比赛已全部结束，出线完全取决于其他场次结果', type: 'no_control' });

      if (otherRemaining.length > 0) {
        const critical = this.findCriticalConditions(teamId, groupName, matches, teamMap, tr, otherRemaining);
        for (const c of critical) {
          conditions.push({ idx: condIdx++, detail: c, type: 'other' });
        }
      }

      if (tr.thirdPlaceRate > 5) {
        const thirAnalysis = this.analyzeThirdPlaceCrossGroup(teamId, groupName, groupResult, allGroupResults);
        if (thirAnalysis) {
          conditions.push({
            idx: condIdx++,
            detail: `小组第三路径：跨组排名第${thirAnalysis.myRank}/12（第8线约${thirAnalysis.cutoffPoints.toFixed(1)}分，预期${thirAnalysis.myAvgPoints.toFixed(1)}分）`,
            type: 'third'
          });
        }
      }

      if (conditions.length > 0) {
        paths.push({ label: '等待其他结果', probability: tr.totalQualifyRate || 0, conditions });
      }
    }

    // 按概率排序
    paths.sort((a, b) => b.probability - a.probability);

    // 生成总结
    let summary = '';
    if (paths.length > 0 && paths[0].probability > 80) {
      summary = `🟢 最优路径：${paths[0].label}，出线概率 ${paths[0].probability.toFixed(0)}%`;
    } else if (paths.length > 0 && paths[0].probability > 40) {
      summary = `🟡 ${paths[0].label}，出线概率 ${paths[0].probability.toFixed(0)}%`;
    } else if (paths.length > 0) {
      summary = `🔴 形势严峻，最佳路径概率 ${paths[0].probability.toFixed(0)}%`;
    }

    return { paths, summary };
  },

  /**
   * 找出对特定球队出线关键的其他比赛条件
   */
  findCriticalConditions(teamId, groupName, matches, teamMap, teamResult, otherMatches) {
    const critical = [];

    for (const match of otherMatches) {
      const homeName = teamMap[match.home] ? teamMap[match.home].name : match.home;
      const awayName = teamMap[match.away] ? teamMap[match.away].name : match.away;
      const homeFlag = teamMap[match.home] ? teamMap[match.home].flag : '';
      const awayFlag = teamMap[match.away] ? teamMap[match.away].flag : '';

      // 模拟三种结果对该队出线的影响
      const outcomes = [
        { label: `${homeFlag}${homeName} 胜`, hs: 2, as: 0 },
        { label: `${awayFlag}${awayName} 胜`, hs: 0, as: 2 },
        { label: '双方战平', hs: 1, as: 1 }
      ];

      let bestRate = -1, bestLabel = '';
      for (const oc of outcomes) {
        const fixed = { ...match, homeScore: oc.hs, awayScore: oc.as, played: true };
        const mod = matches.map(m => m.id === match.id ? fixed : { ...m });
        const sim = this.analyzeGroup(groupName, mod, teamMap, false);
        const sr = sim.results[teamId];
        if (sr) {
          const rate = sr.directQualifyRate || 0;
          if (rate > bestRate) { bestRate = rate; bestLabel = oc.label; }
        }
      }

      // 如果某种结果比当前直接出线率高15%以上，为关键条件
      if (bestRate - (teamResult.directQualifyRate || 0) > 15) {
        critical.push(`需要 ${bestLabel}（${homeName} vs ${awayName}）`);
      }
    }

    return critical;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Engine;
}
