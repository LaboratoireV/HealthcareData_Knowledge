# 出院摘要数据库（DAD）｜Discharge Abstract Database (DAD)

> 核验日期 / Verified: **2026-08-10（America/Edmonton）**  
> 本页是对公开官方工作簿的原创双语导读，不是字段字典的逐项翻译，也不代表可获得记录级数据。  
> This is an original bilingual guide to the public official workbook. It is not a field-by-field translation and does not imply access to record-level data.

## 状态与官方直链｜Status and official link

- **公开状态：** UCalgary Centre for Health Informatics（CHI）目录当前提供官方字段工作簿。目录标示覆盖 **2002-04-01 至当前**，**每月更新，约滞后 1 个月**；工作簿 `Overview` 的范围与刷新说明一致。
- **Public status:** The UCalgary Centre for Health Informatics (CHI) catalogue currently links an official field workbook. The catalogue reports coverage from **2002-04-01 to present**, updated **monthly with about a one-month delay**; the workbook `Overview` gives the same range and refresh pattern.
- **官方文件 / Official workbook:** [DAD_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/DAD_elements.xlsx)
- **重要边界 / Important boundary:** 公开的是数据字典，不是可下载的患者级 DAD 数据。The public file is a data dictionary, not a downloadable patient-level DAD dataset.

## 记录粒度｜Record grain

**中文：** 一条 DAD 记录代表一个报告机构的一次住院离院或分离摘要，例如出院或转院；它不是“一位患者”。同一人可以在不同时间或机构产生多条摘要。工作簿把 `SEQNUM` 描述为记录级唯一标识，但在提交期关闭前该值可能变化，关闭后才固定。

**English:** One DAD record represents one inpatient discharge or separation abstract from a reporting institution, such as a discharge or transfer; it is not “one patient.” The same person can produce multiple abstracts across time or facilities. The workbook describes `SEQNUM` as a record-level unique identifier, but notes that it may change while a submission period remains open and becomes permanent after closure.

## 工作簿结构与已核对字段数量｜Workbook structure and verified field count

| 工作表 / Worksheet | 已核对结构 / Verified structure |
|---|---|
| `Overview` | `A1:B8`；名称、覆盖期、刷新、描述、参考人群、历史、内容与地理层级。`A1:B8`; name, availability, refresh, description, reference population, history, content, and geography. |
| `commonly requested elements` | `A1:C59`；1 行表头加 **58 个字段行**。字段标识去重后为 **56 个**，因为 `FISCAL_YR` 与 `RIW_CODE` 各出现两次。`A1:C59`; one header plus **58 field rows**, representing **56 distinct element identifiers** because `FISCAL_YR` and `RIW_CODE` each appear twice. |
| `Reference-CCI codes` | `A1:D46473`；1 行表头加 **46,472 个参考行**。这些是参考行数，不是唯一 CCI 代码数。`A1:D46473`; one header plus **46,472 reference rows**. This is a row count, not a count of distinct CCI codes. |
| `Reference-ICD10&ICD9CM` | `A1:F31049`；1 行表头加 **31,048 个参考行**。这些是参考行数，不是唯一诊断代码数。`A1:F31049`; one header plus **31,048 reference rows**. This is a row count, not a count of distinct diagnosis codes. |

字段数量只描述这份公开“常用字段”工作表，并不表示获批提取只有这些字段。  
The field count describes the public “commonly requested elements” sheet; it does not mean an approved extract is limited to these elements.

## 核心字段组｜Core field groups

### 1. 记录、患者与联结｜Record, patient, and linkage

代表字段 / Representative fields: `SEQNUM`, `REGNO`, `CHARTNO`, `ULI`, `PHN`

- **中文：** `SEQNUM` 标识摘要记录；`REGNO` 与 `CHARTNO` 是机构分配的就诊或病历标识；`ULI` 与 `PHN` 支持在获批环境中的人员级联结。
- **English:** `SEQNUM` identifies the abstract record; `REGNO` and `CHARTNO` are facility-assigned visit or chart identifiers; `ULI` and `PHN` support person-level linkage in an approved environment.

### 2. 入院、出院与住院时长｜Admission, discharge, and length of stay

代表字段 / Representative fields: `ADMITDATE`, `ADMITTIME`, `DISDATE`, `DISTIME`, `ALL_DAYS`, `ACUTE_DAYS`, `ERIP_MIN`

- **中文：** 这些字段界定住院起止、总住院天数、急性照护天数，以及从急诊转入住院后的特定时间段。
- **English:** These elements define the start and end of the stay, total and acute-care days, and selected timing for patients moving from emergency care into inpatient care.

### 3. 入院方式、转院与出院转归｜Entry, transfer, and discharge disposition

代表字段 / Representative fields: `ADMITCAT`, `ADMITBYAMB`, `ENTRYCODE`, `INSTFROM`, `INSTTO`, `DISP`, `READMIT`

- **中文：** 用于描述入院类别、救护车到达、进入路径、机构间流向和出院去向。`READMIT` 是工作簿中的再入院代码，不能替代完整的跨机构再入院算法。
- **English:** These describe admission category, ambulance arrival, point of entry, inter-facility flow, and discharge destination. `READMIT` is a workbook-listed readmission code and should not replace a complete cross-facility readmission algorithm.

### 4. 诊断｜Diagnoses

代表字段 / Representative fields: `DXCODE1-DXCODE25`, `DXTYPE1-DXTYPE25`, `COMORB_LVL`

- **中文：** 最多 25 次出现的诊断代码与诊断类型描述住院期间记录的疾病或状况；诊断类型说明该状况在本次住院中的角色或影响。
- **English:** Up to 25 diagnosis-code occurrences and their diagnosis types describe conditions recorded during the stay; diagnosis type indicates the condition’s role or impact in that admission.

### 5. 干预与手术｜Interventions and procedures

代表字段 / Representative fields: `PROCCODE1-PROCCODE20`

- **中文：** 最多 20 次出现的 CCI 干预代码可用于定义操作或手术队列；随附 CCI 参考表可辅助解释代码文本。
- **English:** Up to 20 CCI intervention-code occurrences can define procedure or surgical cohorts; the embedded CCI reference sheet assists with code interpretation.

### 6. 机构、服务与地理｜Facility, service, and geography

代表字段 / Representative fields: `INST`, `INST_ZONE`, `INST_REG`, `RCPT_ZONE`, `POSTCODE`, `MPSERV`

- **中文：** 区分报告机构、机构所在区域、患者居住区域和主要患者服务。机构地理与患者地理是不同概念。
- **English:** These distinguish the reporting facility, facility geography, patient residence geography, and main patient service. Facility location and patient residence are different concepts.

### 7. 提供者角色｜Provider roles

代表字段 / Representative fields: `DOCSVC1-DOCSVC8`, `DOCTYPE1-DOCTYPE8`

- **中文：** 最多 8 次出现的医师服务或提供者类型字段描述参与照护的角色和专科类别，而不是完整临床团队名册。
- **English:** Up to eight physician-service or provider-type occurrences describe care roles and specialty categories, not a complete clinical-team roster.

### 8. 病例组合、资源与重症照护｜Case mix, resource use, and special care

代表字段 / Representative fields: `CMG`, `MCC`, `RIW`, `RIW_CODE`, `RIL`, `ICU_HOURS`, `CCU_HOURS`, `SCU1-SCU6`, `SCUHOURS1-SCUHOURS1`

- **中文：** 病例组合和资源强度字段支持资源使用比较；ICU、CCU 与特殊照护字段描述住院内特定照护时间。公开工作簿原样写作 `SCUHOURS1-SCUHOURS1`，使用前应向数据提供方确认预期重复范围。
- **English:** Case-mix and resource-intensity elements support utilization comparisons; ICU, CCU, and special-care elements describe time in selected care settings. The public workbook literally lists `SCUHOURS1-SCUHOURS1`; confirm the intended repeating range with the data provider before use.

## 如何使用｜How to use

1. **先定义离院事件 / Define the separation first.** 用 `DISDATE` 或明确的财政年度规则建立索引事件，并说明转院是否合并。Use `DISDATE` or an explicit fiscal-year rule to establish the index event, and state whether transfers are consolidated.
2. **把代码与角色一起用 / Use codes with their roles.** 诊断队列应同时考虑 `DXCODE` 与 `DXTYPE`；操作队列应记录使用的 CCI 范围。Diagnosis cohorts should consider both `DXCODE` and `DXTYPE`; procedure cohorts should document the CCI set used.
3. **选择合适的住院时长指标 / Choose the correct stay metric.** `ALL_DAYS`、`ACUTE_DAYS`、ICU/CCU 小时回答不同问题，不应互换。`ALL_DAYS`, `ACUTE_DAYS`, and ICU/CCU hours answer different questions and are not interchangeable.
4. **分开机构与居住地 / Separate facility and residence.** 用 `INST_ZONE` 描述机构，用 `RCPT_ZONE` 或 `POSTCODE` 描述患者居住地。Use `INST_ZONE` for facility geography and `RCPT_ZONE` or `POSTCODE` for residence.
5. **只在批准环境中联结 / Link only in an approved environment.** 若研究需要跨住院或跨数据集随访，应使用获批的人员标识和披露规则，而不是在公开环境处理直接标识符。If follow-up across admissions or datasets is needed, use approved person identifiers and disclosure rules rather than handling direct identifiers in a public environment.

## 主要陷阱｜Main pitfalls

- **摘要不等于患者 / Abstract is not person:** 同一患者可有多条 DAD 记录。A patient can have multiple DAD records.
- **摘要不等于完整病历 / Abstract is not the full chart:** 工作簿说明内容主要来自标准化摘要流程，并偏重医生出院文书中影响住院时间或资源的诊断与干预。The workbook says content comes from a standardized abstraction process and is weighted toward diagnoses and interventions documented as affecting time or resources.
- **场景随时间变化 / Settings vary over time:** 工作簿说明除急性住院外，部分康复、长期照护、精神健康和日间手术内容曾在不同时间被捕获；不要假定所有场景各年一致。The workbook notes that some rehabilitation, long-term care, mental-health, and day-surgery activity has been captured over time; do not assume uniform setting coverage by year.
- **重复字段需要整形 / Repeating fields require reshaping:** 诊断、诊断类型、操作、提供者和特殊照护字段以编号重复出现，展开或长表化时必须保持对应关系。Diagnoses, diagnosis types, procedures, providers, and special-care elements repeat by numbered occurrence and must remain aligned when reshaped.
- **提交期内记录号可能变化 / Record identifier may change before closure:** `SEQNUM` 在提交期仍开放时可能变化。`SEQNUM` may change while the submission period is open.
- **编码与字段会演变 / Codes and fields evolve:** `Overview` 明示 CIHI 提交要求变化时字段可能新增或停用，历史比较需记录代码与方法学年份。The `Overview` states that fields may be added or become redundant as CIHI submission requirements change; longitudinal work should document code and methodology years.
- **公开表中有重复行 / The public sheet contains duplicate element rows:** `FISCAL_YR` 与 `RIW_CODE` 各列两次，因此 58 行不等于 58 个唯一字段。`FISCAL_YR` and `RIW_CODE` each appear twice, so 58 rows do not equal 58 distinct fields.

## 来源与许可提示｜Sources and licence note

- [UCalgary CHI — Alberta Health Services Datasets catalogue](https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets)
- [UCalgary CHI — DAD_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/DAD_elements.xlsx)
- [UCalgary — Website Terms & Conditions](https://www.ucalgary.ca/website-terms-conditions)

**中文：** 当前目录页没有为该工作簿标示 Creative Commons、Open Government Licence 或其他数据集专用开放许可。UCalgary 通用网站条款提供有限的个人、非商业使用许可，并对复制、分发和再发布作出限制。因此本站应链接官方文件，不应镜像或重新托管工作簿。工作簿可公开查看不表示底层健康数据可公开获取或再分发。

**English:** The current catalogue does not display a Creative Commons, Open Government Licence, or another dataset-specific open licence for this workbook. UCalgary’s general website terms provide a limited personal, non-commercial licence and restrict copying, distribution, and republication. A learning site should therefore link to the official file rather than mirror or re-host it. Public access to the workbook does not make the underlying health data open or redistributable.
