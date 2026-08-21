// Generative Archetype Library — data schema and content.
// Add new archetypes here; the UI reads from this file only.

export type ArchetypeCategory = 'success' | 'transition' | 'failure'

export interface Archetype {
  id: string
  nameZh: string
  nameEn: string
  category: ArchetypeCategory
  coreQuestion: string
  coreQuestionZh: string
  structure: { en: string; zh: string }[]
  substrate: string[]
  shockTopology: string[]
  recoveryVector: string[]
  failureSignals: string[]
  relatedCases: string[]
}

export const ARCHETYPES: Archetype[] = [
  {
    id: 'external-shock',
    nameZh: '强系统上的外部冲击',
    nameEn: 'External Shock on Strong System',
    category: 'success',
    coreQuestion: 'Did the shock actually damage the machine?',
    coreQuestionZh: '外部冲击是否真的损伤了机器？',
    structure: [
      { en: 'Strong Platform', zh: '强平台' },
      { en: 'External Shock', zh: '外部冲击' },
      { en: 'Operating Integrity', zh: '运营完整性' },
      { en: 'Narrative-Reality Divergence', zh: '叙事—现实分歧' },
      { en: 'Recovery', zh: '修复' },
    ],
    substrate: ['全球服务网络与产能平台', '订单结构分散、客户转换成本高'],
    shockTopology: ['冲击来自政治清单而非经营断层', '作用在叙事层与融资层，不伤及订单与现金流'],
    recoveryVector: ['在手订单与现金流未中断', '产能与客户关系持续验证运营完整性'],
    failureSignals: ['核心客户大面积流失', '现金流中断或产能停摆'],
    relatedCases: ['wuxi'],
  },
  {
    id: 'identity-transition',
    nameZh: '身份转型',
    nameEn: 'Identity Transition',
    category: 'transition',
    coreQuestion: 'Is the new engine strong enough to redefine the company?',
    coreQuestionZh: '新发动机是否已经足够强，能够重新定义整个公司？',
    structure: [
      { en: 'Legacy Engine Decay', zh: '旧引擎衰减' },
      { en: 'Innovation Pivot', zh: '创新转向' },
      { en: 'Pipeline Transition', zh: '管线过渡' },
      { en: 'Identity Re-pricing', zh: '身份再定价' },
    ],
    substrate: ['研发体系与人才密度', '临床管线深度'],
    shockTopology: ['集采与政策冲击压缩旧收入曲线', '新旧引擎切换期间收入错位'],
    recoveryVector: ['创新药放量与 license-out 授权收入', '管线价值被外部交易持续验证'],
    failureSignals: ['创新管线失败率异常', '授权交易停滞且现金消耗失控'],
    relatedCases: ['hengrui'],
  },
  {
    id: 'generator-validation',
    nameZh: '预期重置 / 生成器验证',
    nameEn: 'Expectation Reset / Generator Validation',
    category: 'transition',
    coreQuestion: 'Is this a hit product, or a machine that keeps generating IP?',
    coreQuestionZh: '这是一个爆款，还是一台能够持续生成IP的机器？',
    structure: [
      { en: 'Explosive Growth', zh: '爆发增长' },
      { en: 'Expectation Reset', zh: '预期重置' },
      { en: 'Generator Validation', zh: '生成器验证' },
      { en: 'Re-rating', zh: '再定价' },
    ],
    substrate: ['IP 发现—供应链—渠道—全球化全链路', '艺术家网络与会员复购数据'],
    shockTopology: ['单品生命周期预期被击穿', '高预期破灭引发估值压缩'],
    recoveryVector: ['新 IP 连续验证生成能力', '海外扩张打开第二增长曲线'],
    failureSignals: ['新 IP 连续哑火', '复购率与会员增长同时转弱'],
    relatedCases: ['popmart'],
  },
  {
    id: 'regime-shift',
    nameZh: '体制切换',
    nameEn: 'Regime Shift',
    category: 'failure',
    coreQuestion: 'Has the industrial world that once supported mean reversion already changed?',
    coreQuestionZh: '过去支撑均值回归的产业世界是否已经改变？',
    structure: [
      { en: 'Policy Cycle', zh: '政策周期' },
      { en: 'Land-Finance Regime', zh: '土地—金融体制' },
      { en: 'Mean Reversion Broken', zh: '均值回归失效' },
      { en: 'Balance Sheet Erosion', zh: '资产负债表侵蚀' },
    ],
    substrate: ['土地储备与融资能力', '政策周期内的销售执行'],
    shockTopology: ['旧循环（土地—金融—销售）断裂', '冲击作用于整个行业生成机制'],
    recoveryVector: ['旧机制内几乎无恢复向量', '均值回归的前提已被移除'],
    failureSignals: ['历史低估值不再提供支撑', '现金流持续被债务侵蚀'],
    relatedCases: ['poly'],
  },
  {
    id: 'structural-decay',
    nameZh: '结构衰减 / 商业模式重构',
    nameEn: 'Structural Decay / Business Model Reconstruction',
    category: 'failure',
    coreQuestion: 'Beneath a similar price geometry, is this still the same company?',
    coreQuestionZh: '看起来相似的价格区间下面，公司是否已经不是过去那家公司？',
    structure: [
      { en: 'Retail Network Decay', zh: '零售网络衰减' },
      { en: 'Competition Shift', zh: '竞争位移' },
      { en: 'Model Reconstruction', zh: '模式重构尝试' },
      { en: 'Value Destruction', zh: '价值破坏' },
    ],
    substrate: ['生鲜供应链与门店网络', '客流与毛利结构'],
    shockTopology: ['供应链优势被前置仓与社区团购解构', '冲击持续作用于客流与毛利'],
    recoveryVector: ['多次模式重构未形成新的生成机制', '价格下跌本身不构成恢复向量'],
    failureSignals: ['客流与毛利双降不可逆', '重构尝试反复消耗资本'],
    relatedCases: ['yonghui'],
  },
]
