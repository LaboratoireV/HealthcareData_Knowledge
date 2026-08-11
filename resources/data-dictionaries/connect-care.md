# Connect Care (Epic): request-specific system guide / Connect Care（Epic）：按申请确认的系统指南

> **No public field workbook / 未发现公开字段工作簿**  
> As of 2026-08-10, the reviewed official CHI catalogue describes Connect Care but does **not** link a public field-level XLSX workbook for it. This document is **not a data dictionary** and does not assert Epic table or field names. It is a checklist for obtaining documentation specific to the approved request and delivered extract.  
> 截至 2026-08-10，经核验的 CHI 官方目录虽介绍 Connect Care，但**没有链接公开的字段级 XLSX 工作簿**。本文件**不是数据字典**，也不声称任何 Epic 表名或字段名；它是一份问题清单，用于取得针对获批申请和实际交付提取的文档。

Connect Care is Alberta Health Services' province-wide clinical information system, implemented in waves. AHS reported that the final rollout at Rockyview General Hospital and South Health Campus occurred on 2024-11-02. A go-live date describes operational implementation; it does not by itself establish research-data completeness, validation status, refresh latency, or access rights.

Connect Care 是 Alberta Health Services 分阶段实施的全省临床信息系统。AHS 报告，Rockyview General Hospital 与 South Health Campus 于 2024-11-02 完成最后一轮上线。上线日期说明运行实施节点，但不能单独证明研究数据的完整性、验证状态、刷新延迟或访问权限。

## What the extract-specific guide must answer / 提取专属指南必须回答的问题

| Concept / 概念 | Questions to resolve in writing / 需要书面确认的问题 |
|---|---|
| Source model / 源数据模型 | Which approved source model, table/view, field, local dictionary, and element identifier produces each delivered variable? / 每个交付变量来自哪个获批源模型、表/视图、字段、本地字典与元素标识？ |
| Person / 患者 | What person key is delivered? How are duplicate or merged records handled, and what approved key supports linkage? / 交付何种患者键？重复或合并病历如何处理？使用何种获批键链接？ |
| Encounter / 就诊 | What creates an encounter, episode, admission, visit, contact, or department event, and which grain is delivered? / 什么形成一次就诊、治疗段、入院、访问、接触或科室事件？交付粒度是什么？ |
| Location and rollout / 地点与上线 | Which site, department, unit, and service fields are available? What was each site's go-live date and pre-Connect-Care source? / 有哪些机构、科室、病区与服务字段？各机构上线日期及上线前数据来源是什么？ |
| Orders and procedures / 医嘱与操作 | How are orderable concept, procedure, order set, priority, status, cancellation, discontinuation, and replacement represented? / 可开立项目、操作、医嘱集、优先级、状态、取消、停用与替换如何表示？ |
| Laboratory and observations / 检验与观察 | What identifies the concept, specimen, value, comparator, unit, reference range, abnormal flag, status, correction, and component hierarchy? / 哪些字段标识概念、标本、值、比较符、单位、参考区间、异常标记、状态、更正和组件层级？ |
| Medication / 用药 | Does an event represent a medication order, administration, dispense, reconciliation, home medication, or another workflow? How are dose, route, frequency, and status encoded? / 事件代表用药医嘱、给药、配药、用药核对、居家用药还是其他流程？剂量、途径、频率和状态如何编码？ |
| Documents and notes / 文档与病历 | Which note types and metadata are available? Is content structured, text, or rendered output? How are signed, amended, deleted, sensitive, or restricted versions handled? / 可提供哪些病历类型与元数据？内容是结构化值、文本还是渲染输出？签署、更正、删除、敏感或受限版本如何处理？ |
| Provider / 提供者 | Does a provider field mean author, ordering clinician, attending clinician, performer, verifier, cosigner, or service owner? / 提供者字段代表作者、开单者、主诊者、执行者、审核者、共同签署者还是服务归属？ |
| Time / 时间 | Which timestamp is clinical occurrence, order, collection, result, verification, entry, update, admission, discharge, or data-load time? What time zone rules apply? / 哪个时间戳代表临床发生、医嘱、采集、结果、审核、录入、更新、入院、出院或数据装载？采用何种时区规则？ |
| Status and version / 状态与版本 | Are current, final, cancelled, corrected, amended, deleted, or historical versions included? Can late-arriving data revise earlier extracts? / 是否包含当前、最终、取消、更正、修订、删除或历史版本？迟到数据是否会改写早期提取？ |
| Terminology / 术语 | Which standard and local codes, units, reference ranges, dictionaries, mappings, and version dates accompany the extract? / 提取附带哪些标准与本地代码、单位、参考区间、字典、映射及版本日期？ |
| Provenance and refresh / 来源与刷新 | What source lineage, transformation, validation status, refresh schedule, freeze date, and extract version apply? / 适用何种来源链、转换、验证状态、刷新周期、冻结日期和提取版本？ |
| Administrative linkage / 行政数据链接 | Which approved keys and event definitions connect the extract to DAD, NACRS, PLD, PIN, claims, Registry, Vital Statistics, or legacy SCM? / 哪些获批键与事件定义可链接 DAD、NACRS、PLD、PIN、Claims、Registry、生命统计或旧 SCM？ |

These are conceptual requirements, not presumed Connect Care/Epic field names. The data custodian must identify the actual fields and derivations for the approved extract.

以上是概念要求，并非推定的 Connect Care/Epic 字段名。数据保管方必须针对获批提取确认实际字段和派生逻辑。

## Minimum project specification / 最低项目规范

- **Question and cohort / 问题与队列:** define inclusion, exclusion, index event, look-back, follow-up, washout, competing events, and censoring. / 定义纳入、排除、索引事件、回溯、随访、洗脱、竞争事件与删失。
- **Row grain / 行粒度:** name the exact unit—person, encounter, order, result component, administration, document, or another event. / 指定确切单位：个人、就诊、医嘱、结果组件、给药、文档或其他事件。
- **Sites and time / 机构与时间:** list sites/departments and exact dates; request go-live, transition, downtime, and reliable-coverage metadata. / 列出机构/科室与精确日期，并申请上线、转换、停机和可靠覆盖元数据。
- **Concept set / 概念集:** submit clinical concepts and intended use, then have the custodian map them to approved source elements and code versions. / 提交临床概念及用途，再由保管方映射到获批源元素和代码版本。
- **Event-time rule / 事件时间规则:** specify the timestamp used for eligibility, exposure, index, and outcome; retain alternatives needed for validation. / 指定资格、暴露、索引和结局所用时间戳，并保留验证所需的替代时间。
- **Multiplicity and status / 多值与状态:** define handling of repeated measures, components, duplicates, cancelled orders, preliminary/final results, corrections, merged encounters, and late entries. / 定义重复测量、组件、重复项、取消医嘱、初步/最终结果、更正、合并就诊和迟录的处理。
- **Medication meaning / 用药含义:** request order, administration, and dispense as distinct event types unless the question explicitly needs only one. / 除非研究明确只需一种事件，否则应区分医嘱、给药与配药。
- **Documentation / 文档:** require a delivered-variable dictionary, code lists, derivations, missing-value meanings, lineage, refresh/freeze date, and extract identifier. / 要求提供交付变量字典、代码表、派生逻辑、缺失值含义、来源链、刷新/冻结日期和提取标识。
- **Linkage and privacy / 链接与隐私:** state approved linkage keys, deterministic/probabilistic logic, secure environment, date/geography precision, small-cell rules, and export restrictions. / 写明获批链接键、确定性/概率性逻辑、安全环境、日期/地理精度、小单元格规则和导出限制。

## Do not assume / 不要默认

- Do not assume “province-wide” means all sites, services, modules, and historical periods have equivalent research coverage. / 不要默认“全省系统”意味着所有机构、服务、模块与历史时段具有同等研究覆盖。
- Do not assume go-live date equals the first analytically complete or validated date. / 不要默认上线日就是首个分析完整或已验证日期。
- Do not assume operational availability or frequent refresh means same-day research extraction. / 不要默认运行系统可用或频繁刷新就等于研究提取可当日获得。
- Do not assume an interface label maps directly to one database field or stable concept across versions. / 不要默认界面标签直接对应单一数据库字段，或在不同版本中概念稳定。
- Do not assume an order was performed, a medication order was administered, a result is final, or a note set is complete. / 不要默认医嘱已执行、药物医嘱已给药、结果已最终确认或病历集完整。
- Do not pool pre- and post-go-live data without a documented source-transition and harmonization plan. / 没有来源转换与协调方案时，不要合并上线前后数据。
- Do not join Connect Care and administrative datasets on dates or text alone when an approved linkage key and event definition are required. / 需要获批链接键和事件定义时，不要仅按日期或文本连接 Connect Care 与行政数据。

## Sources and next step / 来源与下一步

- [CHI — AHS datasets catalogue / AHS 数据集目录](https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets)
- [Alberta Health Services — Requesting Data Resources](https://www.albertahealthservices.ca/research/Page16074.aspx)
- [AHS — Connect Care rollout completion](https://www.albertahealthservices.ca/news/Page18624.aspx)

Send the questions above with the feasibility or data-access inquiry. Store any custodian-supplied data model, mapping, or extraction specification in the project's controlled documentation; do not publish request-confidential material here.

在可行性评估或数据访问咨询中附上以上问题。保管方提供的数据模型、映射或提取规范应存入项目受控文档区；不要在此公开申请保密材料。

**Status and link verification date / 状态与链接核验日期:** 2026-08-10.
