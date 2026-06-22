/**
 * 内嵌数据层 - 2026世界杯 48支球队 + 72场比赛 + 实际赛果
 * 数据来源：FIFA官方抽签结果（2025年12月）+ 实际比赛结果
 * 最后更新：2026-06-22
 */

const EMBEDDED_TEAMS = [
  // ===== A组（墨西哥主场）=====
  {"id":"MEX","name":"墨西哥","nameEn":"Mexico","group":"A","flag":"🇲🇽","confederation":"CONCACAF"},
  {"id":"KOR","name":"韩国","nameEn":"South Korea","group":"A","flag":"🇰🇷","confederation":"AFC"},
  {"id":"CZE","name":"捷克","nameEn":"Czechia","group":"A","flag":"🇨🇿","confederation":"UEFA"},
  {"id":"RSA","name":"南非","nameEn":"South Africa","group":"A","flag":"🇿🇦","confederation":"CAF"},
  // ===== B组（加拿大主场）=====
  {"id":"CAN","name":"加拿大","nameEn":"Canada","group":"B","flag":"🇨🇦","confederation":"CONCACAF"},
  {"id":"SUI","name":"瑞士","nameEn":"Switzerland","group":"B","flag":"🇨🇭","confederation":"UEFA"},
  {"id":"QAT","name":"卡塔尔","nameEn":"Qatar","group":"B","flag":"🇶🇦","confederation":"AFC"},
  {"id":"BIH","name":"波黑","nameEn":"Bosnia and Herzegovina","group":"B","flag":"🇧🇦","confederation":"UEFA"},
  // ===== C组 =====
  {"id":"BRA","name":"巴西","nameEn":"Brazil","group":"C","flag":"🇧🇷","confederation":"CONMEBOL"},
  {"id":"MAR","name":"摩洛哥","nameEn":"Morocco","group":"C","flag":"🇲🇦","confederation":"CAF"},
  {"id":"SCO","name":"苏格兰","nameEn":"Scotland","group":"C","flag":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","confederation":"UEFA"},
  {"id":"HAI","name":"海地","nameEn":"Haiti","group":"C","flag":"🇭🇹","confederation":"CONCACAF"},
  // ===== D组（美国主场）=====
  {"id":"USA","name":"美国","nameEn":"USA","group":"D","flag":"🇺🇸","confederation":"CONCACAF"},
  {"id":"AUS","name":"澳大利亚","nameEn":"Australia","group":"D","flag":"🇦🇺","confederation":"AFC"},
  {"id":"PAR","name":"巴拉圭","nameEn":"Paraguay","group":"D","flag":"🇵🇾","confederation":"CONMEBOL"},
  {"id":"TUR","name":"土耳其","nameEn":"Türkiye","group":"D","flag":"🇹🇷","confederation":"UEFA"},
  // ===== E组 =====
  {"id":"GER","name":"德国","nameEn":"Germany","group":"E","flag":"🇩🇪","confederation":"UEFA"},
  {"id":"ECU","name":"厄瓜多尔","nameEn":"Ecuador","group":"E","flag":"🇪🇨","confederation":"CONMEBOL"},
  {"id":"CIV","name":"科特迪瓦","nameEn":"Côte d'Ivoire","group":"E","flag":"🇨🇮","confederation":"CAF"},
  {"id":"CUW","name":"库拉索","nameEn":"Curaçao","group":"E","flag":"🇨🇼","confederation":"CONCACAF"},
  // ===== F组 =====
  {"id":"NED","name":"荷兰","nameEn":"Netherlands","group":"F","flag":"🇳🇱","confederation":"UEFA"},
  {"id":"JPN","name":"日本","nameEn":"Japan","group":"F","flag":"🇯🇵","confederation":"AFC"},
  {"id":"SWE","name":"瑞典","nameEn":"Sweden","group":"F","flag":"🇸🇪","confederation":"UEFA"},
  {"id":"TUN","name":"突尼斯","nameEn":"Tunisia","group":"F","flag":"🇹🇳","confederation":"CAF"},
  // ===== G组 =====
  {"id":"BEL","name":"比利时","nameEn":"Belgium","group":"G","flag":"🇧🇪","confederation":"UEFA"},
  {"id":"IRN","name":"伊朗","nameEn":"Iran","group":"G","flag":"🇮🇷","confederation":"AFC"},
  {"id":"EGY","name":"埃及","nameEn":"Egypt","group":"G","flag":"🇪🇬","confederation":"CAF"},
  {"id":"NZL","name":"新西兰","nameEn":"New Zealand","group":"G","flag":"🇳🇿","confederation":"OFC"},
  // ===== H组 =====
  {"id":"ESP","name":"西班牙","nameEn":"Spain","group":"H","flag":"🇪🇸","confederation":"UEFA"},
  {"id":"URU","name":"乌拉圭","nameEn":"Uruguay","group":"H","flag":"🇺🇾","confederation":"CONMEBOL"},
  {"id":"KSA","name":"沙特","nameEn":"Saudi Arabia","group":"H","flag":"🇸🇦","confederation":"AFC"},
  {"id":"CPV","name":"佛得角","nameEn":"Cape Verde","group":"H","flag":"🇨🇻","confederation":"CAF"},
  // ===== I组 =====
  {"id":"FRA","name":"法国","nameEn":"France","group":"I","flag":"🇫🇷","confederation":"UEFA"},
  {"id":"SEN","name":"塞内加尔","nameEn":"Senegal","group":"I","flag":"🇸🇳","confederation":"CAF"},
  {"id":"NOR","name":"挪威","nameEn":"Norway","group":"I","flag":"🇳🇴","confederation":"UEFA"},
  {"id":"IRQ","name":"伊拉克","nameEn":"Iraq","group":"I","flag":"🇮🇶","confederation":"AFC"},
  // ===== J组 =====
  {"id":"ARG","name":"阿根廷","nameEn":"Argentina","group":"J","flag":"🇦🇷","confederation":"CONMEBOL"},
  {"id":"AUT","name":"奥地利","nameEn":"Austria","group":"J","flag":"🇦🇹","confederation":"UEFA"},
  {"id":"ALG","name":"阿尔及利亚","nameEn":"Algeria","group":"J","flag":"🇩🇿","confederation":"CAF"},
  {"id":"JOR","name":"约旦","nameEn":"Jordan","group":"J","flag":"🇯🇴","confederation":"AFC"},
  // ===== K组 =====
  {"id":"POR","name":"葡萄牙","nameEn":"Portugal","group":"K","flag":"🇵🇹","confederation":"UEFA"},
  {"id":"COL","name":"哥伦比亚","nameEn":"Colombia","group":"K","flag":"🇨🇴","confederation":"CONMEBOL"},
  {"id":"COD","name":"刚果(金)","nameEn":"DR Congo","group":"K","flag":"🇨🇩","confederation":"CAF"},
  {"id":"UZB","name":"乌兹别克","nameEn":"Uzbekistan","group":"K","flag":"🇺🇿","confederation":"AFC"},
  // ===== L组 =====
  {"id":"ENG","name":"英格兰","nameEn":"England","group":"L","flag":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","confederation":"UEFA"},
  {"id":"CRO","name":"克罗地亚","nameEn":"Croatia","group":"L","flag":"🇭🇷","confederation":"UEFA"},
  {"id":"GHA","name":"加纳","nameEn":"Ghana","group":"L","flag":"🇬🇭","confederation":"CAF"},
  {"id":"PAN","name":"巴拿马","nameEn":"Panama","group":"L","flag":"🇵🇦","confederation":"CONCACAF"}
];

const EMBEDDED_MATCHES = [
  // ===== A组（墨西哥、韩国、捷克、南非）=====
  // 第1轮 - 6月11日
  {"id":"A1","group":"A","home":"MEX","away":"RSA","homeScore":2,"awayScore":0,"played":true,"matchday":1},
  {"id":"A2","group":"A","home":"KOR","away":"CZE","homeScore":2,"awayScore":1,"played":true,"matchday":1},
  // 第2轮 - 6月18日
  {"id":"A3","group":"A","home":"CZE","away":"RSA","homeScore":1,"awayScore":1,"played":true,"matchday":2},
  {"id":"A4","group":"A","home":"MEX","away":"KOR","homeScore":1,"awayScore":0,"played":true,"matchday":2},
  // 第3轮 - 6月24日
  {"id":"A5","group":"A","home":"CZE","away":"MEX","homeScore":null,"awayScore":null,"played":false,"matchday":3},
  {"id":"A6","group":"A","home":"RSA","away":"KOR","homeScore":null,"awayScore":null,"played":false,"matchday":3},

  // ===== B组（加拿大、瑞士、卡塔尔、波黑）=====
  // 第1轮 - 6月12-13日
  {"id":"B1","group":"B","home":"CAN","away":"BIH","homeScore":1,"awayScore":1,"played":true,"matchday":1},
  {"id":"B2","group":"B","home":"QAT","away":"SUI","homeScore":1,"awayScore":1,"played":true,"matchday":1},
  // 第2轮 - 6月18日
  {"id":"B3","group":"B","home":"SUI","away":"BIH","homeScore":4,"awayScore":1,"played":true,"matchday":2},
  {"id":"B4","group":"B","home":"CAN","away":"QAT","homeScore":6,"awayScore":0,"played":true,"matchday":2},
  // 第3轮 - 6月24日
  {"id":"B5","group":"B","home":"SUI","away":"CAN","homeScore":null,"awayScore":null,"played":false,"matchday":3},
  {"id":"B6","group":"B","home":"BIH","away":"QAT","homeScore":null,"awayScore":null,"played":false,"matchday":3},

  // ===== C组（巴西、摩洛哥、苏格兰、海地）=====
  // 第1轮 - 6月13日
  {"id":"C1","group":"C","home":"BRA","away":"MAR","homeScore":1,"awayScore":1,"played":true,"matchday":1},
  {"id":"C2","group":"C","home":"HAI","away":"SCO","homeScore":0,"awayScore":1,"played":true,"matchday":1},
  // 第2轮 - 6月19日
  {"id":"C3","group":"C","home":"SCO","away":"MAR","homeScore":0,"awayScore":1,"played":true,"matchday":2},
  {"id":"C4","group":"C","home":"BRA","away":"HAI","homeScore":3,"awayScore":0,"played":true,"matchday":2},
  // 第3轮 - 6月24日
  {"id":"C5","group":"C","home":"SCO","away":"BRA","homeScore":null,"awayScore":null,"played":false,"matchday":3},
  {"id":"C6","group":"C","home":"MAR","away":"HAI","homeScore":null,"awayScore":null,"played":false,"matchday":3},

  // ===== D组（美国、澳大利亚、巴拉圭、土耳其）=====
  // 第1轮 - 6月12-13日
  {"id":"D1","group":"D","home":"USA","away":"PAR","homeScore":4,"awayScore":1,"played":true,"matchday":1},
  {"id":"D2","group":"D","home":"AUS","away":"TUR","homeScore":2,"awayScore":0,"played":true,"matchday":1},
  // 第2轮 - 6月19日
  {"id":"D3","group":"D","home":"TUR","away":"PAR","homeScore":0,"awayScore":1,"played":true,"matchday":2},
  {"id":"D4","group":"D","home":"USA","away":"AUS","homeScore":2,"awayScore":0,"played":true,"matchday":2},
  // 第3轮 - 6月25日
  {"id":"D5","group":"D","home":"TUR","away":"USA","homeScore":null,"awayScore":null,"played":false,"matchday":3},
  {"id":"D6","group":"D","home":"PAR","away":"AUS","homeScore":null,"awayScore":null,"played":false,"matchday":3},

  // ===== E组（德国、厄瓜多尔、科特迪瓦、库拉索）=====
  // 第1轮 - 6月14日
  {"id":"E1","group":"E","home":"GER","away":"CUW","homeScore":7,"awayScore":1,"played":true,"matchday":1},
  {"id":"E2","group":"E","home":"CIV","away":"ECU","homeScore":1,"awayScore":0,"played":true,"matchday":1},
  // 第2轮 - 6月20日
  {"id":"E3","group":"E","home":"GER","away":"CIV","homeScore":2,"awayScore":1,"played":true,"matchday":2},
  {"id":"E4","group":"E","home":"ECU","away":"CUW","homeScore":0,"awayScore":0,"played":true,"matchday":2},
  // 第3轮 - 6月25日
  {"id":"E5","group":"E","home":"ECU","away":"GER","homeScore":null,"awayScore":null,"played":false,"matchday":3},
  {"id":"E6","group":"E","home":"CUW","away":"CIV","homeScore":null,"awayScore":null,"played":false,"matchday":3},

  // ===== F组（荷兰、日本、瑞典、突尼斯）=====
  // 第1轮 - 6月14日
  {"id":"F1","group":"F","home":"NED","away":"JPN","homeScore":2,"awayScore":2,"played":true,"matchday":1},
  {"id":"F2","group":"F","home":"SWE","away":"TUN","homeScore":5,"awayScore":1,"played":true,"matchday":1},
  // 第2轮 - 6月20日
  {"id":"F3","group":"F","home":"NED","away":"SWE","homeScore":5,"awayScore":1,"played":true,"matchday":2},
  {"id":"F4","group":"F","home":"TUN","away":"JPN","homeScore":0,"awayScore":4,"played":true,"matchday":2},
  // 第3轮 - 6月25日
  {"id":"F5","group":"F","home":"JPN","away":"SWE","homeScore":null,"awayScore":null,"played":false,"matchday":3},
  {"id":"F6","group":"F","home":"TUN","away":"NED","homeScore":null,"awayScore":null,"played":false,"matchday":3},

  // ===== G组（比利时、伊朗、埃及、新西兰）=====
  // 第1轮 - 6月15日
  {"id":"G1","group":"G","home":"BEL","away":"EGY","homeScore":1,"awayScore":1,"played":true,"matchday":1},
  {"id":"G2","group":"G","home":"IRN","away":"NZL","homeScore":2,"awayScore":2,"played":true,"matchday":1},
  // 第2轮 - 6月21日
  {"id":"G3","group":"G","home":"BEL","away":"IRN","homeScore":0,"awayScore":0,"played":true,"matchday":2},
  {"id":"G4","group":"G","home":"NZL","away":"EGY","homeScore":1,"awayScore":3,"played":true,"matchday":2},
  // 第3轮 - 6月26日
  {"id":"G5","group":"G","home":"EGY","away":"IRN","homeScore":null,"awayScore":null,"played":false,"matchday":3},
  {"id":"G6","group":"G","home":"NZL","away":"BEL","homeScore":null,"awayScore":null,"played":false,"matchday":3},

  // ===== H组（西班牙、乌拉圭、沙特、佛得角）=====
  // 第1轮 - 6月15日
  {"id":"H1","group":"H","home":"ESP","away":"CPV","homeScore":0,"awayScore":0,"played":true,"matchday":1},
  {"id":"H2","group":"H","home":"KSA","away":"URU","homeScore":1,"awayScore":1,"played":true,"matchday":1},
  // 第2轮 - 6月21日
  {"id":"H3","group":"H","home":"ESP","away":"KSA","homeScore":4,"awayScore":0,"played":true,"matchday":2},
  {"id":"H4","group":"H","home":"URU","away":"CPV","homeScore":2,"awayScore":2,"played":true,"matchday":2},
  // 第3轮 - 6月26日
  {"id":"H5","group":"H","home":"CPV","away":"KSA","homeScore":null,"awayScore":null,"played":false,"matchday":3},
  {"id":"H6","group":"H","home":"URU","away":"ESP","homeScore":null,"awayScore":null,"played":false,"matchday":3},

  // ===== I组（法国、塞内加尔、挪威、伊拉克）=====
  // 第1轮 - 6月16日
  {"id":"I1","group":"I","home":"FRA","away":"SEN","homeScore":3,"awayScore":1,"played":true,"matchday":1},
  {"id":"I2","group":"I","home":"IRQ","away":"NOR","homeScore":1,"awayScore":4,"played":true,"matchday":1},
  // 第2轮 - 6月22日
  {"id":"I3","group":"I","home":"FRA","away":"IRQ","homeScore":null,"awayScore":null,"played":false,"matchday":2},
  {"id":"I4","group":"I","home":"NOR","away":"SEN","homeScore":null,"awayScore":null,"played":false,"matchday":2},
  // 第3轮 - 6月26日
  {"id":"I5","group":"I","home":"NOR","away":"FRA","homeScore":null,"awayScore":null,"played":false,"matchday":3},
  {"id":"I6","group":"I","home":"SEN","away":"IRQ","homeScore":null,"awayScore":null,"played":false,"matchday":3},

  // ===== J组（阿根廷、奥地利、阿尔及利亚、约旦）=====
  // 第1轮 - 6月16日
  {"id":"J1","group":"J","home":"ARG","away":"ALG","homeScore":3,"awayScore":0,"played":true,"matchday":1},
  {"id":"J2","group":"J","home":"AUT","away":"JOR","homeScore":3,"awayScore":1,"played":true,"matchday":1},
  // 第2轮 - 6月22日
  {"id":"J3","group":"J","home":"ARG","away":"AUT","homeScore":null,"awayScore":null,"played":false,"matchday":2},
  {"id":"J4","group":"J","home":"JOR","away":"ALG","homeScore":null,"awayScore":null,"played":false,"matchday":2},
  // 第3轮 - 6月27日
  {"id":"J5","group":"J","home":"ALG","away":"AUT","homeScore":null,"awayScore":null,"played":false,"matchday":3},
  {"id":"J6","group":"J","home":"JOR","away":"ARG","homeScore":null,"awayScore":null,"played":false,"matchday":3},

  // ===== K组（葡萄牙、哥伦比亚、刚果(金)、乌兹别克）=====
  // 第1轮 - 6月17日
  {"id":"K1","group":"K","home":"POR","away":"COD","homeScore":1,"awayScore":1,"played":true,"matchday":1},
  {"id":"K2","group":"K","home":"UZB","away":"COL","homeScore":1,"awayScore":3,"played":true,"matchday":1},
  // 第2轮 - 6月23日
  {"id":"K3","group":"K","home":"POR","away":"UZB","homeScore":null,"awayScore":null,"played":false,"matchday":2},
  {"id":"K4","group":"K","home":"COL","away":"COD","homeScore":null,"awayScore":null,"played":false,"matchday":2},
  // 第3轮 - 6月27日
  {"id":"K5","group":"K","home":"COL","away":"POR","homeScore":null,"awayScore":null,"played":false,"matchday":3},
  {"id":"K6","group":"K","home":"COD","away":"UZB","homeScore":null,"awayScore":null,"played":false,"matchday":3},

  // ===== L组（英格兰、克罗地亚、加纳、巴拿马）=====
  // 第1轮 - 6月17日
  {"id":"L1","group":"L","home":"ENG","away":"CRO","homeScore":4,"awayScore":2,"played":true,"matchday":1},
  {"id":"L2","group":"L","home":"GHA","away":"PAN","homeScore":1,"awayScore":0,"played":true,"matchday":1},
  // 第2轮 - 6月23日
  {"id":"L3","group":"L","home":"ENG","away":"GHA","homeScore":null,"awayScore":null,"played":false,"matchday":2},
  {"id":"L4","group":"L","home":"PAN","away":"CRO","homeScore":null,"awayScore":null,"played":false,"matchday":2},
  // 第3轮 - 6月27日
  {"id":"L5","group":"L","home":"PAN","away":"ENG","homeScore":null,"awayScore":null,"played":false,"matchday":3},
  {"id":"L6","group":"L","home":"CRO","away":"GHA","homeScore":null,"awayScore":null,"played":false,"matchday":3}
];

// ===== 球队详细介绍 =====
const TEAM_PROFILES = {
  "MEX": { desc: "阿兹台克的雄鹰，中北美足球的绝对王者。十七次踏上世界杯的荣耀征程，两度杀入八强之巅。2026年，作为联合东道主，他们将在海拔2240米的阿兹台克体育场，以高原之威震慑群雄。这是一支承载着1.3亿人民期望的球队，绿白红三色之下，是永不熄灭的足球灵魂。", history: "17次参赛，最佳战绩8强（1970/1986）。2026联合东道主之一。", stars: "洛萨诺、希门尼斯、阿尔瓦雷斯", rank: 12, nickname: "El Tri", cc: "mx", region: "na", meme: "🇲🇽 阿兹台克高原的主场优势！海拔2240米，客队跑两步就喘。墨西哥球迷：我们的第十二人叫「高原反应」。" },
  "KOR": { desc: "太极虎，亚洲足球的骄傲。十一届世界杯征程，2002年四强的传奇至今仍是亚洲足球的巅峰之作。孙兴慜——这位征服英超的亚洲天王，以闪电般的速度和手术刀般的射门，带领着新一代太极虎向世界展示韩国的力量与斗志。", history: "11次参赛，2002年四强创亚洲最佳。", stars: "孙兴慜、金玟哉、李刚仁", rank: 22, nickname: "太极虎", cc: "kr", region: "as", meme: "🇰🇷 孙兴慜：英超金靴在手，世界杯上继续「Sonny时间」！韩国球迷：我们的孙队长从不让人失望 🐯" },
  "CZE": { desc: "东欧铁骑，波西米亚的足球勇士。九次踏上世界杯赛场，两度杀入决赛的历史荣光在欧洲足球的版图上熠熠生辉。希克的中场吊射已成为欧洲杯经典，索切克的铁血斗志是这支球队永不弯曲的脊梁。从布拉格的石板路到世界杯的绿茵场，捷克足球的传奇仍在续写。", history: "9次参赛，最佳亚军（1934/1962）。新老交替完成。", stars: "希克、索切克、曹法尔", rank: 30, nickname: "东欧铁骑", cc: "cz", region: "eu", meme: "🇨🇿 希克：2020欧洲杯那一脚50米吊射还不够远？世界杯上试试中场线！「东欧铁骑」不是白叫的 ⚔️" },
  "RSA": { desc: "Bafana Bafana——祖鲁语中「男孩们」的呼唤，承载着整个非洲南部的足球梦想。三次世界杯之旅，2010年作为东道主向世界展示了彩虹之国的热情。虽然实力尚在成长，但南非足球的天赋与激情，正如好望角的巨浪般不可阻挡。", history: "3次参赛，2010年东道主小组出局。实力稳步提升。", stars: "莫科纳、塔乌、福斯特", rank: 55, nickname: "Bafana Bafana", cc: "za", region: "af", meme: "🇿🇦 Bafana Bafana！南非的呜呜祖拉虽已远去，但非洲足球的热情永不熄灭。这次他们要证明：2010不是偶然 🔥" },
  "CAN": { desc: "枫叶军团，北境之国的足球复兴。阿方索·戴维斯——这位从难民营走向拜仁慕尼黑的传奇少年，是加拿大足球崛起的完美象征。2026年作为联合东道主，加拿大迎来了历史上最强的一代球员。枫叶之下，冰球之国正在用足球改写自己的体育版图。", history: "3次参赛，1986年首次亮相。2026东道主，实力达历史巅峰。", stars: "戴维斯、戴维、拉林", rank: 28, nickname: "枫叶军团", cc: "ca", region: "na", meme: "🇨🇦 阿方索·戴维斯：从难民到拜仁左路天王！枫叶军团不再是足球荒漠，2026东道主认真了 🍁" },
  "SUI": { desc: "十字军团，阿尔卑斯山麓的精密机器。十二次世界杯征程，瑞士队以瑞士钟表般的精准和瑞士军刀般的多面性闻名于世。扎卡的领袖气质、阿坎吉的防守铁壁、恩博洛的冲击力——这支球队永远是对手最不愿遇到的硬骨头。", history: "12次参赛，多次闯入16强。常扮演巨人杀手。", stars: "扎卡、恩博洛、阿坎吉", rank: 15, nickname: "十字军团", cc: "ch", region: "eu", meme: "🇨🇭 瑞士军刀般的精准！上一届送走法国，这一届谁倒霉？扎卡：我的传球比瑞士手表还准 ⌚" },
  "QAT": { desc: "枣红军团，阿拉伯半岛的足球新贵。2019年亚洲杯冠军证明了这支球队的实力绝非偶然。虽然世界杯经验尚浅，但卡塔尔以举国之力打造的足球体系正在结出硕果。阿菲夫与阿里的双子星，是亚洲足球未来十年的希望之光。", history: "2次参赛，2022东道主首秀。", stars: "阿菲夫、阿里、海多斯", rank: 48, nickname: "枣红军团", cc: "qa", region: "as", meme: "🇶🇦 2022年花掉2200亿办世界杯的国家！这次不是东道主了，阿菲夫：没有主场buff也能踢 🌴" },
  "BIH": { desc: "龙之队，巴尔干半岛的足球诗人。波黑足球虽然世界杯履历不长，但哲科——这位纵横欧洲足坛十余载的中锋巨塔，用他的进球为这个年轻的国家书写着足球的荣耀。皮亚尼奇的优雅传球，如同萨拉热窝老城的石板路，充满历史的韵味与艺术的灵魂。", history: "2次参赛，2014年首次亮相世界杯。", stars: "哲科、皮亚尼奇、克鲁尼奇", rank: 42, nickname: "龙之队", cc: "ba", region: "eu", meme: "🇧🇦 哲科大叔还在战斗！38岁的波黑队长：年龄只是数字，进球才是硬道理。巴尔干的龙从不言退 🐉" },
  "BRA": { desc: "足球王国，五星巴西——这个星球上最伟大的足球国度。从贝利到罗纳尔多，从内马尔到维尼修斯，桑巴军团用华丽的舞步五次加冕世界之巅。他们是唯一全勤22届世界杯的传奇之师。2026年，新一代天才们肩负着将第六颗星绣上队徽的使命，黄色战袍下流淌的是征服世界的血脉。", history: "22次全勤参赛，5次冠军，历史第一。", stars: "维尼修斯、罗德里戈、恩德里克", rank: 3, nickname: "桑巴军团", cc: "br", region: "sa", meme: "🇧🇷 维尼修斯：俱乐部你叫我「小熊」我不挑理，世界杯你该叫我什么？🐻→👑 五星巴西要变六星了！" },
  "MAR": { desc: "阿特拉斯雄狮，非洲足球的骄傲与荣耀。2022年卡塔尔世界杯，摩洛哥以钢铁般的防守和顽强的斗志，一路淘汰比利时、西班牙和葡萄牙，历史性地闯入四强，震惊了整个世界。阿什拉夫与齐耶赫领衔的这头雄狮，已经向世界宣告——非洲足球的黎明已经到来。", history: "7次参赛，2022闯入四强创非洲历史。", stars: "阿什拉夫、齐耶赫、恩内斯里", rank: 10, nickname: "阿特拉斯雄狮", cc: "ma", region: "af", meme: "🇲🇦 2022年杀入四强震惊世界！阿什拉夫：我们的目标不只是四强，是决赛！非洲之王要加冕 🦁👑" },
  "SCO": { desc: "高地军团，风笛与威士忌的故乡。九次世界杯之旅却从未突围小组赛——这是苏格兰足球最深的痛，也是最强的动力。罗伯逊——这位利物浦的左路之王，带领着新一代高地勇士向宿命发起挑战。这一次，他们要在风笛的伴奏下改写历史。", history: "9次参赛，从未小组出线。近年实力回升。", stars: "罗伯逊、麦克托米奈、麦金", rank: 32, nickname: "高地军团", cc: "gb-sct", region: "eu", meme: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 苏格兰：九次参赛从未出线！罗伯逊：这次不一样，我们有风笛和威士忌加持 🥃 打破魔咒就现在！" },
  "HAI": { desc: "掷弹兵，加勒比海的足球奇迹。五十二年的漫长等待，海地足球终于重返世界杯的神圣殿堂。这个加勒比小国曾在1974年震惊世界，2026年他们带着更大的梦想归来。每一位海地球员，都是这个国家不屈精神的化身。", history: "2次参赛，1974年首次亮相。2026重返世界杯。", stars: "皮埃罗、纳宗、阿德", rank: 68, nickname: "掷弹兵", cc: "ht", region: "na", meme: "🇭🇹 加勒比海的惊喜！海地时隔52年重返世界杯，全国放假三天！足球，就是加勒比最美的诗篇 🌴⚽" },
  "USA": { desc: "星条军团，北美足球的崛起力量。十二次世界杯征程，1930年的季军是历史的荣光。2026年，作为联合东道主，美国队迎来了足球运动在这个国家爆发式增长的黄金时代。普利西奇领衔的黄金一代，要将美国足球的版图从好莱坞延展到世界杯的巅峰。", history: "12次参赛，最佳季军（1930）。2026东道主，黄金一代。", stars: "普利西奇、雷纳、巴洛贡", rank: 11, nickname: "星条军团", cc: "us", region: "na", meme: "🇺🇸 美国队长普利西奇！谁说美国人只爱橄榄球？2026东道主：足球要抢C位了！好莱坞已经准备好拍夺冠纪录片 🎬⭐" },
  "AUS": { desc: "袋鼠军团，从大洋洲到亚洲的跨越者。七次世界杯征程，两次闯入十六强——澳大利亚足球在不断地进化与成长。苏塔2米01的巨人身影在禁区内如同一座灯塔，而新一代技术型球员的涌现，让袋鼠军团不再只是身体流。", history: "7次参赛，2006/2022闯入16强。", stars: "苏塔、麦克格里、古德温", rank: 24, nickname: "袋鼠军团", cc: "au", region: "oc", meme: "🇦🇺 袋鼠军团！从大洋洲跳到亚洲，越跳越高。苏塔：我2米01的身高不是白长的，角球就是我的showtime 🦘" },
  "PAR": { desc: "白红军团，南美足球的沉默杀手。九次世界杯之旅，2010年闯入八强的辉煌至今仍在亚松森的大街小巷被传颂。阿尔米隆的速度如同巴拉圭河的奔流，恩西索的天赋是南美新星的璀璨光芒。在南美双雄的阴影下，巴拉圭正在悄悄地崛起。", history: "9次参赛，2010年闯入8强。", stars: "阿尔米隆、恩西索、戈麦斯", rank: 35, nickname: "白红军团", cc: "py", region: "sa", meme: "🇵🇾 阿尔米隆：纽卡斯尔的快马，巴拉圭的发动机！南美无弱旅，白红军团要让世界记住这个名字 ⚡" },
  "TUR": { desc: "新月军团，欧亚大陆交汇处的足球力量。2002年日韩世界杯的季军是土耳其足球永恒的骄傲。二十四年后，居莱尔——这位皇马青训营走出的天才少年，与恰尔汗奥卢一同，带领着新月军团再次向世界展示土耳其足球的魅力与力量。", history: "3次参赛，2002年获得季军。近年重新崛起。", stars: "恰尔汗奥卢、居莱尔、伊尔迪兹", rank: 26, nickname: "新月军团", cc: "tr", region: "eu", meme: "🇹🇷 土耳其：2002季军的荣光能否重现？居莱尔：皇马小天才要在世界杯上跳舞了！新月军团，卷土重来 🌙" },
  "GER": { desc: "日耳曼战车，足球世界中的精密机器。四届世界杯冠军，二十次参赛的钢铁之师。从贝肯鲍尔到马特乌斯，从克洛泽到穆西亚拉，德国足球的DNA里刻着永不言败。2026年，穆西亚拉与维尔茨组成的新双子星引擎已经启动——战车，再次向世界之巅发起冲锋。", history: "20次参赛，4次冠军。大赛基因深厚。", stars: "穆西亚拉、维尔茨、哈弗茨", rank: 5, nickname: "日耳曼战车", cc: "de", region: "eu", meme: "🇩🇪 穆西亚拉+维尔茨 = 德国新双子星！战车引擎已升级，从V8到电动，速度更快了。德意志：我们不是重建，是进化 ⚙️" },
  "ECU": { desc: "三色军团，安第斯山脉的足球雄鹰。五次世界杯之旅，2006年的十六强是厄瓜多尔足球的高光时刻。凯塞多——这位以1.15亿英镑天价加盟切尔西的中场悍将，正带领着厄瓜多尔足球进入一个全新时代。高原之子，要在平原上展翅高飞。", history: "5次参赛，2006年16强。年轻一代成长。", stars: "凯塞多、埃斯图皮南、瓦伦西亚", rank: 31, nickname: "三色军团", cc: "ec", region: "sa", meme: "🇪🇨 凯塞多：1.15亿英镑的切尔西标王！厄瓜多尔：我们不止有加拉帕戈斯巨龟，还有一头中场野兽 🐢→🦁" },
  "CIV": { desc: "非洲大象，西非海岸的足球巨兽。从德罗巴到亚亚·图雷，科特迪瓦足球的黄金一代曾震撼世界。如今，阿莱与福法纳接过前辈的旗帜，继续着「大象」的荣耀征程。这支球队的力量、速度与韧性，正如西非草原上的象群，不可阻挡。", history: "4次参赛，德罗巴传奇的传承。", stars: "阿莱、福法纳、迪亚基特", rank: 38, nickname: "非洲大象", cc: "ci", region: "af", meme: "🇨🇮 德罗巴的精神传承！科特迪瓦：虽然魔兽已退役，但「非洲大象」的獠牙依然锋利。阿莱：轮到我了 🐘" },
  "CUW": { desc: "蓝衣军团，加勒比海的灰姑娘。人口不足十六万的小岛国，却创造了闯入世界杯的奇迹。库拉索的故事比任何童话都更加动人——他们没有豪华的训练基地，没有庞大的选材池，但他们拥有一颗永不言弃的足球之心。这支球队的每一步，都在书写历史。", history: "1次参赛，2026通过附加赛历史性晋级。", stars: "巴库纳、安东尼斯、戈雷", rank: 82, nickname: "蓝衣军团", cc: "cw", region: "na", meme: "🇨🇼 库拉索！人口不到16万的小岛，首次闯入世界杯！这比冰岛还冰岛！全国每个人都认识球员 🤯🏝️" },
  "NED": { desc: "橙色军团，全攻全守足球的永恒布道者。三度闯入世界杯决赛，三次与冠军擦肩而过——「无冕之王」的称号既是赞誉，也是宿命。从克鲁伊夫到范巴斯滕，从罗本到加克波，荷兰足球的血液里永远流淌着进攻的基因。2026，橙色风暴誓要改写历史。", history: "11次参赛，3次亚军。永远的竞争者。", stars: "德容、加克波、西蒙斯", rank: 7, nickname: "橙色军团", cc: "nl", region: "eu", meme: "🇳🇱 荷兰：无冕之王的宿命？不！加克波+西蒙斯：新一代要改写历史！橙色风暴，这次誓要捧杯 🧡🏆" },
  "JPN": { desc: "蓝武士，东方足球的璀璨明珠。八次踏上世界杯赛场，四次闯入十六强，日本足球以惊人的速度追赶世界顶级水平。三笘薰那脚1.88毫米的极限救球，浓缩了日本足球对完美的偏执追求。2026年，蓝武士的目标不再是十六强——他们渴望进入八强、四强，创造亚洲足球的新纪元。", history: "8次参赛，4次16强。亚洲足球标杆。", stars: "三笘薰、久保建英、远藤航", rank: 18, nickname: "蓝武士", cc: "jp", region: "as", meme: "🇯🇵 三笘薰：1.88mm的奇迹（那个底线救球）震惊世界！蓝武士：我们的目标不是16强，是8强、4强！「足球小将」现实版 ⚔️" },
  "SWE": { desc: "北欧海盗，斯堪的纳维亚的足球斗士。十三次世界杯征程，1958年本土亚军的辉煌是瑞典足球的巅峰记忆。后伊布时代，伊萨克与库卢塞夫斯基组成的新一代攻击线更加锐利而灵动。北欧海盗换了船长，但征服的航向从未改变。", history: "13次参赛，最佳亚军（1958）。伊布后新生代崛起。", stars: "伊萨克、库卢塞夫斯基、福斯贝里", rank: 20, nickname: "北欧海盗", cc: "se", region: "eu", meme: "🇸🇪 后伊布时代的瑞典更强了！伊萨克：我不是下一个伊布，我是第一个伊萨克。北欧海盗换了船长，但方向不变 ⚓" },
  "TUN": { desc: "迦太基雄鹰，北非足球的古老传承。七次世界杯之旅，2022年击败卫冕冠军法国的壮举让全世界记住了这支球队的名字。突尼斯足球融合了非洲的力量与地中海的灵动，如同一杯浓郁的阿拉伯咖啡，回味悠长而充满力量。", history: "7次参赛，2022击败法国震惊世界。", stars: "姆萨克尼、斯利蒂、杰巴利", rank: 40, nickname: "迦太基雄鹰", cc: "tn", region: "af", meme: "🇹🇳 突尼斯：2022年击败法国！虽已出局但尊严拉满。这次他们要站着晋级！迦太基雄鹰再次翱翔 🦅" },
  "BEL": { desc: "欧洲红魔，黄金一代的最后一舞。德布劳内——这个星球上传球最具魔力的中场大师，用他精准如GPS的左脚，为比利时足球书写了最辉煌的篇章。2018年的季军已是历史，2026年，红魔们要在黄金一代谢幕之前，向大力神杯发起最后的、也是最壮烈的一次冲锋。", history: "14次参赛，2018季军创历史。", stars: "德布劳内、多库、奥蓬达", rank: 4, nickname: "欧洲红魔", cc: "be", region: "eu", meme: "🇧🇪 德布劳内：世界第一中场最后的华尔兹？「丁丁」的传球就像GPS导航，队友闭眼跑都能接到。红魔最后的黄金机会 👑" },
  "IRN": { desc: "波斯铁骑，亚洲足球的坚固堡垒。七次世界杯的追逐，伊朗队至今仍在等待首次小组突围的历史性时刻。塔雷米与阿兹蒙组成的波斯双枪，是亚洲最令人生畏的攻击组合。这支球队如同波斯地毯般精密、坚固而美丽，2026年他们要打破宿命。", history: "7次参赛，寻求首次小组出线。", stars: "塔雷米、阿兹蒙、贾汉巴赫什", rank: 21, nickname: "波斯铁骑", cc: "ir", region: "as", meme: "🇮🇷 伊朗：亚洲排名最高，却从未小组出线！塔雷米+阿兹蒙：波斯双枪要打破宿命！波斯的铁骑不可阻挡 🏇" },
  "EGY": { desc: "法老军团，尼罗河畔的足球王国。萨拉赫——这位利物浦的埃及之王，是整个阿拉伯世界最耀眼的足球明星。四次世界杯旅程，埃及足球承载着非洲大陆最古老文明的骄傲。法老的诅咒？不，这是法老的祝福——金色的沙漠之风吹向世界杯的赛场。", history: "4次参赛，萨拉赫领衔的黄金一代。", stars: "萨拉赫、马尔穆什、埃尔内尼", rank: 34, nickname: "法老军团", cc: "eg", region: "af", meme: "🇪🇬 萨拉赫：利物浦的「埃及法老」！世界杯上他要证明：我不只是俱乐部之王。法老的诅咒？不，是法老的祝福！🔱" },
  "NZL": { desc: "全白军团，大洋洲的孤独守望者。三次世界杯之旅，2010年三场平局不败出局的传奇至今令人唏嘘。新西兰足球虽然远离世界足球的中心，但克里斯·伍德——这位英超赛场上的锋线杀手，证明了来自天涯海角的球员也能在世界舞台上发光。", history: "3次参赛，2010年不败（3平）小组出局。", stars: "伍德、卡卡切、辛格", rank: 75, nickname: "全白军团", cc: "nz", region: "oc", meme: "🇳🇿 新西兰：2010年唯一不败出局的球队（3场平局）！这次他们要赢球了。克里斯·伍德：英超射手来世界杯证明自己 ⚪" },
  "ESP": { desc: "斗牛士军团，传控足球的艺术大师。2010年南非之夏，伊涅斯塔的绝杀为西班牙足球加冕至高荣耀。Tiki-Taka的哲学改变了世界足球的潮流。如今，佩德里的灵动、亚马尔的锋芒、罗德里的稳重，构成了斗牛士新一代的黄金三角。红色狂潮，即将再次席卷世界。", history: "16次参赛，2010年冠军。Tiki-Taka影响世界。", stars: "佩德里、亚马尔、罗德里", rank: 2, nickname: "斗牛士军团", cc: "es", region: "eu", meme: "🇪🇸 亚马尔：16岁踢世界杯！佩德里：20岁已是老将？西班牙的青春风暴：00后统治世界！Tiki-Taka 2.0来了 🎸" },
  "URU": { desc: "天蓝军团，南美足球的永恒传奇。两届世界杯冠军——1930年的首届冠军与1950年的马拉卡纳奇迹，让这个只有350万人口的小国拥有了世界足坛最高的人均冠军数。巴尔韦德、努涅斯与阿劳霍组成的新黄金一代，誓要在这个世纪重现天蓝的荣光。", history: "15次参赛，2次冠军（1930/1950）。", stars: "巴尔韦德、努涅斯、阿劳霍", rank: 9, nickname: "天蓝军团", cc: "uy", region: "sa", meme: "🇺🇾 乌拉圭：人口350万，两届世界杯冠军！人均冠军数世界第一！巴尔韦德：我们小国，但我们有巨人的心 💙" },
  "KSA": { desc: "绿色雄鹰，阿拉伯半岛的足球先锋。七次世界杯征程，1994年奥维兰的千里走单骑至今仍是世界杯历史上最伟大的进球之一。2022年爆冷击败最终冠军阿根廷的奇迹，证明了沙特足球的无限潜力。绿色雄鹰正在展翅，目标不止于小组赛。", history: "7次参赛，1994年16强。2022爆冷击败阿根廷。", stars: "多萨里、谢赫里、加纳姆", rank: 50, nickname: "绿色雄鹰", cc: "sa", region: "as", meme: "🇸🇦 沙特：2022年击败冠军阿根廷！多萨里那一脚世界波沙特人民看了100遍。这次不只要赢一场，要出线！💚" },
  "CPV": { desc: "蓝鲨，大西洋上的足球珍珠。首次闯入世界杯决赛圈的佛得角，用足球向世界介绍了这个由十座火山岛组成的美丽国度。人口不足60万，却在非洲足坛闯出一片天——这是世界杯历史上最动人的灰姑娘故事之一。", history: "1次参赛，2026历史性晋级。", stars: "塔瓦雷斯、门德斯、罗德里格斯", rank: 72, nickname: "蓝鲨", cc: "cv", region: "af", meme: "🇨🇻 佛得角！大西洋上的珍珠首次登上世界杯舞台。全国60万人，选11个人踢球，还踢进世界杯？这才是真正的奇迹 🦈" },
  "FRA": { desc: "高卢雄鸡，欧陆之巅的王者。两度加冕世界冠军，2022年距卫冕仅一步之遥。姆巴佩——这颗足球宇宙中最耀眼的超新星，在决赛上演帽子戏法的神迹仍历历在目。法国的人才生产线如同永不枯竭的泉水，每一代都涌现出令世界艳羡的天才。2026，雄鸡再度啼鸣。", history: "16次参赛，2次冠军。2022亚军，2026依旧顶级。", stars: "姆巴佩、卡马文加、萨利巴", rank: 1, nickname: "高卢雄鸡", cc: "fr", region: "eu", meme: "🇫🇷 姆巴佩：2022决赛帽子戏法还不够？2026他要拿回属于他的奖杯！法国的人才生产线：每年量产10个天才 🐔👑" },
  "SEN": { desc: "特兰加雄狮，西非足球的王者之师。马内——这位从塞内加尔村庄走出的世界级巨星，用他的速度与进球为祖国赢得了无数荣耀。2002年闯入八强的传奇，2022年击败法国的壮举——塞内加尔足球正在以一个非洲超级强权的姿态崛起。", history: "4次参赛，2002年闯入8强。非洲最强之一。", stars: "马内、杰克逊、库利巴利", rank: 17, nickname: "特兰加雄狮", cc: "sn", region: "af", meme: "🇸🇳 马内：从塞内加尔农村走出的巨星！赚了钱给村里修医院修学校。塞内加尔人民：我们的总统是马内！🦁❤️" },
  "NOR": { desc: "北欧风暴，维京人的足球传人。哈兰德——这个身高1米94的挪威巨人，以摧枯拉朽之势横扫英超，单季36球的纪录令人胆寒。搭配阿森纳队长厄德高的创造力，挪威拥有了令全世界防线颤抖的攻击组合。2026年，魔人布欧终于登上世界杯的舞台，全世界都在屏息以待。", history: "4次参赛，1998年16强。哈兰德时代到来。", stars: "哈兰德、厄德高、索尔洛特", rank: 13, nickname: "北欧海盗", cc: "no", region: "eu", meme: "🇳🇴 哈兰德：魔人布欧终于来世界杯了！英超单赛季36球纪录保持者。世界杯后卫们：求轻虐 😱 厄德高：炮弹已上膛 🎯" },
  "IRQ": { desc: "美索不达米亚雄狮，战火中绽放的足球之花。2007年亚洲杯冠军的传奇至今仍在激励着这个饱经沧桑的国家。伊拉克足球的故事不是关于胜利，而是关于足球如何超越战争、超越分歧，成为人民心中最纯粹的光。", history: "2次参赛，1986年首次亮相。", stars: "阿里、侯赛因、巴沙尔", rank: 65, nickname: "美索不达米亚雄狮", cc: "iq", region: "as", meme: "🇮🇶 伊拉克：战火中走出的球队！2007亚洲杯冠军的传奇仍在继续。美索不达米亚雄狮：足球超越一切 🦁" },
  "ARG": { desc: "潘帕斯高原的雄鹰，探戈与足球共舞的国度。2022年的卡塔尔之夜，梅西以神明之姿捧起大力神杯，完成了足球史上最伟大的加冕礼。三届世界冠军的荣光之下，阿尔瓦雷斯、加纳乔等新生代接过火炬——卫冕，是他们唯一的信仰。蓝白条纹间，是阿根廷人民不屈的灵魂。", history: "19次参赛，3次冠军。2022夺冠后势头正盛。", stars: "阿尔瓦雷斯、加纳乔、恩佐", rank: 6, nickname: "潘帕斯雄鹰", cc: "ar", region: "sa", meme: "🇦🇷 梅西：2022圆梦大力神杯！阿尔瓦雷斯+加纳乔：我们要卫冕！潘帕斯雄鹰的翅膀下，新一代正在翱翔 🦅🏆" },
  "AUT": { desc: "条顿军团，中欧足球的战术大师。朗尼克的高位压迫哲学为奥地利足球注入了全新的灵魂。阿拉巴——这位皇马欧冠冠军的核心后卫，将顶级赛场的冠军基因带回了国家队。奥地利足球正在经历一场静默的革命，而2026年就是他们向世界展示成果的舞台。", history: "8次参赛，1954年季军。近年欧洲赛场抢眼。", stars: "萨比策、鲍姆加特纳、阿拉巴", rank: 23, nickname: "条顿军团", cc: "at", region: "eu", meme: "🇦🇹 奥地利：朗尼克的高位压迫杀入世界杯！阿拉巴：从皇马带回来的冠军DNA要传染全队 🎵" },
  "ALG": { desc: "沙漠之狐，北非足球的狡黠猎手。马赫雷斯——曼城三冠王的核心功臣，用他的左脚魔术为阿尔及利亚足球加冕。2014年闯入十六强的辉煌仍历历在目，2026年沙漠之狐带着更锋利的獠牙归来。", history: "5次参赛，2014年16强。非洲传统强队。", stars: "马赫雷斯、本纳赛尔、沙伊比", rank: 36, nickname: "沙漠之狐", cc: "dz", region: "af", meme: "🇩🇿 马赫雷斯：曼城三冠王核心，阿尔及利亚的沙漠之王！「沙漠之狐」狡黠而危险，任何轻视他们的人都要付出代价 🦊" },
  "JOR": { desc: "纳什米，西亚足球的新生力量。首次闯入世界杯决赛圈，约旦足球创造了属于自己的历史。虽然经验尚浅，但这支球队的战斗精神和团队凝聚力令人动容。世界杯处子秀，每一个瞬间都是永恒。", history: "1次参赛，2026首次晋级。", stars: "塔马里、奈马特、哈达德", rank: 70, nickname: "纳什米", cc: "jo", region: "as", meme: "🇯🇴 约旦：世界杯处子秀！「纳什米」们第一次站上这个舞台。不管结果如何，他们已经创造了历史 🌟" },
  "POR": { desc: "伊比利亚半岛的雄鹰，大航海时代的勇士后裔。从尤西比奥到菲戈，从C罗到莱奥，葡萄牙足球的精神代代相传。五盾军团的战袍上绣着九百年的荣耀与梦想。后C罗时代的葡萄牙不再依赖一人，而是以群星之势，向着世界杯的最高荣耀发起冲击。", history: "9次参赛，1966年季军。新一代天才层出不穷。", stars: "莱奥、维蒂尼亚、若昂·内维斯", rank: 8, nickname: "五盾军团", cc: "pt", region: "eu", meme: "🇵🇹 C罗之后，葡萄牙更强了？莱奥：让我来继承7号的荣光。五盾军团的新船长已就位，目标：大力神杯 ⚓" },
  "COL": { desc: "咖啡军团，南美足球的华丽舞者。2014年J罗的横空出世惊艳了整个世界，那脚天外飞仙般的凌空抽射至今被奉为经典。路易斯·迪亚斯接过前辈的旗帜，以利物浦闪电的身份带领哥伦比亚再次向世界杯的高峰攀登。", history: "7次参赛，2014年8强。J罗后新生代崛起。", stars: "路易斯·迪亚斯、杜兰、金特罗", rank: 16, nickname: "咖啡军团", cc: "co", region: "sa", meme: "🇨🇴 路易斯·迪亚斯：利物浦的哥伦比亚闪电！2014年J罗横空出世，2026年轮到迪亚斯。咖啡军团：提神醒脑 ☕⚡" },
  "COD": { desc: "猎豹，非洲心脏地带的足球野兽。曾以扎伊尔之名征战1974年世界杯，五十二年后以刚果民主共和国的身份重返世界舞台。这是一个关于等待与重生的故事——非洲足球的沉睡巨人终于苏醒。", history: "2次参赛，1974年首次（时为扎伊尔）。", stars: "巴坎布、维萨、姆本巴", rank: 56, nickname: "猎豹", cc: "cd", region: "af", meme: "🇨🇩 刚果(金)：时隔52年重返世界杯！曾经的「扎伊尔」，如今的「猎豹」。非洲足球的沉睡巨人醒了 🐆" },
  "UZB": { desc: "白狼，丝绸之路上的足球新篇。首次闯入世界杯决赛圈，乌兹别克斯坦用多年的青训耕耘换来了历史性的突破。肖穆罗多夫在意大利用进球为祖国代言，中亚白狼要在世界杯的舞台上留下爪印。", history: "1次参赛，2026首次晋级。", stars: "肖穆罗多夫、马沙里波夫、哈姆罗贝科夫", rank: 60, nickname: "白狼", cc: "uz", region: "as", meme: "🇺🇿 乌兹别克斯坦：中亚白狼首次闯入世界杯！丝绸之路的后裔要用足球连接世界。肖穆罗多夫：罗马前锋领衔 🐺" },
  "ENG": { desc: "三狮军团，现代足球的发明者。1966年的温布利之夏，是英格兰足球永恒的荣耀坐标。凯恩——这位现代中锋的完美化身，带着无数亚军的遗憾，誓要在2026年终结「足球回家」的漫长等待。贝林厄姆与福登，两位天才少年的光芒，照亮了三狮通往大力神杯的道路。", history: "17次参赛，1966年冠军。近年大赛持续竞争力。", stars: "贝林厄姆、福登、凯恩", rank: 4, nickname: "三狮军团", cc: "gb-eng", region: "eu", meme: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 凯恩叔叔：这次真的不要亚军了！2021欧洲杯亚军、2019欧冠亚军、联赛杯亚军…凯恩：我的冠军运呢？三狮：It's coming home…真的！🦁🏆" },
  "CRO": { desc: "格子军团，一个不到400万人口的小国，却拥有世界上最令人敬畏的足球灵魂。2018年亚军、2022年季军——莫德里奇和他的战友们用脚下的魔法，向世界证明了「小国也能做大国梦」。当「魔笛」的旋律在世界杯赛场响起，任何对手都不敢轻视这面红白格子旗。", history: "7次参赛，2018亚军、2022季军。小国奇迹。", stars: "莫德里奇、格瓦迪奥尔、科瓦契奇", rank: 14, nickname: "格子军团", cc: "hr", region: "eu", meme: "🇭🇷 莫德里奇：39岁还在踢！2018金球奖得主，世界杯决赛选手。格子军团：人口400万，世界杯成绩碾压99%的国家 👔" },
  "GHA": { desc: "黑星军团，非洲足球的闪亮明星。2010年八强赛上苏亚雷斯的手球阻挡了加纳创造非洲历史的梦想——那是一个国家最接近世界杯荣耀的时刻，也是最心碎的瞬间。库杜斯与新一代黑星战士，要亲手书写属于自己的结局。", history: "5次参赛，2010年8强。非洲足球标杆。", stars: "库杜斯、萨利苏、威廉姆斯", rank: 44, nickname: "黑星军团", cc: "gh", region: "af", meme: "🇬🇭 加纳：2010年苏亚雷斯的「上帝之手」挡出必进球…这次黑星军团要亲手把命运握在手中！库杜斯：新一代领袖 ⭐" },
  "PAN": { desc: "运河军团，连接两个大洋的足球使者。第二次世界杯之旅，巴拿马带着2018年首球的狂喜与更成熟的战术体系归来。这个中美洲小国证明了——足球不是大国专利，梦想的尺寸不由国界丈量。", history: "1次参赛，2018年首次亮相。2026回归。", stars: "卡拉斯基利亚、穆里略、戈多伊", rank: 62, nickname: "运河军团", cc: "pa", region: "na", meme: "🇵🇦 巴拿马：不是只有运河！2018年首球全队疯狂，2026年要赢下第一场比赛！中美洲的惊喜制造机 🚢" }
};
