# Sunrise Clinical Manager (SCM): request-specific system guide / SCM：按申请确认的系统指南

> **No public field workbook / 未发现公开字段工作簿**  
> As of 2026-08-10, the reviewed official CHI catalogue describes SCM but does **not** link a public field-level XLSX workbook for it. This document is therefore **not a data dictionary**. It is a checklist for obtaining a request-, site-, period-, and extract-specific system guide from the data custodian.  
> 截至 2026-08-10，经核验的 CHI 官方目录虽介绍 SCM，但**没有链接公开的字段级 XLSX 工作簿**。因此，本文件**不是数据字典**，而是一份问题清单，用于向数据保管方索取针对本次申请、机构、时期和提取版本的系统指南。

SCM is a legacy clinical information source described in the Alberta catalogue. Its use and replacement by Connect Care occurred in a changing implementation environment. Do not infer a province-wide, uniform schema or a common coverage period from the product name alone.

SCM 是阿尔伯塔目录中介绍的历史临床信息来源，其使用范围以及被 Connect Care 替代的过程处于分阶段变化的实施环境中。不能仅凭产品名称推断它具有全省统一的数据结构或统一覆盖时段。

## What the custodian-specific guide must answer / 保管方指南必须回答的问题

| Concept / 概念 | Questions to resolve in writing / 需要书面确认的问题 |
|---|---|
| Person / 患者 | What is the person key? Is it stable across sites and episodes? What approved crosswalk links it to PHN/ULI or an encrypted research key? / 患者键是什么？是否跨机构与就诊段稳定？通过何种获批映射与 PHN、ULI 或加密研究键链接？ |
| Encounter / 就诊 | What creates an encounter row, and how are emergency, inpatient, ambulatory, pre-admit, cancelled, and merged encounters represented? / 什么事件形成一条就诊记录？急诊、住院、门诊、预入院、取消与合并就诊如何表示？ |
| Site and subsystem / 机构与子系统 | Which facilities, units, and SCM modules contribute to the extract, and during which exact dates? / 哪些机构、病区和 SCM 模块进入提取？各自精确起止日期是什么？ |
| Time / 时间 | Which timestamps represent occurrence, order, collection, result, verification, documentation, admission, and discharge? What time zone and daylight-saving rules apply? / 哪些时间戳分别代表发生、医嘱、采集、结果、审核、记录、入院和出院？采用何种时区与夏令时规则？ |
| Orders / 医嘱 | How are order concept, order set, status, priority, cancellation, discontinuation, and replacement encoded? / 医嘱概念、医嘱集、状态、优先级、取消、停用与替换如何编码？ |
| Results / 结果 | Which fields hold test identity, value, comparator, unit, reference range, abnormal flag, status, correction, and specimen? / 哪些字段保存检验标识、数值、比较符、单位、参考区间、异常标记、状态、更正与标本？ |
| Medication / 用药 | If in scope, does the extract contain medication orders, administrations, reconciliation, or another event type? How are dose, route, frequency, status, and late charting represented? / 如纳入用药，提取的是医嘱、给药、用药核对还是其他事件？剂量、途径、频率、状态和补录如何表示？ |
| Documents / 文档 | Which notes or documents are available? Are they structured values, metadata, text, or rendered files? Which signed, amended, deleted, or restricted versions are included? / 可提供哪些病历或文档？其形式是结构化值、元数据、文本还是渲染文件？包含哪些签署、更正、删除或受限版本？ |
| Provider and service / 提供者与服务 | Does a provider field mean author, ordering clinician, attending clinician, performer, verifier, or service owner? / 提供者字段代表作者、开单者、主诊者、执行者、审核者，还是服务归属？ |
| Provenance / 来源链 | What source table/field, interface, local code, transformation, migration mapping, extract version, and refresh date produced each delivered variable? / 每个交付变量来自何种源表/字段、接口、本地代码、转换、迁移映射、提取版本和刷新日期？ |
| Coverage / 覆盖 | What is the first and last reliable date by site, unit, module, and event type? How are transition and downtime periods handled? / 各机构、病区、模块和事件类型的首个与末个可靠日期是什么？转换期和停机期如何处理？ |
| Linkage / 链接 | Which approved keys connect SCM to DAD, NACRS, PLD, Registry, claims, Vital Statistics, or Connect Care, and at what grain? / 哪些获批键可将 SCM 与 DAD、NACRS、PLD、Registry、Claims、生命统计或 Connect Care 链接？链接粒度是什么？ |

These are concept groups, not asserted SCM table or field names. Exact names must come from the custodian's documentation for the delivered extract.

以上是概念组，并非声称 SCM 存在这些具体表名或字段名。精确名称必须来自数据保管方针对本次交付所提供的文档。

## Minimum request specification / 最低申请规范

- **Research grain / 研究粒度:** one row per person, encounter, order, result, administration, document, or another explicitly named event. / 明确一行对应个人、就诊、医嘱、结果、给药、文档或其他事件。
- **Cohort / 队列:** inclusion, exclusion, index event, look-back, follow-up, washout, and censoring. / 明确纳入、排除、索引事件、回溯、随访、洗脱和删失。
- **Coverage / 覆盖:** named sites/units/modules and exact calendar dates; request a gap/transition log. / 指定机构、病区、模块和精确日期，并申请缺口/转换日志。
- **Concepts / 概念:** list clinical concepts and acceptable code systems rather than guessing user-interface labels. / 列出临床概念与可接受代码体系，不猜测界面标签。
- **Multiplicity / 多值:** define how repeats, panels, components, duplicates, merges, amendments, cancellations, and corrected records should be delivered. / 定义重复、组合项目、组件、重复项、合并、更正、取消和修订记录的交付方式。
- **Time / 时间:** name the event time needed for every concept and how ties or implausible sequences will be handled. / 为每个概念指定所需事件时间，并规定并列或不合理时序的处理。
- **Provenance / 来源:** require source field, derivation, code list, missing-value meaning, refresh date, and extract version. / 要求提供源字段、派生逻辑、代码表、缺失值含义、刷新日期和提取版本。
- **Security and output / 安全与输出:** specify the approved environment, linkage method, date/geography precision, small-cell rules, and export restrictions. / 明确获批环境、链接方法、日期与地理精度、小单元格规则和导出限制。

## Do not assume / 不要默认

- Do not assume SCM still captures a requested event after a site's Connect Care transition. / 不要默认机构切换到 Connect Care 后 SCM 仍持续记录目标事件。
- Do not assume every site used the same modules, codes, interfaces, or start/end dates. / 不要默认所有机构使用相同模块、代码、接口或起止日期。
- Do not assume a label visible in the clinical user interface maps one-to-one to an extract field. / 不要默认临床界面中的标签与提取字段一一对应。
- Do not assume a result row is final, a medication row is an administration, or a note set is complete. / 不要默认结果行为最终结果、用药行为实际给药，或病历文档集完整。
- Do not infer current availability or refresh frequency from an older catalogue description. / 不要根据旧目录描述推断当前可用性或刷新频率。
- Do not combine SCM and Connect Care records without a documented transition, terminology, and duplicate-resolution plan. / 没有转换、术语和去重方案时，不要直接合并 SCM 与 Connect Care 记录。

## Sources and next step / 来源与下一步

- [CHI — AHS datasets catalogue / AHS 数据集目录](https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets)
- [Alberta Health Services — Requesting Data Resources](https://www.albertahealthservices.ca/research/Page16074.aspx)
- [AHS — Connect Care research resources landing page / Connect Care 研究资源入口](https://publicshare.albertahealthservices.ca/teams/HEI/ITAccess/SitePages/CC%20Research%20Resources.aspx)

Attach the questions above to the initial feasibility or data-access inquiry, then store the custodian-supplied guide with the project's controlled documentation—not in this public learning folder if it is request-confidential.

在可行性评估或数据访问初次咨询时附上以上问题。保管方提供的指南应保存在项目受控文档区；如属于申请保密材料，不应放入本公开学习目录。

**Status and link verification date / 状态与链接核验日期:** 2026-08-10.
