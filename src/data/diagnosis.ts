// Self Diagnosis — reflective system diagnostic data.
// Not a personality test, not an investment score.

export interface DiagnosisDimension {
  id: string
  labelZh: string
  labelEn: string
}

export interface DiagnosisGroup {
  id: 'vitality' | 'freedom' | 'architecture'
  titleZh: string
  titleEn: string
  dims: DiagnosisDimension[]
}

export const DIAGNOSIS_GROUPS: DiagnosisGroup[] = [
  {
    id: 'vitality',
    titleZh: '生命力',
    titleEn: 'Vitality',
    dims: [
      { id: 'attention', labelZh: '注意力', labelEn: 'Attention' },
      { id: 'time', labelZh: '时间', labelEn: 'Time' },
      { id: 'knowledge', labelZh: '知识与经验', labelEn: 'Knowledge & Experience' },
      { id: 'computation', labelZh: '计算与工具', labelEn: 'Computation & Tools' },
      { id: 'capital', labelZh: '资本能力', labelEn: 'Capital Capacity' },
      { id: 'will', labelZh: '意志与执行', labelEn: 'Will / Execution' },
    ],
  },
  {
    id: 'freedom',
    titleZh: '自由度',
    titleEn: 'Freedom',
    dims: [
      { id: 'liquidity', labelZh: '流动性', labelEn: 'Liquidity' },
      { id: 'strategy', labelZh: '策略选择', labelEn: 'Strategy Optionality' },
      { id: 'information', labelZh: '信息多样性', labelEn: 'Information Diversity' },
      { id: 'timefreedom', labelZh: '时间自由', labelEn: 'Time Freedom' },
      { id: 'exitfreedom', labelZh: '退出能力', labelEn: 'Exit Freedom' },
      { id: 'pathoptionality', labelZh: '可行动路径', labelEn: 'Path Optionality' },
    ],
  },
  {
    id: 'architecture',
    titleZh: '架构',
    titleEn: 'Architecture',
    dims: [
      { id: 'sensing', labelZh: '感知', labelEn: 'Sensing' },
      { id: 'selection', labelZh: '选择', labelEn: 'Selection' },
      { id: 'validation', labelZh: '验证', labelEn: 'Validation' },
      { id: 'permission', labelZh: '权限', labelEn: 'Permission' },
      { id: 'feedback', labelZh: '反馈', labelEn: 'Feedback' },
      { id: 'learning', labelZh: '学习', labelEn: 'Learning' },
    ],
  },
]

export interface BottleneckInfo {
  bottleneckZh: string
  bottleneck: string
  risk: string
  direction: string
}

export const BOTTLENECK_MAP: Record<string, BottleneckInfo> = {
  attention: {
    bottleneckZh: '注意力碎片化',
    bottleneck: 'Attention Fragmentation',
    risk: '注意力被多线程消耗，难以进入深度状态。',
    direction: '为每周划定一个单一深度主题，其余信息延迟处理。',
  },
  time: {
    bottleneckZh: '时间稀缺',
    bottleneck: 'Time Scarcity',
    risk: '可用时间被低杠杆事务占据。',
    direction: '先压缩低杠杆事务，再谈新增投入。',
  },
  knowledge: {
    bottleneckZh: '知识缺口',
    bottleneck: 'Knowledge Gap',
    risk: '关键领域的理解深度不足以支撑判断。',
    direction: '以案例为锚点回填知识，而不是泛读。',
  },
  computation: {
    bottleneckZh: '工具摩擦',
    bottleneck: 'Tool Friction',
    risk: '信息处理依赖手工，反馈速度慢。',
    direction: '先把一个重复流程工具化，再考虑扩展。',
  },
  capital: {
    bottleneckZh: '资本约束',
    bottleneck: 'Capital Constraint',
    risk: '资本规模或稳定性限制了下注能力。',
    direction: '缩小下注单元，让系统先跑通。',
  },
  will: {
    bottleneckZh: '执行耗散',
    bottleneck: 'Execution Drain',
    risk: '计划与执行之间的落差持续消耗意志。',
    direction: '缩小承诺数量，保护执行带宽。',
  },
  liquidity: {
    bottleneckZh: '流动性约束',
    bottleneck: 'Liquidity Constraint',
    risk: '资产或时间被锁死在低灵活度结构中。',
    direction: '优先恢复一个可调度资源的最小池。',
  },
  strategy: {
    bottleneckZh: '策略单一',
    bottleneck: 'Strategy Monoculture',
    risk: '可用策略太少，环境变化时缺乏备选。',
    direction: '发展一条与现有策略低相关的第二路径。',
  },
  information: {
    bottleneckZh: '信息回声',
    bottleneck: 'Information Echo',
    risk: '信息源同质，观点互相强化。',
    direction: '刻意引入一组异质信息源。',
  },
  timefreedom: {
    bottleneckZh: '时间锁定',
    bottleneck: 'Time Lock-in',
    risk: '日程被他人或旧承诺主导。',
    direction: '先收回一小块可自由支配的时间块。',
  },
  exitfreedom: {
    bottleneckZh: '退出摩擦',
    bottleneck: 'Exit Friction',
    risk: '当前路径缺乏低成本退出方式。',
    direction: '为关键投入设置可逆的退出条件。',
  },
  pathoptionality: {
    bottleneckZh: '路径稀缺',
    bottleneck: 'Path Scarcity',
    risk: '可行动的备选路径过少。',
    direction: '在进入之前先储备多个可行动分支。',
  },
  sensing: {
    bottleneckZh: '感知面失衡',
    bottleneck: 'Sensing Breadth',
    risk: '感知过窄或过噪，机会被系统性地错过。',
    direction: '收窄感知到少数慢变量，再逐步加宽。',
  },
  selection: {
    bottleneckZh: '选择压缩不足',
    bottleneck: 'Selection Compression',
    risk: '候选没有被有效压缩，注意力散布在过多目标上。',
    direction: 'Reduce active permission slots before expanding sensing breadth.（在扩大感知面之前，先减少活跃许可槽位。）',
  },
  validation: {
    bottleneckZh: '验证缺口',
    bottleneck: 'Validation Gap',
    risk: '假设缺少可证伪的验证环节。',
    direction: '为每个关键假设写下一个可观测的证伪条件。',
  },
  permission: {
    bottleneckZh: '权限摩擦',
    bottleneck: 'Permission Friction',
    risk: '资源授权规则模糊或过严，机会无法转化为行动。',
    direction: '定义每类资源的触发条件，让授权可重复。',
  },
  feedback: {
    bottleneckZh: '反馈回路断裂',
    bottleneck: 'Feedback Loop Break',
    risk: '结果没有回流为经验，同类错误重复发生。',
    direction: '为每次结果保留最小记录，让经验进入原型库。',
  },
  learning: {
    bottleneckZh: '学习摩擦',
    bottleneck: 'Learning Friction',
    risk: '经验停留在个案，没有抽象为原型。',
    direction: '把最近一次结果抽象为一个原型条目。',
  },
}

export interface ConfigText {
  line: string
  note: string
}

export const CONFIG_TEXTS: Record<string, ConfigText> = {
  hh: {
    line: '高生命力 × 高自由度',
    note: '创造性配置。保持反馈回路畅通，让架构持续自我更新。',
  },
  hl: {
    line: '高生命力 × 低自由度',
    note: 'Capital / cognition is overly concentrated in one path.（资本与认知过度集中于单一路径。）',
  },
  lh: {
    line: '低生命力 × 高自由度',
    note: 'Opportunity breadth exceeds management capacity.（机会广度超过管理容量。）',
  },
  ll: {
    line: '低生命力 × 低自由度',
    note: '能量不足且路径稀缺。先恢复能量，再谈扩张。',
  },
}
