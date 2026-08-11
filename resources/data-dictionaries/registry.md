# AHCIP Registry field guide / AHCIP 登记库字段指南

> **Public workbook available / 已有公开工作簿**  
> The Centre for Health Informatics (CHI) links a public planning workbook for the Alberta Health Care Insurance Plan (AHCIP) Registry. This guide interprets its 15 populated “commonly requested elements” for learning and request design. It is not a replacement for the current custodian-approved extract specification.  
> 卡尔加里大学健康信息学中心（CHI）提供了 AHCIP 登记库公开规划工作簿。本指南以原创方式解读其中 15 个已填写的“常用申请字段”，用于学习和设计数据申请；它不能替代保管方批准的现行提取规范。

- **Official workbook / 官方工作簿:** [Registry_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/Registry_elements.xlsx)
- **Workbook availability statement / 工作簿所述可用范围:** 1994-04-01 to current / 1994-04-01 至当前
- **Workbook refresh statement / 工作簿所述刷新:** annual, with roughly a six-month lag / 每年刷新，约滞后六个月
- **Verified / 核验日期:** 2026-08-10

## What one row means / 一行数据代表什么

For planning purposes, think of the common Registry product as a **person-by-fiscal-year-end eligibility snapshot**. The reference date is March 31. It can support eligibility denominators, demographic description, migration flags, and approved person-level linkage. Confirm the delivered grain—especially whether inactive people, multiple coverage episodes, or intra-year events are represented separately—before writing code.

在研究规划阶段，可把常见 Registry 产品理解为一张 **“个人 × 财年末”参保资格快照**，参考日为 3 月 31 日。它可用于构建参保人口分母、描述人口学特征、识别迁入迁出标记，以及在获批条件下进行个人层级链接。编程前仍须确认实际交付粒度，尤其要确认非活跃人员、多段参保期和财年内事件是否以独立记录呈现。

The Registry covers nearly all AHCIP-eligible Albertans, not every person physically present in Alberta. The workbook notes groups that may sit outside ordinary AHCIP registration, including members of the Canadian Armed Forces, RCMP members, federal inmates, and new residents who have not yet transferred coverage.

Registry 覆盖几乎所有符合 AHCIP 资格的阿尔伯塔居民，但不等于某一时点实际居住在省内的所有人。工作簿提示，常规 AHCIP 登记之外可能包括加拿大武装部队成员、皇家骑警成员、联邦囚犯，以及尚未完成医保转入的新居民等群体。

## The 15 commonly requested elements / 15 个常用申请字段

The names below preserve the workbook labels, while the descriptions are concise original interpretations. Always match them against the variable names and coding supplied with the approved extract.

下表保留工作簿中的字段名，解释为便于学习的原创摘要。实际分析时，必须与获批提取所附的变量名、代码表和版本逐项核对。

| Field / 字段 | 中文解读 | English interpretation | Analysis note / 分析提示 |
|---|---|---|---|
| `ACTIVE_COVERAGE` | 财年末是否仍有 AHCIP 有效保障。 | Whether AHCIP coverage is active at fiscal year end. | Treat as a March 31 status, not proof of uninterrupted full-year coverage. / 它是 3 月 31 日状态，不证明整年连续参保。 |
| `AGE_GRP_CD` | 按财年末年龄分组；工作簿使用婴儿、5 岁组、90 岁以上及未知等类别。 | Fiscal-year-end age group, using infant, five-year, 90-plus, and unknown categories in the workbook. | Use the supplied code list; do not reverse-engineer exact age from a band. / 使用随附代码表，勿从年龄组反推精确年龄。 |
| `ALT_PREM_ARRANGEMENT` | 历史保费安排/项目类别字段；工作簿明确提示 2009 年取消保费后质量下降。 | A historical premium-arrangement or program category; the workbook warns that quality declined after premiums ended in 2009. | Do not treat it as a direct socioeconomic measure or use its First Nations-labelled code as Indigenous identity. / 不应将其当作直接社会经济指标，也不能用其中带 First Nations 标签的代码代替原住民身份。 |
| `ASN` | 用于标准披露产品的匿名利益相关者编号，可在获批产品之间匹配同一人。 | Anonymous Stakeholder Number used to match a person across approved standard disclosure products. | It is a linkage key, not a clinical identifier; test uniqueness within the delivered grain. / 它是链接键而非临床标识；应在交付粒度内检验唯一性。 |
| `BIRTH_DT` | 登记时报告的出生日期。 | Date of birth reported during registration. | Apply approved date precision and suppression rules; derive age against an explicit index date. / 遵守获批日期精度和抑制规则，并以明确索引日计算年龄。 |
| `BIRTH_IND` | 本财年在阿尔伯塔出生的登记标记，可能受报告延迟影响。 | Indicator for an Alberta birth during the fiscal year, potentially affected by reporting delay. | Use Vital Statistics when an authoritative birth-event definition is required. / 如需权威出生事件定义，应链接生命统计。 |
| `DEATH_IND` | 因本财年内报告死亡而终止保障的标记。 | Indicator that coverage ceased because death was reported during the fiscal year. | It reflects Registry notification; validate death date/cause against Vital Statistics when required. / 它反映登记库获知的死亡；需要日期或死因时应以生命统计核验。 |
| `IN_MIGRATION_IND` | 本财年迁入阿尔伯塔的标记。 | Indicator of in-migration to Alberta during the fiscal year. | Define whether the study needs first-ever arrival, return migration, or any new coverage episode. / 应明确研究需要首次迁入、回流，还是任一新参保段。 |
| `OUT_MIGRATION_IND` | 本财年迁出阿尔伯塔的标记。 | Indicator of out-migration from Alberta during the fiscal year. | Do not interpret absence of the flag as confirmed continuous residence. / 没有该标记并不等于已证实连续居住。 |
| `PHN` | 工作簿字段名为 PHN，描述为个人终身唯一标识，用于资格和跨项目参照。 | Labelled PHN in the workbook and described as a unique lifetime person identifier for eligibility and cross-program reference. | The disclosed linkage key may be transformed; use only the identifier named in the approved linkage plan. / 实际披露的链接键可能已转换；只能使用获批链接方案指定的标识。 |
| `POSTAL_CD` | 财年末登记的邮寄地址邮政编码。 | Mailing-address postal code recorded at fiscal year end. | Mailing address may differ from residence; document geocoding version and missingness. / 邮寄地址可能不同于居住地；应记录地理编码版本及缺失情况。 |
| `RHA` | 由邮政编码派生的历史卫生区代码；工作簿采用旧版 9 个 Regional Health Authority 边界。 | Historical health-region code derived from postal code using the former nine-Regional-Health-Authority geography. | Do not relabel it as a current AHS zone; request a crosswalk or re-geocode when needed. / 不可直接重命名为当前 AHS 分区；必要时申请映射表或重新地理编码。 |
| `SEX` | AHCIP 登记时记录的性别字段，工作簿代码为 F、M、U。 | Recorded sex field in the AHCIP Registry; the workbook lists F, M, and U. | Preserve the source terminology and unknown category; do not infer gender identity. / 保留源字段术语和未知类别，不推断性别认同。 |
| `PERS_REAP_END_DATE` | 家庭保障终止或受抚养人被删除时形成的资格/保费结束日期。 | Registration eligibility and premiums end date derived when family coverage is cancelled or a dependent is deleted. | Clarify whether this is episode end, administrative processing date, or both in the delivered extract. / 应确认交付数据中它代表参保段结束、行政处理日期，还是两者。 |
| `FYE` | 以 3 月 31 日标记的财年结束年份；例如 2011 通常代表 2010/11 财年。 | Fiscal-year-end value as at March 31; for example, 2011 ordinarily denotes fiscal year 2010/11. | State the convention in tables and code to prevent calendar-year misclassification. / 在表格和代码中明确规则，避免误当作自然年。 |

## A practical reading order / 实用阅读顺序

1. **Record and linkage / 记录与链接:** `ASN`, `PHN`, `FYE`
2. **Eligibility / 参保资格:** `ACTIVE_COVERAGE`, `PERS_REAP_END_DATE`
3. **Demographics / 人口学:** `BIRTH_DT`, `AGE_GRP_CD`, `SEX`
4. **Population flow / 人口流动:** `BIRTH_IND`, `DEATH_IND`, `IN_MIGRATION_IND`, `OUT_MIGRATION_IND`
5. **Geography and historical program context / 地理与历史项目背景:** `POSTAL_CD`, `RHA`, `ALT_PREM_ARRANGEMENT`

## Interpretation safeguards / 解读护栏

- **Snapshot, not exposure history / 快照并非完整暴露史:** A March 31 active flag cannot by itself establish continuous eligibility during a study window. Request episode dates or a documented continuity algorithm when continuous coverage matters.
- **Registry, not census / 登记库并非人口普查:** Administrative eligibility rules and registration delays shape who appears. The workbook also warns that the removal of premiums in 2009 reduced incentives to report departures, potentially increasing overcount.
- **Mailing address, not assured residence / 邮寄地址不保证为居住地:** Define whether a postal-code-derived geography is acceptable for the research question.
- **Historical geography / 历史地理体系:** `RHA` is based on former boundaries and must not be presented as a current AHS zone without a validated crosswalk.
- **Weak proxy / 弱代理变量:** `ALT_PREM_ARRANGEMENT` has a source quality warning and should not be promoted into a socioeconomic or identity measure without a defensible validation study.
- **Administrative sex field / 行政登记性别字段:** Use the source's recorded category and time context; do not infer gender identity or current clinical status.
- **Event flags are not registries / 事件标记不等于专门登记:** `BIRTH_IND` and `DEATH_IND` support population accounting but do not replace Vital Statistics for authoritative event dates or causes.
- **Approved linkage only / 仅限获批链接:** PHN/ULI-like identifiers and ASN may be transformed, encrypted, or withheld. The approved linkage specification determines the usable key.

## Request-design checklist / 数据申请设计清单

- [ ] Define the person-time denominator and whether it requires March 31 eligibility, any eligibility in-year, or continuous coverage. / 明确人时分母需要财年末参保、财年内任意参保，还是连续参保。
- [ ] State the requested fiscal years and the exact calendar dates they represent. / 写明目标财年及其对应的精确自然日期。
- [ ] Confirm row grain, inactive-person inclusion, multiple episodes, and duplicate rules. / 确认行粒度、是否含非活跃人员、多参保段及重复规则。
- [ ] Specify the linkage key and the datasets to be linked; never assume raw PHN will be supplied. / 指定链接键和待链接数据集，不假定会提供原始 PHN。
- [ ] Define age, sex, geography, migration, birth, and death algorithms before extraction. / 提取前定义年龄、登记性别、地理、迁移、出生和死亡算法。
- [ ] Request code lists, missing-value meanings, derivation logic, refresh date, and extract version. / 申请代码表、缺失值含义、派生逻辑、刷新日期和提取版本。
- [ ] Pre-specify privacy controls for dates, postal codes, rare categories, and small cells. / 预先规定日期、邮编、罕见类别和小单元格的隐私控制。

## Sources / 来源

- [CHI — AHS datasets catalogue / AHS 数据集目录](https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets)
- [CHI — Registry_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/Registry_elements.xlsx)
- [Alberta Health Services — Requesting Data Resources](https://www.albertahealthservices.ca/research/Page16074.aspx)
- [Government of Alberta — Health research and data access](https://www.alberta.ca/health-research)

**Content verification date / 内容核验日期:** 2026-08-10.
