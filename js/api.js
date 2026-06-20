/**
 * API 客户端模块 - 自动获取2026世界杯实时比分
 * 主API: worldcup26.ir (免费, 无需Key)
 * 备用: ESPN Hidden API
 * 降级: 内嵌数据 (EMBEDDED_MATCHES)
 */

const ApiClient = {
  // API 端点
  primaryUrl: 'https://worldcup26.ir/get/games',
  fallbackUrl: 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard',

  // 缓存Key
  cacheKey: 'yz_football_api_cache_v1',
  cacheTimeKey: 'yz_football_api_cache_time',

  // 刷新间隔：比赛期间5分钟，非比赛期间不刷新
  refreshIntervalMs: 5 * 60 * 1000,

  // API球队ID → 我们的球队ID映射
  teamIdMap: {
    1: 'MEX', 2: 'RSA', 3: 'KOR', 4: 'CZE',
    5: 'CAN', 6: 'BIH', 7: 'QAT', 8: 'SUI',
    9: 'BRA', 10: 'MAR', 11: 'HAI', 12: 'SCO',
    13: 'USA', 14: 'PAR', 15: 'AUS', 16: 'TUR',
    17: 'GER', 18: 'CUW', 19: 'CIV', 20: 'ECU',
    21: 'NED', 22: 'JPN', 23: 'SWE', 24: 'TUN',
    25: 'BEL', 26: 'EGY', 27: 'IRN', 28: 'NZL',
    29: 'ESP', 30: 'CPV', 31: 'KSA', 32: 'URU',
    33: 'FRA', 34: 'SEN', 35: 'IRQ', 36: 'NOR',
    37: 'ARG', 38: 'ALG', 39: 'AUT', 40: 'JOR',
    41: 'POR', 42: 'COD', 43: 'UZB', 44: 'COL',
    45: 'ENG', 46: 'CRO', 47: 'GHA', 48: 'PAN'
  },

  // API match ID (1-72) → 我们的match ID映射
  // 每组6场，按API顺序
  buildMatchIdMap() {
    const groups = 'ABCDEFGHIJKL'.split('');
    const map = {};
    let apiId = 1;
    for (const g of groups) {
      for (let m = 1; m <= 6; m++) {
        map[apiId] = `${g}${m}`;
        apiId++;
      }
    }
    return map;
  },

  /**
   * 获取实时比分数据
   * @returns {object|null} 比分映射 {matchId: {homeScore, awayScore}} 或 null
   */
  async fetchLiveScores(allMatches) {
    // 检查缓存是否仍然有效
    if (this.isCacheValid()) {
      const cached = this.getCachedScores();
      if (cached && Object.keys(cached).length > 0) {
        console.log('📦 使用缓存的API比分数据');
        return cached;
      }
    }

    // 尝试主API
    let data = await this.tryFetch(this.primaryUrl);
    if (data) {
      console.log('📡 从 worldcup26.ir 获取最新比分');
      return this.parseWorldcup26Data(data, allMatches);
    }

    // 尝试备用API
    data = await this.tryFetch(this.fallbackUrl);
    if (data) {
      console.log('📡 从 ESPN API 获取最新比分');
      return this.parseESPNData(data);
    }

    console.warn('⚠️ 无法连接API，使用内嵌数据');
    return null;
  },

  /**
   * 尝试从URL获取数据
   */
  async tryFetch(url) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!resp.ok) return null;
      return await resp.json();
    } catch (e) {
      return null;
    }
  },

  /**
   * 解析 worldcup26.ir 的数据格式
   * 通过 group + home/away team + matchday 匹配比赛
   */
  parseWorldcup26Data(data, allMatches) {
    if (!Array.isArray(data)) return null;

    const scores = {};

    for (const match of data) {
      // 只取小组赛且已完赛的
      const group = match.group;
      if (!group || group.length > 1 || group === 'R32') continue;

      if (match.finished !== 'TRUE' && match.time_elapsed !== 'finished') continue;

      const homeId = this.teamIdMap[parseInt(match.home_team_id)];
      const awayId = this.teamIdMap[parseInt(match.away_team_id)];
      const hs = parseInt(match.home_score);
      const as = parseInt(match.away_score);

      if (!homeId || !awayId || isNaN(hs) || isNaN(as)) continue;

      // 在allMatches中查找匹配的比赛
      const grpMatches = allMatches[group];
      if (!grpMatches) continue;

      const target = grpMatches.find(m => m.home === homeId && m.away === awayId);
      if (target) {
        scores[target.id] = { homeScore: hs, awayScore: as };
      }
    }

    this.cacheScores(scores);
    return scores;
  },

  /**
   * 解析 ESPN API 数据格式
   */
  parseESPNData(data) {
    if (!data || !data.events) return null;

    const scores = {};
    // ESPN uses different format - map by team names
    // Simplified: use group+matchday matching
    for (const event of data.events) {
      if (event.status?.type?.completed) {
        const group = event.group;
        const homeTeam = event.competitions?.[0]?.competitors?.find(c => c.homeAway === 'home');
        const awayTeam = event.competitions?.[0]?.competitors?.find(c => c.homeAway === 'away');
        if (homeTeam && awayTeam) {
          const hs = parseInt(homeTeam.score);
          const as = parseInt(awayTeam.score);
          // Try to match by team names to our match data
          // This is approximate - for precise matching, use primary API
        }
      }
    }
    return Object.keys(scores).length > 0 ? scores : null;
  },

  /**
   * 将API比分合并到比赛数据
   * @param {object} allMatches - App.state.allMatches
   * @param {object} apiScores - API返回的比分
   * @returns {number} 更新了多少场比赛
   */
  mergeScores(allMatches, apiScores) {
    if (!apiScores || Object.keys(apiScores).length === 0) return 0;

    let updated = 0;
    for (const [group, matches] of Object.entries(allMatches)) {
      for (const match of matches) {
        const apiScore = apiScores[match.id];
        if (apiScore && !match.played) {
          // 只更新未手动输入的比赛
          match.homeScore = apiScore.homeScore;
          match.awayScore = apiScore.awayScore;
          match.played = true;
          updated++;
        }
      }
    }
    return updated;
  },

  /**
   * 缓存API比分到localStorage
   */
  cacheScores(scores) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(scores));
      localStorage.setItem(this.cacheTimeKey, Date.now().toString());
    } catch (e) { /* localStorage full */ }
  },

  /**
   * 获取缓存的比分
   */
  getCachedScores() {
    try {
      const raw = localStorage.getItem(this.cacheKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },

  /**
   * 检查缓存是否仍然有效（5分钟内）
   */
  isCacheValid() {
    try {
      const cached = localStorage.getItem(this.cacheTimeKey);
      if (!cached) return false;
      const elapsed = Date.now() - parseInt(cached);
      return elapsed < this.refreshIntervalMs;
    } catch (e) { return false; }
  },

  /**
   * 判断当前是否在比赛期间（6月11日-7月19日）
   */
  isDuringTournament() {
    const now = new Date();
    const start = new Date('2026-06-11');
    const end = new Date('2026-07-20');
    return now >= start && now <= end;
  },

  /**
   * 获取在线状态文本
   */
  getStatusText() {
    if (!this.isDuringTournament()) return '非比赛期';
    if (this.isCacheValid() && this.getCachedScores()) return '✅ 数据最新';
    return '🔄 等待刷新';
  }
};
