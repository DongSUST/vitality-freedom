// Case studies. Add more cases here; UI reads from this file only.

export type CaseStatus = 'success' | 'transition' | 'failure'

export interface CaseStudy {
  id: string
  company: string
  companyEn: string
  market: string
  archetypeId: string
  status: CaseStatus
  question: string
  questionZh: string
  geometry: string[]
  structuralPotential: string[]
  marketField: string[]
  lesson: string
  lessonZh: string
}

export const CASES: CaseStudy[] = [
  {
    id: 'wuxi',
    company: '药明康德',
    companyEn: 'WUXI APPTEC',
    market: 'CXO · 医药外包',
    archetypeId: 'external-shock',
    status: 'success',
    question: 'Did the shock actually damage the machine?',
    questionZh: '外部冲击是否真的损伤了机器？',
    geometry: [
      '长平台后急速下跌',
      '低点长期横盘、波动收敛',
      '随订单与现金流验证逐步修复',
    ],
    structuralPotential: [
      '全球 CRDMO 平台网络，订单结构分散',
      '冲击来自政治清单，而非经营断层',
      '在手订单与现金流未中断，机器仍在运转',
    ],
    marketField: [
      '制裁恐慌定价与订单现实之间出现缺口',
      '叙事—现实分歧成为错误定价来源',
      '修复由基本面验证驱动，而非叙事反弹',
    ],
    lesson: 'Distinguish "the machine is damaged" from "the machine is doubted".',
    lessonZh: '区分「机器受损」与「机器被怀疑」。',
  },
  {
    id: 'hengrui',
    company: '恒瑞医药',
    companyEn: 'HENGRUI PHARMA',
    market: '制药 · 创新药',
    archetypeId: 'identity-transition',
    status: 'transition',
    question: 'Is the new engine strong enough to redefine the company?',
    questionZh: '新发动机是否已经足够强，能够重新定义整个公司？',
    geometry: [
      '长期估值中枢下移',
      '底部反复磨底、波动放大',
      '创新验证后中枢重新抬升',
    ],
    structuralPotential: [
      '研发管线由仿转创，旧引擎持续贬值',
      'license-out 授权收入验证新引擎',
      '新旧引擎切换期间，收入曲线错位',
    ],
    marketField: [
      '集采压价与创新出海预期交替定价',
      '身份未定时期，市场反复试探',
      '新引擎验证一次，身份再定价一次',
    ],
    lesson: 'In an identity transition, the old engine depreciates and the new engine validates at different speeds.',
    lessonZh: '身份转换期：旧引擎贬值与新引擎验证不同步。',
  },
  {
    id: 'popmart',
    company: '泡泡玛特',
    companyEn: 'POP MART',
    market: '潮玩 · IP 消费',
    archetypeId: 'generator-validation',
    status: 'transition',
    question: 'Is this a hit product, or a machine that keeps generating IP?',
    questionZh: '这是一个爆款，还是一台能够持续生成IP的机器？',
    geometry: [
      '高预期破灭后的深跌',
      '底部长期盘整',
      '生成能力验证后重新定价',
    ],
    structuralPotential: [
      'IP 发现—供应链—渠道—全球化全链路',
      '艺术家网络与会员复购构成生成器',
      '海外扩张验证第二增长曲线',
    ],
    marketField: [
      '从单品爆款叙事切换到生成器叙事',
      '预期重置期，估值先于业绩触底',
      '连续新 IP 验证后，市场恢复信心',
    ],
    lesson: 'Distinguish a hit product from a hit generator.',
    lessonZh: '区分单品现象与生成器。',
  },
  {
    id: 'poly',
    company: '保利发展',
    companyEn: 'POLY DEVELOPMENTS',
    market: '房地产',
    archetypeId: 'regime-shift',
    status: 'failure',
    question: 'Has the industrial world that once supported mean reversion already changed?',
    questionZh: '过去支撑均值回归的产业世界是否已经改变？',
    geometry: [
      '历史低估值区间反复出现',
      '低 PB 之后未发生回归',
      '长期阴跌、中枢持续下移',
    ],
    structuralPotential: [
      '土地—金融—销售的旧循环已经断裂',
      '均值回归的前提是生成机制未变，而它已改变',
      '旧机制内缺乏自我修复的恢复向量',
    ],
    marketField: [
      '历史分位数指标持续失效',
      '便宜之后可以更便宜',
      '每次反弹都在验证体制切换而非均值回归',
    ],
    lesson: 'Mean reversion only holds while the generative mechanism survives.',
    lessonZh: '均值回归只在生成机制未变时成立。',
  },
  {
    id: 'yonghui',
    company: '永辉超市',
    companyEn: 'YONGHUI SUPERSTORES',
    market: '商超零售',
    archetypeId: 'structural-decay',
    status: 'failure',
    question: 'Beneath a similar price geometry, is this still the same company?',
    questionZh: '看起来相似的价格区间下面，公司是否已经不是过去那家公司？',
    geometry: [
      '反复下跌后的「便宜」区间',
      '低价区间内持续阴跌',
      '反弹乏力、重心不断下移',
    ],
    structuralPotential: [
      '生鲜供应链优势被前置仓与社区团购解构',
      '客流与毛利双降，内核已经改变',
      '多次模式重构未形成新的生成机制',
    ],
    marketField: [
      '估值看起来与历史相似，业务实质不同',
      '价格几何相似，生成条件已经变化',
      '市场持续为结构衰减定价',
    ],
    lesson: 'Similar price geometry can hide a different company.',
    lessonZh: '相似价格几何下，公司内核可能已经改变。',
  },
]
