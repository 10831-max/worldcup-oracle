/**
 * 颜色状态系统 - 概率 → 颜色映射
 * 完全由数学计算结果自动分配，无需人工干预
 */

const ColorSystem = {
  // 颜色阈值配置
  thresholds: {
    locked: 100,       // = 100% → 已锁定
    safe: 66.67,       // > 66.67% → 稳
    hopeful: 33.33,    // 33.33% ~ 66.67% → 有戏
    slim: 0            // < 33.33% 且 > 0% → 悬
    // = 0% → 已出局
  },

  /**
   * 根据出线概率获取颜色状态
   * @param {number} rate - 出线概率百分比 (0-100)
   * @param {object} extras - 附加信息 {lockedFirst, lockedSecond, lockedTop2}
   * @returns {object} { label, color, cssClass, icon, description }
   */
  getStatus(rate, extras = {}) {
    const { lockedFirst, lockedSecond, lockedTop2 } = extras;

    // 已锁定小组第一
    if (lockedFirst && rate >= 99.99) {
      return {
        label: '已锁定头名',
        color: '#FFD700',
        bgColor: 'rgba(255,215,0,0.15)',
        cssClass: 'status-gold',
        icon: '🥇',
        level: 6,
        description: '无论剩余场次结果如何，已确保小组第一出线'
      };
    }

    // 已锁定小组第二
    if (lockedSecond && rate >= 99.99) {
      return {
        label: '已锁定第二',
        color: '#C0C0C0',
        bgColor: 'rgba(192,192,192,0.15)',
        cssClass: 'status-silver',
        icon: '🥈',
        level: 5,
        description: '无论剩余场次结果如何，已确保以小组第二出线'
      };
    }

    // = 100% → 已锁定（前二但不一定是第几）
    if (rate >= 99.99) {
      return {
        label: '已锁定出线',
        color: '#00C853',
        bgColor: 'rgba(0,200,83,0.12)',
        cssClass: 'status-locked',
        icon: '✅',
        level: 4,
        description: '无论剩余场次结果如何，已确保出线'
      };
    }

    // > 66.67% → 稳 (偏绿)
    if (rate > this.thresholds.safe) {
      return {
        label: '稳',
        color: '#4CAF50',
        bgColor: 'rgba(76,175,80,0.10)',
        cssClass: 'status-safe',
        icon: '🟢',
        level: 3,
        description: '出线形势乐观，大概率晋级'
      };
    }

    // 33.33% ~ 66.67% → 有戏 (中间色)
    if (rate >= this.thresholds.hopeful) {
      return {
        label: '有戏',
        color: '#FF9800',
        bgColor: 'rgba(255,152,0,0.08)',
        cssClass: 'status-hopeful',
        icon: '🟡',
        level: 2,
        description: '出线有希望但存在变数，需继续努力'
      };
    }

    // > 0% → 悬 (偏黑)
    if (rate > 0) {
      return {
        label: '悬',
        color: '#757575',
        bgColor: 'rgba(117,117,117,0.08)',
        cssClass: 'status-slim',
        icon: '⚫',
        level: 1,
        description: '出线形势严峻，需要奇迹'
      };
    }

    // = 0% → 已出局
    return {
      label: '已出局',
      color: '#212121',
      bgColor: 'rgba(33,33,33,0.06)',
      cssClass: 'status-out',
      icon: '💀',
      level: 0,
      description: '无论如何都已无法出线'
    };
  },

  /**
   * 获取颜色对应的渐变背景（用于进度条）
   */
  getProgressGradient(rate) {
    if (rate >= 99.99) return 'linear-gradient(90deg, #00C853, #69F0AE)';
    if (rate > 66.67) return 'linear-gradient(90deg, #4CAF50, #81C784)';
    if (rate >= 33.33) return 'linear-gradient(90deg, #FF9800, #FFB74D)';
    if (rate > 0) return 'linear-gradient(90deg, #757575, #BDBDBD)';
    return 'linear-gradient(90deg, #424242, #616161)';
  },

  /**
   * 获取概率对应的文本颜色
   */
  getTextColor(rate) {
    if (rate >= 99.99) return '#00C853';
    if (rate > 66.67) return '#4CAF50';
    if (rate >= 33.33) return '#FF9800';
    if (rate > 0) return '#757575';
    return '#424242';
  }
};

// 支持 ES Module 和直接引入
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ColorSystem;
}
