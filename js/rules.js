/**
 * FIFA 官方排名规则实现
 * 小组排名 + 跨组第三名比较
 */

const Rules = {
  /**
   * 计算单场比赛的积分贡献
   * @returns {object} { homePoints, awayPoints, homeGoals, awayGoals }
   */
  getMatchResult(match) {
    const hg = match.homeScore;
    const ag = match.awayScore;
    if (hg === null || ag === null) return null;

    let homePoints = 0, awayPoints = 0;
    if (hg > ag) homePoints = 3;
    else if (hg < ag) awayPoints = 3;
    else { homePoints = 1; awayPoints = 1; }

    return { homePoints, awayPoints, homeGoals: hg, awayGoals: ag };
  },

  /**
   * 计算小组积分榜
   * @param {Array} teams - 该组4支球队的ID列表
   * @param {Array} matches - 该组6场比赛（含比分）
   * @returns {Array} 按排名排序的积分榜
   */
  computeStandings(teams, matches) {
    // 初始化积分
    const stats = {};
    teams.forEach(tid => {
      stats[tid] = {
        teamId: tid,
        played: 0, wins: 0, draws: 0, losses: 0,
        goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0,
        // 相互战绩缓存（仅针对当前TIE组）
        h2h: {}
      };
    });

    // 统计所有已完赛比赛
    matches.forEach(m => {
      if (m.homeScore === null || m.awayScore === null) return;

      const hg = m.homeScore, ag = m.awayScore;
      const hid = m.home, aid = m.away;

      // 主队
      stats[hid].played++;
      stats[hid].goalsFor += hg;
      stats[hid].goalsAgainst += ag;
      // 客队
      stats[aid].played++;
      stats[aid].goalsFor += ag;
      stats[aid].goalsAgainst += hg;

      if (hg > ag) {
        stats[hid].wins++;
        stats[hid].points += 3;
        stats[aid].losses++;
      } else if (hg < ag) {
        stats[aid].wins++;
        stats[aid].points += 3;
        stats[hid].losses++;
      } else {
        stats[hid].draws++;
        stats[aid].draws++;
        stats[hid].points += 1;
        stats[aid].points += 1;
      }

      // 记录相互战绩
      stats[hid].h2h[aid] = { gf: hg, ga: ag };
      stats[aid].h2h[hid] = { gf: ag, ga: hg };
    });

    // 计算净胜球
    teams.forEach(tid => {
      stats[tid].goalDiff = stats[tid].goalsFor - stats[tid].goalsAgainst;
    });

    // 排序
    const standings = teams.map(tid => stats[tid]);
    standings.sort((a, b) => this.compareTeams(a, b, stats));

    // 标记排名
    standings.forEach((s, i) => { s.rank = i + 1; });

    return standings;
  },

  /**
   * 两支球队的比较函数（FIFA规则优先级）
   * 返回负数表示 a 排名在 b 之前
   */
  compareTeams(a, b, allStats) {
    // ① 积分
    if (a.points !== b.points) return b.points - a.points;

    // 积分相同，需要TIE-breaking
    // 找出所有与这两个队同分的队伍
    const tiedTeams = [];
    for (const tid in allStats) {
      if (allStats[tid].points === a.points) {
        tiedTeams.push(tid);
      }
    }

    // 如果只有这两队同分
    if (tiedTeams.length === 2) {
      return this.compareTwoTied(a, b, allStats);
    }

    // 多队同分
    return this.compareMultiTied(a, b, allStats, tiedTeams);
  },

  /**
   * 两队同分时的比较
   */
  compareTwoTied(a, b, allStats) {
    // ② 全量净胜球
    if (a.goalDiff !== b.goalDiff) return b.goalDiff - a.goalDiff;
    // ③ 全量总进球
    if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor;
    // ④ 相互比赛积分
    const h2hPts = this.getH2HPoints(a, b);
    if (h2hPts.a !== h2hPts.b) return h2hPts.b - h2hPts.a;
    // ⑤ 相互比赛净胜球
    const h2hGD = this.getH2HGoalDiff(a, b);
    if (h2hGD.a !== h2hGD.b) return h2hGD.b - h2hGD.a;
    // ⑥ 相互比赛进球
    const h2hGF = this.getH2HGoals(a, b);
    if (h2hGF.a !== h2hGF.b) return h2hGF.b - h2hGF.a;
    // 无法区分 → TIE
    return 0;
  },

  /**
   * 多队同分时的比较（FIFA规则：先全量，再H2H小联赛）
   */
  compareMultiTied(a, b, allStats, tiedTeams) {
    // ② 全量净胜球
    if (a.goalDiff !== b.goalDiff) return b.goalDiff - a.goalDiff;
    // ③ 全量总进球
    if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor;

    // ④-⑥ 构建H2H小联赛（仅涉及TIE队之间的比赛）
    const h2hMini = this.buildH2HMiniLeague(tiedTeams, allStats);
    const h2hA = h2hMini[a.teamId];
    const h2hB = h2hMini[b.teamId];

    // ④ H2H小联赛积分
    if (h2hA.pts !== h2hB.pts) return h2hB.pts - h2hA.pts;
    // ⑤ H2H小联赛净胜球
    if (h2hA.gd !== h2hB.gd) return h2hB.gd - h2hA.gd;
    // ⑥ H2H小联赛进球
    if (h2hA.gf !== h2hB.gf) return h2hB.gf - h2hA.gf;

    // 无法区分 → TIE
    return 0;
  },

  /**
   * 构建H2H小联赛（仅TIE队之间的相互比赛）
   */
  buildH2HMiniLeague(tiedTeamIds, allStats) {
    const mini = {};
    tiedTeamIds.forEach(tid => {
      mini[tid] = { pts: 0, gf: 0, ga: 0, gd: 0 };
    });

    for (let i = 0; i < tiedTeamIds.length; i++) {
      for (let j = i + 1; j < tiedTeamIds.length; j++) {
        const tA = tiedTeamIds[i];
        const tB = tiedTeamIds[j];
        const h2hA = allStats[tA].h2h[tB];
        const h2hB = allStats[tB].h2h[tA];

        if (!h2hA || !h2hB) continue;

        mini[tA].gf += h2hA.gf;
        mini[tA].ga += h2hA.ga;
        mini[tB].gf += h2hB.gf;
        mini[tB].ga += h2hB.ga;

        if (h2hA.gf > h2hA.ga) mini[tA].pts += 3;
        else if (h2hA.gf < h2hA.ga) mini[tB].pts += 3;
        else { mini[tA].pts += 1; mini[tB].pts += 1; }
      }
    }

    for (const tid in mini) {
      mini[tid].gd = mini[tid].gf - mini[tid].ga;
    }

    return mini;
  },

  /** 两队H2H积分 */
  getH2HPoints(a, b) {
    const h2h = a.h2h[b.teamId];
    if (!h2h) return { a: 0, b: 0 };
    if (h2h.gf > h2h.ga) return { a: 3, b: 0 };
    if (h2h.gf < h2h.ga) return { a: 0, b: 3 };
    return { a: 1, b: 1 };
  },

  /** 两队H2H净胜球 */
  getH2HGoalDiff(a, b) {
    const h2h = a.h2h[b.teamId];
    if (!h2h) return { a: 0, b: 0 };
    return { a: h2h.gf - h2h.ga, b: h2h.ga - h2h.gf };
  },

  /** 两队H2H进球 */
  getH2HGoals(a, b) {
    const h2h = a.h2h[b.teamId];
    if (!h2h) return { a: 0, b: 0 };
    return { a: h2h.gf, b: h2h.ga };
  },

  /**
   * 跨组第三名比较（12选8）
   * @param {Array} thirdPlaceTeams - [{teamId, points, goalDiff, goalsFor, group}, ...]
   * @returns {Array} 排序后的第三名列表，前8标记qualified=true
   */
  rankThirdPlaces(thirdPlaceTeams) {
    const sorted = [...thirdPlaceTeams].sort((a, b) => {
      // ① 积分
      if (b.points !== a.points) return b.points - a.points;
      // ② 净胜球
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      // ③ 总进球
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      // ④ 公平竞赛（假设相同）
      // ⑤ 抽签 → TIE
      return 0;
    });

    // 标记前8晋级
    sorted.forEach((t, i) => {
      t.thirdRank = i + 1;
      t.qualifiedAsThird = i < 8;
    });

    return sorted;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Rules;
}
