# 医务人员理赔（Practitioner Claims）｜Practitioner Claims

> 核验日期 / Verified: **2026-08-10（America/Edmonton）**  
> 本页是对公开官方工作簿的原创双语导读，不是字段字典的逐项翻译，也不代表可获得记录级数据。  
> This is an original bilingual guide to the public official workbook. It is not a field-by-field translation and does not imply access to record-level data.

## 状态与官方直链｜Status and official link

- **公开状态：** UCalgary CHI 目录当前提供官方字段工作簿。目录标示覆盖 **1993-04-01 至当前**，**每季度更新，约滞后 4 个月**。
- **Public status:** The UCalgary CHI catalogue currently links an official field workbook. The catalogue reports coverage from **1993-04-01 to present**, updated **quarterly with about a four-month delay**.
- **官方文件 / Official workbook:** [CLAIMS_Elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/CLAIMS_Elements.xlsx)
- **官方口径冲突 / Official-source discrepancy:** 工作簿 `Overview` 写的是“季度更新、滞后 6 个月或更久”，与当前目录页的 4 个月不一致。Workbook `Overview` says “quarterly with six months or greater delay,” which conflicts with the current catalogue’s four-month delay.
- **使用状态 / Use status:** 工作簿明确把其内描述的数据限定为 AHS 质量改进用途，并说明研究请求应向 Alberta Health 提出。The workbook explicitly limits the data it describes to AHS quality-improvement use and directs research requests to Alberta Health.
- **重要边界 / Important boundary:** 公开的是数据字典，不是可下载的患者级理赔数据。The public file is a data dictionary, not a downloadable patient-level claims dataset.

## 记录粒度｜Record grain

**中文：** 这份工作簿以一项已支付的 practitioner claim / service event 为中心，而不是完整临床就诊。`FRE_ACTUAL_PAID_AMT` 描述该 claim 的实际支付总额，`HLTH_SRVC_CCPX_CODE` 描述申报的服务。公开的 22 个常用字段中没有单列的 claim 唯一标识，因此拿到实际提取后必须向数据提供方确认行级唯一键和去重规则。

**English:** The workbook is centred on a paid practitioner claim or service event, not a complete clinical encounter. `FRE_ACTUAL_PAID_AMT` describes the total amount paid for the claim, and `HLTH_SRVC_CCPX_CODE` identifies the service submitted. The 22 public commonly requested elements do not include a standalone unique claim identifier, so the row-level key and deduplication rule must be confirmed when an extract is provisioned.

## 工作簿结构与已核对字段数量｜Workbook structure and verified field count

| 工作表 / Worksheet | 已核对结构 / Verified structure |
|---|---|
| `Overview` | `A1:B6`；名称、覆盖期、刷新、描述、参考人群与历史。`A1:B6`; name, availability, refresh, description, reference population, and history. |
| `Commonly requested elements` | Excel 使用范围显示 `A1:C1048108`，但实际有值的只有 **第 1–23 行**：1 行表头加 **22 个字段行**，且为 **22 个不同字段标识**。The Excel used range reports `A1:C1048108`, but only **rows 1–23 contain values**: one header plus **22 field rows**, representing **22 distinct element identifiers**. |
| `Reference-Specialty Codes ` | 内容位于第 4–62 行；第 6 行为代码表头，第 7–62 行有 **56 个专科代码参考行**。Content appears in rows 4–62; row 6 is the code header and rows 7–62 contain **56 specialty-code reference rows**. |
| `Standard Grouping` | 第 7–26 行有 **20 个标准提供者专科分组行**，用于对照 Practitioner Claims 与 inpatient/ambulatory care 的专科分类。Rows 7–26 contain **20 standard provider-specialty grouping rows** mapping Practitioner Claims to inpatient/ambulatory-care specialty groupings. |

百万行“使用范围”来自空白但已格式化的单元格，不能当作字段数量。字段数量也只描述公开的常用字段表，不表示实际获批提取只含这些字段。  
The million-row “used range” is driven by blank formatted cells and must not be treated as a field count. The count also describes only the public commonly requested elements sheet, not the full contents of an approved extract.

## 核心字段组｜Core field groups

### 1. 服务日期与财政年度｜Service dates and fiscal year

代表字段 / Representative fields: `SE_START_DATE`, `SE_END_DATE`, `FISC_YR`

- **中文：** `SE_START_DATE` 与 `SE_END_DATE` 描述服务事件起止；`FISC_YR` 是 EDW 根据 `SE_END_DATE` 派生的财政年度。
- **English:** `SE_START_DATE` and `SE_END_DATE` describe the service-event interval; `FISC_YR` is an EDW-derived fiscal year based on `SE_END_DATE`.

### 2. 已申报服务与诊断｜Submitted service and diagnoses

代表字段 / Representative fields: `HLTH_SRVC_CCPX_CODE`, `HLTH_DX_ICD9X_CODE_1`, `HLTH_DX_ICD9X_CODE_2`, `HLTH_DX_ICD9X_CODE_3`

- **中文：** CCPX 代码描述申报的服务，三个 ICD-9 扩展诊断字段描述提供者随 claim 提交的主要、次要和第三诊断。
- **English:** The CCPX code identifies the submitted service, while three extended ICD-9 diagnosis elements describe the primary, secondary, and tertiary diagnoses submitted by the provider.

### 3. 支付与付款安排｜Payment and payment arrangement

代表字段 / Representative fields: `FRE_ACTUAL_PAID_AMT`, `PGM_APP_IND`

- **中文：** `FRE_ACTUAL_PAID_AMT` 是该 claim 实际支付总额；`PGM_APP_IND` 标识 Alternate Payment Plan 业务安排下的 claim 类型。
- **English:** `FRE_ACTUAL_PAID_AMT` is the total amount paid for the claim; `PGM_APP_IND` identifies the claim type under an Alternate Payment Plan business arrangement.

### 4. 提供者分类与专科｜Provider classification and specialty

代表字段 / Representative fields: `PERS_CAPB_PRVD_SKILL_CODE_CLS`, `PRVD_SKILL_TYPE_CLS`, `DOCTOR_CLASS`, `Provider_specialty`, `SECTOR_DOCCLASS`, `PRVD_IN_PROV_IND_AD`

- **中文：** 这些字段描述服务提供者的技能、类型、专科和派生分组。工作簿另附专科代码表与跨数据源标准分组表。
- **English:** These elements describe provider skill, type, specialty, and derived groupings. The workbook also includes a specialty-code reference and a standard cross-dataset grouping table.

### 5. 服务地点与功能中心｜Delivery site and functional centre

代表字段 / Representative fields: `DELV_SITE_FUNCTR_CODE_CLS`, `DELV_SITE_FUNCTR_TYPE_CODE`, `DELV_SITE_TYPE_CLS`, `DELV_SITE_POPDEN_TYPE_CLS`

- **中文：** 用于描述服务发生的功能中心、场所类型与所在地人口密度类型；这些是服务地点特征，不是患者住址。
- **English:** These describe the functional centre, delivery-site type, and population-density type where the service event occurred; they are service-location characteristics, not the patient’s residence.

### 6. 服务接受者与联结｜Recipient and linkage

代表字段 / Representative fields: `RCPT_ULI`, `RCPT_AGE_SE_END_YRS`, `RCPT_GENDER_CODE`

- **中文：** `RCPT_ULI` 是服务接受者的唯一终身标识，工作簿也把它称为 PHN；年龄按服务事件结束日计算，另有记录性别代码。
- **English:** `RCPT_ULI` is the recipient’s Unique Lifetime Identifier, also described in the workbook as the PHN; age is calculated at the service-event end date, with a separate recorded-gender code.

## 如何使用｜How to use

1. **先定义服务事件窗口 / Define the service-event window.** 用 `SE_END_DATE` 或工作簿定义的 `FISC_YR` 建立观察期，并明确不把提交日或支付日当作服务日。Use `SE_END_DATE` or the workbook-defined `FISC_YR` for the observation window, and do not silently substitute a submission or payment date for the service date.
2. **以服务代码为中心描述利用 / Describe utilization around the service code.** 用 `HLTH_SRVC_CCPX_CODE` 定义已申报服务，并把诊断字段视为随 claim 提交的有限临床信息。Use `HLTH_SRVC_CCPX_CODE` to define submitted services and treat diagnosis elements as limited clinical information submitted with the claim.
3. **分层提供者与地点 / Stratify provider and delivery site.** 使用技能、专科、`DOCTOR_CLASS`、功能中心和人口密度类型分析服务模式。Use skill, specialty, `DOCTOR_CLASS`, functional centre, and population-density type to examine service patterns.
4. **把支付额称为支付额 / Call paid amounts paid amounts.** 汇总 `FRE_ACTUAL_PAID_AMT` 时应报告为 claim 支付额，不应自动解释为完整照护成本。When aggregating `FRE_ACTUAL_PAID_AMT`, report it as claim payments rather than assuming it represents total cost of care.
5. **只在批准环境中联结 / Link only in an approved environment.** 人员级纵向利用研究需要获批的 `RCPT_ULI` 联结、访问和披露控制。Person-level longitudinal utilization work requires approved `RCPT_ULI` linkage, access, and disclosure controls.

## 主要陷阱｜Main pitfalls

- **理赔不等于完整就诊 / A claim is not a complete encounter:** 工作簿说明数据只捕获已申报项目，不会反映一次就诊提供的所有服务或患者呈现的所有状况。The workbook says the data capture submitted items only and do not represent every service delivered or every condition presented during a visit.
- **诊断是随 claim 提交的代码 / Diagnoses are claim-submitted codes:** 公开表只有三个 ICD-9 扩展诊断字段，不能等同完整临床问题列表。The public sheet contains only three extended ICD-9 diagnosis elements and should not be treated as a complete clinical problem list.
- **代码体系与 DAD/NACRS 不同 / Coding differs from DAD and NACRS:** 工作簿明确指出 Claims 使用的服务和诊断代码与其他行政系统不同，不能直接混用。The workbook explicitly notes that Claims uses different service and diagnosis codes from other administrative systems and they should not be combined without mapping.
- **公开视图有筛选 / The described view is filtered:** `Overview` 说明年度视图排除省外提供者，并只保留支付金额大于 0 的记录。The `Overview` says the annual views exclude out-of-province providers and retain records with paid amounts greater than zero.
- **1993–1994 是部分财政年度 / 1993–1994 is a partial fiscal year:** 工作簿说明系统年中转换导致该年度早期数据不可用，完整年度从 1994–1995 开始。The workbook says a mid-year system change left the earlier part unavailable, with full fiscal years beginning in 1994–1995.
- **刷新滞后口径冲突 / Refresh lag conflicts:** 当前目录写约 4 个月，工作簿写 6 个月或更久；研究设计和申请前必须确认实际可用截止日。The current catalogue says about four months, while the workbook says six months or more; confirm the actual available end date before design and request.
- **不能用于近实时报告 / Not suitable for near-real-time reporting:** 工作簿直接警告滞后可能很大。The workbook directly warns that lag can be considerable.
- **缺少公开的独立 claim ID / No standalone public claim ID:** 22 个常用字段中没有独立 claim 唯一标识；不能自行假定复合键。The 22 commonly requested elements do not include a standalone unique claim identifier; do not invent a composite key without confirmation.
- **Excel 使用范围严重膨胀 / Excel used range is heavily inflated:** 只有 22 个字段有值；把 `1048108` 行当成字段数会产生严重错误。Only 22 field rows contain values; treating `1048108` rows as fields would be a major ingestion error.

## 来源与许可提示｜Sources and licence note

- [UCalgary CHI — Alberta Health Services Datasets catalogue](https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets)
- [UCalgary CHI — CLAIMS_Elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/CLAIMS_Elements.xlsx)
- [UCalgary — Website Terms & Conditions](https://www.ucalgary.ca/website-terms-conditions)

**中文：** 当前目录页没有为该工作簿标示 Creative Commons、Open Government Licence 或其他数据集专用开放许可。UCalgary 通用网站条款提供有限的个人、非商业使用许可，并对复制、分发和再发布作出限制。因此本站应链接官方文件，不应镜像或重新托管工作簿。更重要的是，工作簿对底层数据另有明确用途限制：仅供 AHS 质量改进，研究请求应由 Alberta Health 处理。公开字典绝不等于理赔记录可以公开获取或再分发。

**English:** The current catalogue does not display a Creative Commons, Open Government Licence, or another dataset-specific open licence for this workbook. UCalgary’s general website terms provide a limited personal, non-commercial licence and restrict copying, distribution, and republication. A learning site should therefore link to the official file rather than mirror or re-host it. More importantly, the workbook places an explicit use restriction on the underlying data: it is for AHS quality improvement, with research requests directed to Alberta Health. A public dictionary never means claims records are open or redistributable.
