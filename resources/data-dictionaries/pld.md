# Provincial Laboratory Data field guide / 省级实验室数据字段指南

> **Public planning workbook available / 已有公开规划工作簿**  
> This bilingual guide interprets the workbook for learning and request design. It is not a current custodian-approved extract specification. / 本双语指南用于学习与数据申请设计，并非数据保管方批准的现行提取规范。

- **Official workbook / 官方工作簿:** [LAB_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/LAB_elements.xlsx)
- **Catalogue name / 目录名称:** Provincial Laboratory Data (PLD or Lab Data)
- **Catalogue availability / 目录可用期:** 2012-04-01 to current / 2012-04-01 至当前
- **Catalogue refresh / 目录刷新:** daily, about one-week delay / 每日更新，约滞后一周
- **Verified / 核验日期:** 2026-08-10

## What one row means / 一行数据代表什么

The natural analytical grain is **one resulted laboratory test component**, not one person, one specimen, or one panel order. A panel may generate several component results, and a person can have several results for the same test on the same day. The approved extract must state how orders, specimens, components, corrections, and repeated results are represented.

自然分析粒度是 **一个已出结果的实验室检验成分**，而不是一位患者、一份标本或一张组合检验医嘱。一个 panel 可能产生多个 component 结果，同一人在同一天也可能有多次同项检验。获批提取必须说明医嘱、标本、检验成分、修订结果与重复结果如何表示。

The workbook describes a consolidated view built from four historical general-laboratory systems—Meditech, Millennium, Sunquest, and LabFusion. It warns that source-system and business-practice differences can confound provincial comparisons. Point-of-care testing may be missing, and specialized domains can follow different coverage rules.

工作簿说明该视图整合了 Meditech、Millennium、Sunquest 与 LabFusion 四个历史通用实验室系统，并提示源系统与业务流程差异可能干扰全省比较。床旁检验可能缺失，专门检验领域也可能采用不同覆盖规则。

## Workbook structure / 工作簿结构

- **3 worksheets / 3 个工作表:** Overview; Commonly requested elements; Reference-lab test name list.
- **14 commonly requested elements / 14 个常用申请字段.**
- **10,872 data rows in the reference list / 检验名称参考表含 10,872 个数据行.** This is a planning crosswalk, not proof that every named test is available at every site and time. / 它是规划用映射表，不能证明每个名称在所有机构与年份均有数据。
- The workbook metadata was last modified on 2020-08-21; reconfirm the current CLDR/Connect Care architecture and field list. / 文件元数据最后修改于 2020-08-21；须重新确认当前 CLDR、Connect Care 架构与字段清单。

## The 14 common elements / 14 个常用字段

| Field / 字段 | 中文解读 | English interpretation | Analysis note / 分析提示 |
|---|---|---|---|
| `CLNT_GNDR` | 登记时报告的源系统性别代码。 | Source-system sex category reported at registration. | Preserve source terminology and unknown values; do not infer gender identity. / 保留源术语与未知值，不推断性别认同。 |
| `CLNT_PHN` | 与 AHCIP 登记相关的个人健康号码。 | Personal Health Number associated with AHCIP registration. | May be transformed or withheld; use only the approved linkage key. / 可能被转换或不提供；只能使用获批链接键。 |
| `CLNT_ULI` | Central Stakeholder Registry 的终身个人标识。 | Unique Lifetime Identifier from the stakeholder registry. | A ULI does not by itself establish coverage eligibility. / ULI 本身不证明具备医保资格。 |
| `ORDR_TEST_CODE_CD` | panel 或 group test 等医嘱项目代码。 | Identifier for the ordered procedure, such as a panel or group test. | Do not equate it with the component-result code. / 不可与检验成分代码混同。 |
| `ORDR_TEST_CODE_NM` | 医嘱项目名称。 | Name of the ordered procedure. | Names can drift across sites and system migrations. / 名称会随机构和系统迁移变化。 |
| `TEST_ABNRML_FLAG` | 源系统异常结果标记。 | Source-system abnormal-result indicator. | Depends on the source reference range and flagging rules. / 取决于源系统参考区间与标记规则。 |
| `TEST_CD` | 结果级检验代码。 | Result-component test code. | Build a versioned crosswalk before pooling systems. / 跨系统汇总前建立带版本的映射。 |
| `TEST_NM` | 结果级检验名称。 | Result-component test name. | Similar names do not guarantee equivalent methods or specimens. / 名称相似不保证方法或标本等价。 |
| `TEST_REF_RNG` | Meditech、Sunquest 与 LabFusion 的文本参考范围。 | Text reference range for Meditech, Sunquest, and LabFusion. | Parse cautiously; preserve the source text. / 谨慎解析并保留原始文本。 |
| `TEST_REF_RNG_NRML_HIGH` | Millennium 的正常上限。 | Numeric normal high limit for Millennium. | Meaning depends on age, recorded sex, method, and unit. / 含义受年龄、登记性别、方法和单位影响。 |
| `TEST_REF_RNG_NRML_LOW` | Millennium 的正常下限。 | Numeric normal low limit for Millennium. | Do not substitute zero when missing. / 缺失时不可用零代替。 |
| `TEST_RSLT` | 已报告的结果值，可能为数值、文本或带限定符。 | Reported result, which may be numeric, text, or qualified. | Preserve `<`, `>`, comments, and non-numeric states. / 保留 `<`、`>`、评论及非数值状态。 |
| `TEST_UOFM` | 结果计量单位。 | Unit of measure for the result. | A bare number is not comparable without its unit and method. / 脱离单位和方法的裸数值不可比较。 |
| `TEST_VRFY_DTTM` | 检验被验证及/或执行的日期时间。 | Date and time the result was verified and/or performed. | Confirm whether the extract also provides collection, order, result, and correction times. / 另行确认是否含采集、开单、出结果和修订时间。 |

## Practical reading order / 实用阅读顺序

1. **Define the test concept / 定义检验概念:** specimen, method, component, acceptable units, and source systems. / 写明标本、方法、成分、允许单位及来源系统。
2. **Map order to component / 映射医嘱与成分:** distinguish `ORDR_TEST_CODE_*` from `TEST_*`. / 区分医嘱层与结果成分层字段。
3. **Normalize without erasing provenance / 标准化但保留来源:** retain original code, name, unit, site/system, and version beside the harmonized concept. / 在统一概念旁保留原代码、名称、单位、机构/系统和版本。
4. **Choose one time anchor / 选择时间锚点:** collection is often clinically preferable, but the common list exposes only verification/performance time; request the required timestamps. / 临床上常偏好采集时间，但常用字段只列验证/执行时间；应明确申请所需时间戳。
5. **Resolve repeated and corrected results / 处理重复及修订结果:** define whether to keep all states, the final verified state, or a clinically selected value. / 明确保留全部状态、最终验证状态，还是按临床规则选值。

## Illustrative research example / 合成研究示例

**Question / 问题:** Among adults discharged after an eligible DAD hospitalization, how does outpatient kidney-function testing change during the next 30 days? / 在符合条件的 DAD 成人住院者中，出院后 30 天门诊肾功能检验如何变化？

- Freeze an approved test-code/name/unit crosswalk before analysis; do not select only by a text search on `TEST_NM`. / 分析前冻结获批的代码—名称—单位映射，不要只用 `TEST_NM` 文本搜索。
- Link person identifiers only under the approved plan; use DAD discharge as the index and a prespecified result-time definition. / 仅按获批方案进行个人链接；以 DAD 出院日为索引，并预先定义结果时间。
- Convert values only when the source unit and method support the conversion; keep a provenance column. / 仅在来源单位与方法支持时换算，并保留来源列。
- If several results occur on a day, define whether the outcome uses the first, last, most abnormal, or all results. / 同日多条结果时，预先规定使用首条、末条、最异常值或全部结果。
- Interpret the endpoint as **observed laboratory results in captured systems**, not universal testing or disease prevalence. / 结局只能解释为 **已覆盖系统中观察到的检验结果**，不能视为完整检测率或疾病患病率。

## Major interpretation traps / 主要解读陷阱

- **Panel ≠ component / 组合医嘱不等于检验成分:** counting both levels as tests inflates utilization. / 同时把医嘱层与成分层计数会高估使用量。
- **Code/name drift / 代码与名称漂移:** the same analyte can have many local codes; similar labels can represent different specimens or methods. / 同一分析物可有多个本地代码，相似标签也可能代表不同标本或方法。
- **Unit and reference-range heterogeneity / 单位与参考区间异质性:** never pool unharmonized numbers. / 不可直接汇总未统一的数值。
- **Result revision / 结果修订:** preliminary, corrected, and final results may coexist unless status logic is supplied. / 若无状态规则，初步、修订和最终结果可能并存。
- **Coverage bias / 覆盖偏差:** point-of-care and specialized tests may be absent; system migrations alter observable sites and periods. / 床旁与专门检验可能缺失，系统迁移会改变可观察机构与时期。
- **Clinical-context gap / 临床情境缺口:** PLD does not by itself explain why a test was ordered or whether treatment followed. / PLD 本身不能说明为何开检验或之后是否治疗。

## Request-design checklist / 数据申请设计清单

- [ ] Specify analyte, specimen, method, result states, units, sites, source systems, and dates. / 写明分析物、标本、方法、结果状态、单位、机构、来源系统和日期。
- [ ] Request current code lists, crosswalk version, result qualifiers, status fields, and all required timestamps. / 申请现行代码表、映射版本、结果限定符、状态字段和所需时间戳。
- [ ] State row grain and rules for panels, components, duplicate loads, corrections, and same-day repeats. / 明确行粒度以及 panel、component、重复装载、修订和同日重复规则。
- [ ] Quantify missing units, non-numeric results, unmapped codes, and site-time coverage. / 量化缺失单位、非数值结果、未映射代码及机构—时间覆盖。
- [ ] Apply approved privacy controls to identifiers, exact dates, rare tests, and small cells. / 对标识符、精确日期、罕见检验和小单元格执行获批隐私规则。

## Sources and reuse / 来源与复用

- [CHI — AHS datasets catalogue](https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets)
- [CHI — LAB_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/LAB_elements.xlsx)
- [AHS — Requesting Data Resources](https://www.albertahealthservices.ca/research/Page16074.aspx)
- [UCalgary Website Terms and Conditions](https://www.ucalgary.ca/website-terms-conditions)

The original XLSX is not mirrored in this repository. The linked workbook is a public planning resource, not patient-level data and not an open licence to redistribute underlying data. / 本仓库不镜像原始 XLSX。链接工作簿是公开规划资料，不是患者级数据，也不构成对底层数据的开放再分发许可。

**Content verification date / 内容核验日期:** 2026-08-10.
