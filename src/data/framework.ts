// Core framework data: quadrants, architecture chain, vitality flow,
// three-layer generative framework.

export type QuadrantKey = 'hh' | 'hl' | 'lh' | 'll'

export interface QuadrantInfo {
  id: string
  key: QuadrantKey
  nameZh: string
  nameEn: string
  keywords: string[]
  note: string
  stateLine: string
  riskLine: string
}

export const QUADRANTS: QuadrantInfo[] = [
  {
    id: 'stagnation',
    key: 'll',
    nameZh: '困境区',
    nameEn: 'Stagnation',
    keywords: ['能量不足', '路径稀缺', '被动', '选择减少', '难以长期积累'],
    note: '封闭地形 · 低光 · 陷在山谷',
    stateLine: 'Low Vitality / Low Freedom',
    riskLine: '当前主要风险：能量与路径同时稀缺，系统趋于收缩与被动。',
  },
  {
    id: 'overcommitment',
    key: 'hl',
    nameZh: '陷阱区',
    nameEn: 'Overcommitment',
    keywords: ['能量强', '路径窄', '执着', 'All-in', '路径依赖', '内耗', '认知锁定'],
    note: 'Powerful, but trapped.',
    stateLine: 'High Vitality / Low Freedom',
    riskLine: '当前主要风险：生命力过度压入单一路径。',
  },
  {
    id: 'dispersion',
    key: 'lh',
    nameZh: '幻象区',
    nameEn: 'Dispersion',
    keywords: ['机会很多', '精力不足', '信息分散', '浅尝辄止', '错失重要机会', '频繁切换'],
    note: 'Many options, little realization.',
    stateLine: 'Low Vitality / High Freedom',
    riskLine: '当前主要风险：机会广度超过承载能力，难以深入。',
  },
  {
    id: 'creation',
    key: 'hh',
    nameZh: '创造区',
    nameEn: 'Creation & Compounding',
    keywords: ['高能量', '多路径', '深度理解', '灵活适应', '长期复利', '创造', '自我更新'],
    note: 'Adaptive Power',
    stateLine: 'High Vitality / High Freedom',
    riskLine: '当前主要风险：自满与反馈回路的松动，架构停止自我更新。',
  },
]

export const ARCH_CHAIN: { en: string; zh: string }[] = [
  { en: 'World', zh: '世界' },
  { en: 'Structure', zh: '结构' },
  { en: 'Candidate', zh: '候选' },
  { en: 'Field', zh: '场' },
  { en: 'Geometry', zh: '几何' },
  { en: 'Permission', zh: '许可' },
  { en: 'Outcome', zh: '结果' },
  { en: 'Archetype', zh: '原型' },
]

export const ARCH_LOOP = 'Better Selection · 更优选择'

export interface FlowChannel {
  from: string
  fromZh: string
  to: string
  toZh: string
}

export const FLOW_CHANNELS: FlowChannel[] = [
  { from: 'Attention', fromZh: '注意力', to: 'Candidate', toZh: '候选' },
  { from: 'Research', fromZh: '研究', to: 'Structure', toZh: '结构' },
  { from: 'Computation', fromZh: '计算', to: 'Field', toZh: '场' },
  { from: 'Capital', fromZh: '资本', to: 'Permission', toZh: '许可' },
  { from: 'Outcome', fromZh: '结果', to: 'Experience', toZh: '经验' },
  { from: 'Experience', fromZh: '经验', to: 'Archetype', toZh: '原型' },
  { from: 'Archetype', fromZh: '原型', to: 'Better Selection', toZh: '更优选择' },
]

export const PERMISSIONS = [
  { en: 'Attention', zh: '注意力许可' },
  { en: 'Research', zh: '研究许可' },
  { en: 'Computation', zh: '计算许可' },
  { en: 'Capital', zh: '资本许可' },
  { en: 'Holding', zh: '持有许可' },
]

export const COMPRESSION_STEPS = ['100', '20', '5', '2', '1']

// Short embodied readout text per quadrant (V0.1.1) — schema unchanged.
export const QUADRANT_TEXT: Record<string, { summary: string; watch: string }> = {
  stagnation: {
    summary: '能量不足 · 路径稀缺 · 系统收缩',
    watch: 'No energy, no way out. 先恢复能量，再寻找路径。',
  },
  overcommitment: {
    summary: '能量强 · 路径窄 · 力量被压入单一路径',
    watch: 'Powerful, but trapped. 力量需要第二条路径。',
  },
  dispersion: {
    summary: '机会多 · 能量弱 · 世界很大却抵达不了',
    watch: 'Many options, little realization. 收缩选项，才能抵达。',
  },
  creation: {
    summary: '资源充沛 · 路径开放 · 系统能够持续生成新选择',
    watch: 'Freedom without architecture can still decay into dispersion.',
  },
}

export interface LayerInfo {
  id: string
  num: string
  nameEn: string
  nameZh: string
  timescale: string
  question: string
  questionZh: string
  chips?: { en: string; zh: string }[]
  chain?: { en: string; zh: string }[]
}

export const THREE_LAYERS: LayerInfo[] = [
  {
    id: 'meta',
    num: 'LAYER 1',
    nameEn: 'Meta Generative Field',
    nameZh: '元生成场',
    timescale: 'years / decades · Slow Variables 慢变量',
    question: 'Why does this world produce such opportunities?',
    questionZh: '为什么这个世界会产生这种机会？',
    chips: [
      { en: 'Environment', zh: '环境' },
      { en: 'Population', zh: '人口' },
      { en: 'Technology', zh: '技术' },
      { en: 'Institutions', zh: '制度' },
      { en: 'Capital', zh: '资本' },
    ],
  },
  {
    id: 'structure',
    num: 'LAYER 2',
    nameEn: 'Structural Potential',
    nameZh: '结构势能',
    timescale: 'months / years',
    question: 'Why this company, of all companies?',
    questionZh: '为什么偏偏是这家公司？',
    chain: [
      { en: 'Asset Substrate', zh: '资产基底' },
      { en: 'Shock Topology', zh: '冲击拓扑' },
      { en: 'Recovery Vector', zh: '恢复向量' },
      { en: 'Mispricing Potential', zh: '错误定价潜力' },
    ],
  },
  {
    id: 'market',
    num: 'LAYER 3',
    nameEn: 'Market Field',
    nameZh: '市场场',
    timescale: 'days / months（Geometry 进一步缩短至 minutes / weeks）',
    question: 'Why is it starting to change now?',
    questionZh: '为什么现在开始变化？',
    chain: [
      { en: 'PICGEO', zh: '市场可见输入' },
      { en: 'Field', zh: '场' },
      { en: 'Generator', zh: '生成器' },
      { en: 'Geometry', zh: '几何' },
      { en: 'Permission', zh: '许可' },
    ],
  },
]
