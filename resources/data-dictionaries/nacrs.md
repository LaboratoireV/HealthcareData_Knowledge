# 国家门诊护理报告系统（NACRS）｜National Ambulatory Care Reporting System (NACRS)

> 核验日期 / Verified: **2026-08-10（America/Edmonton）**  
> 本页是对公开官方工作簿的原创双语导读，不是字段字典的逐项翻译，也不代表可获得记录级数据。  
> This is an original bilingual guide to the public official workbook. It is not a field-by-field translation and does not imply access to record-level data.

## 状态与官方直链｜Status and official link

- **公开状态：** UCalgary CHI 目录当前提供官方字段工作簿。目录标示覆盖 **2001-04-01 至当前**，**每月更新，约滞后 1 个月**。
- **Public status:** The UCalgary CHI catalogue currently links an official field workbook. The catalogue reports coverage from **2001-04-01 to present**, updated **monthly with about a one-month delay**.
- **官方文件 / Official workbook:** [NACRS_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/NACRS_elements.xlsx)
- **官方口径冲突 / Official-source discrepancy:** 工作簿 `Overview` 写的是 **NACRS：2002-04-01 至当前**，并另列 **AACRS：2002-04-01 至 2010-03-31**；这与当前目录页的 2001 起点不一致。Workbook `Overview` states **NACRS: 2002-04-01 to present** and separately lists **AACRS: 2002-04-01 to 2010-03-31**, which conflicts with the current catalogue’s 2001 start date.
- **重要边界 / Important boundary:** 公开的是数据字典，不是可下载的患者级 NACRS 数据。The public file is a data dictionary, not a downloadable patient-level NACRS dataset.

## 记录粒度｜Record grain

**中文：** 一条记录代表一次符合报告规则的门诊护理活动或就诊摘要，而不是一位患者。工作簿把急诊、紧急护理和日间手术列为最适合研究的场景，同时说明其他专科诊所也可能有非摘要数据。某些电话、电子邮件、团体、居家或外展服务在符合报告要求时也可能形成记录。`SEQNUM` 是记录级标识，但提交期关闭前可能变化。

**English:** One record represents one reportable ambulatory-care activity or visit abstract, not one patient. The workbook identifies emergency care, urgent care, and day surgery as the strongest use cases while noting that non-abstracted data from other specialty clinics may also appear. Telephone, email, group, home, or outreach activity may be reported when it meets the reporting rules. `SEQNUM` is a record-level identifier but may change before the submission period closes.

## 工作簿结构与已核对字段数量｜Workbook structure and verified field count

| 工作表 / Worksheet | 已核对结构 / Verified structure |
|---|---|
| `Overview` | `A1:B6`；名称、覆盖期、刷新、描述、参考人群与历史。`A1:B6`; name, availability, refresh, description, reference population, and history. |
| `Commonly requested elements` | Excel 使用范围显示 `A1:C1041083`，但实际有值的只有 **第 1–44 行**：1 行表头加 **43 个字段行**，且为 **43 个不同字段标识**。The Excel used range reports `A1:C1041083`, but only **rows 1–44 contain values**: one header plus **43 field rows**, representing **43 distinct element identifiers**. |

工作簿没有附带独立的诊断或 CCI 代码参考工作表。百万行“使用范围”来自空白但已格式化的单元格，不能当作字段数量。  
The workbook does not include separate diagnosis- or CCI-reference worksheets. Its million-row “used range” is driven by blank formatted cells and must not be interpreted as the number of fields.

## 核心字段组｜Core field groups

### 1. 记录、患者与联结｜Record, patient, and linkage

代表字段 / Representative fields: `SEQNUM`, `ULI`, `PHN`, `CHARTNO`

- **中文：** `SEQNUM` 标识就诊记录；`ULI`、`PHN` 与机构病历号支持在获批环境中的人员或机构内联结。
- **English:** `SEQNUM` identifies the visit record; `ULI`, `PHN`, and the facility chart number support person-level or within-facility linkage in an approved environment.

### 2. 就诊类型与服务场景｜Visit type and service setting

代表字段 / Representative fields: `ABSTRACT_TYPE`, `ED_VISIT_INDICATOR`, `VISIT_MODE`, `MIS_CODE`

- **中文：** 用于区分摘要类型、真正急诊与在急诊区域进行的安排就诊、接触方式和主要功能中心。混合分析前必须先界定场景。
- **English:** These distinguish abstract type, a true ED visit from arranged activity occurring in an ED area, contact mode, and the primary functional centre. Define the setting before combining records.

### 3. 登记、离院与停留时间｜Registration, departure, and visit duration

代表字段 / Representative fields: `VISIT_DATE`, `VISIT_TIME`, `DISP_DATE`, `DISP_TIME`, `ED_DEPT_DATE`, `ED_DEPT_TIME`, `VISIT_LOS_MINUTES`, `ED_ER_MINUTES`, `EIP_MINUTES`

- **中文：** 这些字段分别描述登记、作出转归决定、实际离开急诊，以及工作簿列出的停留时长指标。分析等待或停留时必须明确选择哪个事件作为起点和终点。
- **English:** These describe registration, the disposition decision, physical ED departure, and workbook-listed duration measures. Any wait or length-of-stay analysis must state which events define the start and end.

### 4. 分诊与首次医师评估｜Triage and physician initial assessment

代表字段 / Representative fields: `TRIAGECODE`, `TRIAGE_DATE`, `TRIAGE_TIME`, `PIA_DATE`, `PIA_TIME`, `COMASCALE`

- **中文：** 可构建从登记到分诊、从登记或分诊到首次医师评估的流程指标；`COMASCALE` 记录格拉斯哥昏迷评分代码。
- **English:** These support flow measures from registration to triage and from registration or triage to first physician assessment; `COMASCALE` records the Glasgow Coma Scale code.

### 5. 诊断与干预｜Diagnoses and interventions

代表字段 / Representative fields: `DXCODE1-DXCODE10`, `PROCCODE1-PROCCODE10`

- **中文：** 最多 10 次出现的 ICD-10-CA 问题代码与最多 10 次出现的 CCI 干预代码描述本次门诊活动中记录的问题和操作。
- **English:** Up to 10 ICD-10-CA problem-code occurrences and up to 10 CCI intervention-code occurrences describe problems and procedures recorded for the ambulatory activity.

### 6. 转归、转院与机构｜Disposition, transfer, and facility

代表字段 / Representative fields: `DISPOSITION`, `INST`, `INSTFROM`, `INSTTO`, `INST_ZONE`

- **中文：** 用于描述就诊结束方式、报告机构和直接转入或转出的机构流向。
- **English:** These describe how the visit ended, the reporting institution, and direct transfers into or out of another facility or level of care.

### 7. 提供者与服务角色｜Provider and service roles

代表字段 / Representative fields: `PROVIDER_SVC1-PROVIDER_SVC8`, `PROVIDER_TYPE1-PROVIDER_TYPE8`

- **中文：** 最多 8 次出现的服务与提供者类型字段描述本次门诊活动中负责服务的专业角色。
- **English:** Up to eight provider-service and provider-type occurrences describe professional roles responsible for services during the ambulatory visit.

### 8. 病例组合与资源强度｜Case mix and resource intensity

代表字段 / Representative fields: `CACS_CODE`, `CACS_RIW`, `MAC`

- **中文：** CACS、相对资源强度和 Major Ambulatory Cluster 支持门诊病例组合与资源使用比较。
- **English:** CACS, relative resource intensity, and the Major Ambulatory Cluster support ambulatory case-mix and resource-use comparisons.

### 9. 人口与地理｜Demographics and geography

代表字段 / Representative fields: `AGE_ADMIT`, `GENDER`, `POSTCODE`, `RCPT_REG`, `RCPT_ZONE`, `PROV_PHN`, `FISCAL_YR`

- **中文：** 用于年龄、记录性别、居住地、健康号码签发省份和财政年度分层；机构区域与患者居住区域应分开。
- **English:** These support stratification by age, recorded gender, residence, province issuing the health number, and fiscal year; facility geography and patient residence should remain separate.

## 如何使用｜How to use

1. **先限定场景 / Define the setting first.** 用 `ABSTRACT_TYPE`、`ED_VISIT_INDICATOR`、`VISIT_MODE` 与 `MIS_CODE` 区分急诊、日间手术和其他门诊活动。Use `ABSTRACT_TYPE`, `ED_VISIT_INDICATOR`, `VISIT_MODE`, and `MIS_CODE` to separate ED, day-surgery, and other ambulatory activity.
2. **明确时间线 / Specify the timeline.** 登记、分诊、首次医师评估、转归决定和实际离开是不同事件；用对应日期和时间组合定义指标。Registration, triage, first physician assessment, disposition decision, and physical departure are distinct events; define metrics with the corresponding date-time pairs.
3. **用代码定义临床队列 / Define clinical cohorts with codes.** 记录使用的 `DXCODE` 与 `PROCCODE` 范围，并保持重复序号。Document the `DXCODE` and `PROCCODE` sets used and preserve occurrence order.
4. **用转归和流向描述结局 / Use disposition and flow for outcomes.** `DISPOSITION`、`INSTFROM` 与 `INSTTO` 可用于区分离院与转院路径。`DISPOSITION`, `INSTFROM`, and `INSTTO` can distinguish discharge and transfer pathways.
5. **只在批准环境中做人员级随访 / Perform person-level follow-up only in an approved environment.** 若研究返诊或跨数据集路径，应使用获批的 `ULI`/`PHN` 联结规则和披露控制。For revisits or cross-dataset pathways, use approved `ULI`/`PHN` linkage rules and disclosure controls.

## 主要陷阱｜Main pitfalls

- **记录不等于患者 / Record is not person:** 同一人可以产生多次门诊或急诊记录。One person can generate many ambulatory or ED records.
- **并非所有门诊场景同样完整 / Not all ambulatory settings are equally complete:** 工作簿把急诊、紧急护理和日间手术列为强制报告场景，同时警告专科诊所数据的准确性、完整性与可用性不一致。The workbook identifies ED, urgent care, and day surgery as mandatory reporting areas while warning that specialty-clinic accuracy, completeness, and availability vary.
- **NACRS 与 AACRS 历史不可静默拼接 / NACRS and AACRS history should not be silently pooled:** 工作簿说明两套系统虽有共同点，但切换后并非所有信息都可用。The workbook says the systems share many features but not all information remains available across the transition.
- **官方起始日期不一致 / Official start dates conflict:** 当前目录写 2001-04-01，工作簿写 NACRS 2002-04-01；申请前应由数据托管方确认项目实际提取范围。The current catalogue says 2001-04-01 while the workbook says 2002-04-01 for NACRS; confirm the actual extract range with the data custodian before requesting data.
- **不要混用时间戳 / Do not interchange timestamps:** `DISP_TIME` 是作出转归决定的时间，`ED_DEPT_TIME` 是实际离开急诊的时间，回答的问题不同。`DISP_TIME` is the disposition-decision time, while `ED_DEPT_TIME` is physical departure from the ED; they answer different questions.
- **重复字段需要保持对应 / Repeating fields must remain aligned:** 诊断、干预和提供者字段有多次出现，整形时不能丢失序号。Diagnosis, intervention, and provider elements repeat and must retain occurrence numbers when reshaped.
- **提交期内 `SEQNUM` 可能变化 / `SEQNUM` may change before closure:** 工作簿明确说明开放提交期内该值可能改变。The workbook explicitly notes that the value may change while a submission period is open.
- **Excel 使用范围严重膨胀 / Excel used range is heavily inflated:** 只有 43 个字段有值；把 `1041083` 行当成字段数会产生严重错误。Only 43 field rows contain values; treating `1041083` rows as fields would be a major ingestion error.

## 来源与许可提示｜Sources and licence note

- [UCalgary CHI — Alberta Health Services Datasets catalogue](https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets)
- [UCalgary CHI — NACRS_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/NACRS_elements.xlsx)
- [UCalgary — Website Terms & Conditions](https://www.ucalgary.ca/website-terms-conditions)

**中文：** 当前目录页没有为该工作簿标示 Creative Commons、Open Government Licence 或其他数据集专用开放许可。UCalgary 通用网站条款提供有限的个人、非商业使用许可，并对复制、分发和再发布作出限制。因此本站应链接官方文件，不应镜像或重新托管工作簿。公开工作簿不等于记录级 NACRS 数据可公开获取或再分发。

**English:** The current catalogue does not display a Creative Commons, Open Government Licence, or another dataset-specific open licence for this workbook. UCalgary’s general website terms provide a limited personal, non-commercial licence and restrict copying, distribution, and republication. A learning site should therefore link to the official file rather than mirror or re-host it. A public workbook does not make record-level NACRS data open or redistributable.
