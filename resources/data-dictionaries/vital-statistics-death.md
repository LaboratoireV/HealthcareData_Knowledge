# Vital Statistics Death Registry field guide / 生命统计死亡登记字段指南

> **Partial public dictionary / 部分公开字典**  
> The current CHI catalogue describes Vital Statistics more broadly, but its public workbook link covers the **Death Registry only**. Birth and stillbirth projects require separately confirmed current specifications. / 当前 CHI 目录对生命统计的介绍更广，但公开链接工作簿只覆盖 **死亡登记**。出生与死胎项目须另行确认现行规格。

- **Official workbook / 官方工作簿:** [VitalStatisticsDeath_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/VitalStatisticsDeath_elements.xlsx)
- **Workbook availability / 工作簿可用期:** 1983 to current / 1983 至当前
- **Catalogue refresh / 目录刷新:** annual, about one-year delay / 每年更新，约滞后一年
- **Verified / 核验日期:** 2026-08-10

## What one row means / 一行数据代表什么

The natural grain is **one registered death event**. Information is derived from the death registration, medical certificate of death, and medical examiner certificate where applicable, with additional analytical variables. The workbook states that all deaths occurring in Alberta must be registered; cohort interpretation must still distinguish place of occurrence from usual residence and confirm treatment of Alberta residents who die elsewhere.

自然粒度是 **一次已登记死亡事件**。信息来自死亡登记表、死亡医学证明及适用时的法医死亡证明，并加入分析派生变量。工作簿说明在 Alberta 发生的死亡必须登记；队列解释仍须区分死亡发生地与通常居住地，并确认 Alberta 居民在省外死亡时的处理。

The public list is designed for planning, not a complete certificate schema. It exposes an underlying-cause field but does not list every contributing or multiple-cause field. ULI appears from 1999 onward according to the workbook; up to five primary/secondary ULI fields may need linkage reconciliation.

公开清单用于规划，并非完整死亡证书结构。它列出根本死因字段，但没有列出所有伴随或多重死因字段。工作簿说明 ULI 自 1999 年起提供；最多五个主/次 ULI 字段可能需要链接对账。

## Workbook structure / 工作簿结构

- **2 worksheets / 2 个工作表:** Overview and Commonly requested elements.
- **21 commonly requested elements / 21 个常用申请字段.** The sheet contains 22 populated rows including its header. / 工作表含表头共 22 个非空行。
- The workbook metadata was last modified on 2020-08-21. / 工作簿元数据最后修改于 2020-08-21。
- The workbook's worksheet dimension/used-range can extend far beyond the populated rows; only populated cells were counted. / 工作簿 used-range 可能远超真实内容，本次只统计有值单元格。

## The 21 common elements / 21 个常用字段

| Field / 字段 | 中文解读 | English interpretation | Analysis note / 分析提示 |
|---|---|---|---|
| `AGE` | 死亡时年龄，必须与年龄单位/代码一起使用。 | Age at death, intended to be used with an age-unit/code field. | `AGE_CODE` is referenced by the description but absent from the 21-field list; request it explicitly. / 说明提到 `AGE_CODE`，但 21 字段清单未列出，须明确申请。 |
| `AUTOPSY` | 是否进行尸检的标记。 | Indicator that an autopsy was performed. | Does not describe findings or completeness. / 不包含尸检发现或完整程度。 |
| `BIRTH_DATE` | 死者出生日期。 | Transformed date of birth of the deceased. | Highly identifying; request only necessary precision. / 识别风险高，只申请所需精度。 |
| `DETHDATE` | 死亡日期。 | Conformed date of death. | Define handling of uncertain dates and reporting corrections. / 定义不确定日期和后续修订处理。 |
| `DR_ID` | 唯一死亡登记事件标识。 | Unique death-registration event identifier. | Event key, not a person key. / 它是事件键，不是个人键。 |
| `FISCAL_YR` | 死亡所在财年，以 3 月 31 日结束年份编码。 | Fiscal year of death, coded by the March 31 ending year. | Do not confuse with calendar year. / 不可与自然年混用。 |
| `HOSP_ID` | 医院标识。 | Hospital identifier. | Confirm coverage, coding version, and meaning for non-hospital deaths. / 确认覆盖、代码版本及院外死亡含义。 |
| `MARRST` | 死亡时登记的婚姻状况。 | Marital status at death. | Administrative category, possibly missing or historical. / 属行政类别，可能缺失或受历史口径影响。 |
| `OCCUPATION` | 主要职业的自由文本。 | Free-text main occupation. | Requires controlled coding, privacy review, and missingness assessment. / 需要规范编码、隐私审查和缺失评估。 |
| `PL_DETH` | 死亡发生地点类别。 | Place where death occurred. | Distinguish facility, home, and other categories using the supplied value set. / 按随附值集区分机构、家中及其他类别。 |
| `PL_INJURY` | 伤害发生地点字段。 | Place-of-injury field. | The workbook description appears internally inconsistent; confirm current definition before use. / 工作簿说明存在内部不一致，使用前须重核定义。 |
| `PL_SGC` | 与死亡地点相关的特殊地理代码。 | Special geographic code related to death location. | Request the code set, version, and derivation. / 申请代码表、版本和派生逻辑。 |
| `POSTCODE` | 死者通常居住地址的邮政编码。 | Postal code based on usual residence. | Not necessarily the place of death; document geocoding version. / 不一定是死亡地点，并应记录地理编码版本。 |
| `SEX` | 死亡登记中的 sex 字段。 | Sex recorded on the death registration. | Preserve source terminology; do not infer gender identity. / 保留源术语，不推断性别认同。 |
| `STKH_NUM_1` | 死者主要 ULI/PHN。 | Primary ULI/PHN of the deceased. | Available beginning in 1999 according to the workbook. / 工作簿说明从 1999 年起可用。 |
| `STKH_NUM_2` | 第 1 个次要 ULI。 | First secondary ULI. | Reconcile rather than treating as another person. / 应对账，不能当作另一人。 |
| `STKH_NUM_3` | 第 2 个次要 ULI。 | Second secondary ULI. | Use only under the approved linkage algorithm. / 只能按获批链接算法使用。 |
| `STKH_NUM_4` | 第 3 个次要 ULI。 | Third secondary ULI. | Test duplicate and many-to-one linkage patterns. / 检查重复和多对一链接。 |
| `STKH_NUM_5` | 第 4 个次要 ULI。 | Fourth secondary ULI. | Do not coalesce without a documented hierarchy. / 无明确层级时不可直接合并。 |
| `U_CAUSE` | 根本死因代码。 | Underlying cause of death. | Vital Statistics uses ICD-10; do not assume facility ICD-10-CA conventions. / 生命统计采用 ICD-10，不可假定与医疗机构 ICD-10-CA 口径相同。 |
| `YEAR` | 死亡自然年。 | Calendar year of death. | Use with `FISCAL_YR` only after stating the time convention. / 与 `FISCAL_YR` 并用时须说明时间口径。 |

## Practical reading order / 实用阅读顺序

1. **Define the event population / 定义事件人群:** deaths occurring in Alberta, deaths among Alberta residents, or a linked study cohort. / 明确研究省内发生死亡、Alberta 居民死亡，还是链接队列死亡。
2. **Choose the event key and person-linkage plan / 选择事件键与个人链接方案:** keep `DR_ID` separate from `STKH_NUM_1–5`. / 区分 `DR_ID` 与 `STKH_NUM_1–5`。
3. **Specify the time convention / 明确时间口径:** exact `DETHDATE`, `YEAR`, or `FISCAL_YR`. / 选择精确死亡日、自然年或财年。
4. **Freeze cause-of-death coding / 冻结死因编码:** define ICD-10 code list, year/version, underlying versus multiple cause, and external-cause logic. / 定义 ICD-10 清单、年份/版本、根本与多重死因及外因逻辑。
5. **Separate residence, occurrence, and facility / 区分居住地、发生地与机构:** `POSTCODE`, `PL_DETH`, `PL_SGC`, and `HOSP_ID` answer different questions. / 四者回答不同问题。

## Illustrative research example / 合成研究示例

**Question / 问题:** What is 30-day all-cause mortality after an eligible DAD discharge? / 符合条件的 DAD 出院后 30 天全因死亡率是多少？

- Define the DAD index discharge and whether transfers are linked into one episode. / 定义 DAD 索引出院，并说明是否把转院链接为一次 episode。
- Link under the approved ULI reconciliation plan; do not join only on one raw `STKH_NUM_*` field. / 按获批 ULI 对账方案链接，不能只连接某一个原始 `STKH_NUM_*`。
- Define day 0 and the 30-day interval using `DETHDATE`; quantify unlinked deaths and periods before ULI availability. / 用 `DETHDATE` 定义第 0 天和 30 天区间，并量化未链接死亡及 ULI 不可用时期。
- Treat the endpoint as **registered all-cause mortality**. If cause-specific mortality is secondary, freeze an ICD-10 `U_CAUSE` algorithm separately. / 结局解释为 **已登记全因死亡**；若分析死因别死亡，另行冻结 ICD-10 `U_CAUSE` 算法。
- Account for out-of-province death capture and emigration according to the custodian-approved data product. / 按获批产品说明处理省外死亡与迁出。

## Major interpretation traps / 主要解读陷阱

- **Death workbook ≠ all Vital Statistics / 死亡工作簿不等于全部生命统计:** it does not provide a public birth or stillbirth field dictionary. / 它不提供公开的出生或死胎字段字典。
- **Underlying cause ≠ every condition / 根本死因不等于所有病情:** `U_CAUSE` alone cannot reproduce multiple-cause analyses. / 仅用 `U_CAUSE` 不能完成多重死因分析。
- **ICD-10 ≠ ICD-10-CA / ICD-10 不等于 ICD-10-CA:** align cause algorithms to the Vital Statistics coding system. / 死因算法须适配生命统计编码体系。
- **Multiple ULI values / 多个 ULI:** primary/secondary identifiers describe one person and require reconciliation. / 主次标识属于同一人，需要对账。
- **Location ambiguity / 地点歧义:** residence, injury, death occurrence, and hospital are different geographies. / 居住、受伤、死亡发生与医院是不同地理概念。
- **Free-text sensitivity / 自由文本敏感性:** occupation can be identifying and analytically inconsistent. / 职业自由文本可能具有识别风险且分析一致性较差。

## Request-design checklist / 数据申请设计清单

- [ ] State event population, study years, exact/fiscal/calendar time convention, and linkage period. / 写明事件人群、年份、精确日/财年/自然年口径及链接时期。
- [ ] Confirm capture of Alberta residents dying outside the province and non-residents dying inside Alberta. / 确认 Alberta 居民省外死亡和非居民省内死亡的捕获方式。
- [ ] Request the current ULI hierarchy/linkage algorithm, `AGE_CODE`, value sets, and revision rules. / 申请当前 ULI 层级/链接算法、`AGE_CODE`、值集及修订规则。
- [ ] Specify underlying versus multiple cause, ICD-10 version, and external-cause rules. / 明确根本与多重死因、ICD-10 版本及外因规则。
- [ ] Apply approved precision, geocoding, rare-category, text-field, and small-cell controls. / 执行获批的精度、地理编码、罕见类别、文本字段和小单元格控制。

## Sources and reuse / 来源与复用

- [CHI — AHS datasets catalogue](https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets)
- [CHI — VitalStatisticsDeath_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/VitalStatisticsDeath_elements.xlsx)
- [Government of Alberta — Health data access](https://www.alberta.ca/health-research)
- [UCalgary Website Terms and Conditions](https://www.ucalgary.ca/website-terms-conditions)

The original XLSX is not mirrored in this repository. The public workbook is a planning aid; record-level Vital Statistics data remain controlled and require the applicable approvals and agreements. / 本仓库不镜像原始 XLSX。公开工作簿只是规划工具；记录级生命统计数据仍受控，必须取得适用审批与协议。

**Content verification date / 内容核验日期:** 2026-08-10.
