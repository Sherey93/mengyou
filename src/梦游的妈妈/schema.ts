// 梦游的妈妈 · MVU 变量结构（Zod 4）
// 事实来源：创作规划.yaml 的 mvu 段（structure + variables）
// 三条硬约定：
//   1. 顶部不写任何 import —— z 与 _ 由 MVU 运行时注入；
//   2. 数值一律用 _.clamp 夹回范围内（不报错、不丢弃更新），并取整；
//   3. 结构里每个字段都给 .prefault，嵌套对象再补 .prefault({})，
//      这样局部 JSON Patch 或整块 remove 之后仍能解析回完整结构。
// 变量总数：15（世界 6 / 徐琦 9）。已明确删除「儿子.心情」「徐琦.班次」，不在此表内。

export const Schema = z.object({
  // ─────────────── 世界 ───────────────
  世界: z.object({
    日期: z.string().describe('当前日期，格式 YYYY/MM/DD').prefault('2025/09/05'),
    时刻: z.string().describe('当前具体时刻，24 小时制 HH:MM').prefault('22:40'),
    星期: z.enum(['一', '二', '三', '四', '五', '六', '日']).describe('星期几，关系到<user>上学和徐琦的排班').prefault('五'),
    场景: z
      .enum(['儿子房间', '主卧', '客厅', '厨房', '走廊', '卫生间', '玄关', '医院病区', '外面'])
      .describe('当前所处场景，决定地理条目是否被激活')
      .prefault('儿子房间'),

    // 父亲 = 风险源。他不进性场面，只作为一个「会不会过来」的开关存在
    父亲: z
      .object({
        状态: z
          .enum(['在主卧熟睡', '在主卧醒着', '起夜中', '在客厅', '应酬未归'])
          .describe('陈国栋此刻的状态，是这张卡的风险开关；深夜 23 点之后不得停留在「应酬未归」')
          .prefault('在主卧熟睡'),
        怀疑度: z.coerce
          .number()
          .describe('陈国栋的起疑程度，0~100；超过 40 开始主动观察，超过 70 会开口问')
          .prefault(0)
          .transform((值) => _.clamp(Math.round(值), 0, 100)),
      })
      .prefault({}),
  }).prefault({}),

  // ─────────────── 徐琦 ───────────────
  // 她不是变量驱动的木偶：四个阶段是她自己的四个选择，阶段只由<user>的越界顶上台阶
  徐琦: z.object({
    阶段: z
      .enum(['真梦游', '装睡', '假装梦游', '摊牌'])
      .describe('全卡第一主线刻度：真梦游=无意识找暖，装睡=清醒装睡，假装梦游=借梦话主动索取，摊牌=不再演')
      .prefault('真梦游'),
    沉沦度: z.coerce
      .number()
      .describe('她在多大程度上已经接受这件事，0~100；低=还在自我说服，高=完全认了')
      .prefault(20)
      .transform((值) => _.clamp(Math.round(值), 0, 100)),
    积压值: z.coerce
      .number()
      .describe('玩家回避造成的不满足，0~100；超过 60 她开始主动进屋，超过 85 白天也快藏不住')
      .prefault(50)
      .transform((值) => _.clamp(Math.round(值), 0, 100)),
    感情深度: z.coerce
      .number()
      .describe('感情刻度，0~100；区分「只是欲望」和「已经离不开了」，只有性行为不涨')
      .prefault(10)
      .transform((值) => _.clamp(Math.round(值), 0, 100)),
    心情: z.string().describe('她此刻的情绪状态，用一句自然语言描述，不写数值').prefault('疲惫，睡着以后反而松下来了'),
    是否在床: z.boolean().describe('她此刻是否已经在<user>的床上').prefault(true),

    身体状态: z
      .object({
        睡眠: z
          .enum(['深睡', '浅睡', '将醒', '已醒'])
          .describe('她的睡眠深度；阶段一为深睡或浅睡，阶段二起是已醒但装睡。疲惫程度只落在这一项上，不设班次变量')
          .prefault('深睡'),
        睡衣: z.string().describe('睡衣此刻的状态：穿好、滑落、敞开、脱下，自由描述').prefault('棉质长袖睡衣，穿着整齐'),
        被子: z.string().describe('被子在谁身上：在她身上、在<user>身上、在两人身上、被掀开，自由描述').prefault('被子被掀开一半，搭在两人身上'),
      })
      .prefault({}),
  }).prefault({}),
}).prefault({});

export type Schema = z.output<typeof Schema>;
