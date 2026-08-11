# Alberta health data dictionaries / 阿尔伯塔省健康数据字典索引

This folder is a bilingual, research-planning index for the nine datasets introduced on the learning site. It separates public field workbooks from systems for which field-level documentation must be supplied or confirmed as part of a data request.

本目录是学习网站所介绍 9 类数据的双语研究规划索引。它区分了“已有公开字段工作簿”的数据集，以及“必须在数据申请中由数据保管方提供或确认字段级文档”的系统。

> **Scope / 使用边界**  
> These notes help learners ask better questions; they are not current custodian-approved specifications, legal advice, or authorization to access data. The approved request, data-sharing agreement, extraction specification, and disclosure rules always control the actual project.  
> 本资料用于帮助学习者提出更准确的问题；它不是数据保管方当前批准的数据规范、法律意见或数据访问授权。实际项目一律以获批申请、数据共享协议、提取规范和披露规则为准。

## Status of the nine resources / 9 项资料状态

| Dataset / 数据集 | Status / 状态 | Public planning file / 公开规划文件 | Practical interpretation / 实务解读 |
|---|---|---|---|
| Discharge Abstract Database (DAD) / 住院出院摘要数据库 | Public CHI-linked workbook / 有 CHI 公开链接工作簿 | [DAD_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/DAD_elements.xlsx) · [Guide / 指南](./dad.md) | Use for field discovery; confirm the current submission/extract specification for the requested years. / 可用于发现字段；申请时仍须确认目标年份的现行提交与提取规范。 |
| National Ambulatory Care Reporting System (NACRS) / 全国门诊医疗报告系统 | Public CHI-linked workbook / 有 CHI 公开链接工作簿 | [NACRS_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/NACRS_elements.xlsx) · [Guide / 指南](./nacrs.md) | Coverage, reporting level, site participation, and coding can vary by place and time. / 覆盖范围、报告层级、机构参与和编码可能随地点与时间变化。 |
| Practitioner Claims / 医师服务申报 | Public CHI-linked workbook / 有 CHI 公开链接工作簿 | [CLAIMS_Elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/CLAIMS_Elements.xlsx) · [Guide / 指南](./claims.md) | A billed service is not automatically a complete clinical encounter; define service, provider, and payment logic. / 一条收费申报不必然等于完整临床就诊；应明确服务、提供者与支付逻辑。 |
| Provincial Laboratory Data (PLD) / 省级实验室数据 | Public CHI-linked workbook / 有 CHI 公开链接工作簿 | [LAB_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/LAB_elements.xlsx) · [Guide / 指南](./pld.md) | Confirm test dictionaries, units, reference ranges, result status, and coverage by laboratory and period. / 须确认检验项目字典、单位、参考区间、结果状态及实验室—时间覆盖。 |
| Pharmaceutical Information Network (PIN) / 药品信息网络 | Public CHI-linked workbook / 有 CHI 公开链接工作簿 | [PIN_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/PIN_elements.xlsx) · [Guide / 指南](./pin.md) | Distinguish dispense events from prescriptions, medication orders, and actual use. / 应区分配药事件、处方、用药医嘱与实际服药。 |
| Vital Statistics / 生命统计 | **Partial public workbook / 部分公开** | [VitalStatisticsDeath_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/VitalStatisticsDeath_elements.xlsx) · [Guide / 指南](./vital-statistics-death.md) | The linked workbook is for the Death Registry only; birth and stillbirth work requires a separately confirmed current specification. / 链接工作簿仅对应死亡登记；出生与死胎研究须另行确认现行规范。 |
| Alberta Health Care Insurance Plan Registry / 阿尔伯塔医疗保险登记库 | Public CHI-linked workbook + local guide / 有 CHI 公开链接工作簿及本地指南 | [Registry_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/Registry_elements.xlsx) · [Guide / 指南](./registry.md) | Fiscal-year-end eligibility snapshots are useful for denominators and linkage, but are not a census. / 财年末参保快照适合构建分母与链接，但不等同于人口普查。 |
| Sunrise Clinical Manager (SCM) / Sunrise 临床管理系统 | **No public field workbook linked / 未链接公开字段工作簿** | [Request-specific guide / 按申请确认指南](./scm.md) | Obtain a system, site, period, and extract-specific field guide from the custodian. / 应向保管方索取针对系统、机构、时期和提取版本的字段指南。 |
| Connect Care (Epic) / Connect Care（Epic） | **No public field workbook linked / 未链接公开字段工作簿** | [Request-specific guide / 按申请确认指南](./connect-care.md) | Treat field names, coverage, provenance, and refresh as extract-specific until confirmed. / 在确认前，应将字段名、覆盖、来源和刷新周期视为特定于本次提取。 |

The table above contains the **seven official direct workbook links** currently used by this project: DAD, NACRS, Claims, PLD, PIN, Vital Statistics Death, and Registry.

上表列出了本项目当前使用的 **7 个官方工作簿直链**：DAD、NACRS、Claims、PLD、PIN、Vital Statistics Death 和 Registry。

## How to resolve page–workbook conflicts / 如何处理网页与工作簿冲突

Catalogue pages and downloadable workbooks can be updated on different schedules. They may disagree about availability dates, refresh cadence, historical start dates, scope, or wording. A webpage description is also not evidence that a field-level dictionary is public.

目录网页与可下载工作簿的更新节奏可能不同，因此在可用时间、刷新周期、历史起始年份、范围或措辞上可能不一致。网页中介绍某个系统，也不代表其字段级字典已经公开。

Use this three-level rule / 建议采用三级判断：

1. **Catalogue page / 目录网页** — use it to discover the resource and understand broad context. / 用于发现资料和理解总体背景。
2. **Linked workbook / 链接工作簿** — use it to plan variables and questions, while recording its version and access date. / 用于规划变量与问题，并记录版本和访问日期。
3. **Current custodian-approved specification / 保管方批准的现行规范** — use this as the final authority for cohort construction, extraction, linkage, interpretation, and disclosure. / 这是队列构建、提取、链接、解释和披露的最终依据。

Examples that deserve an explicit check include NACRS coverage and reporting level by year/site; DAD versus NACRS treatment of day surgery or ambulatory activity; a Vital Statistics webpage that discusses several event types while the linked workbook covers deaths only; and SCM or Connect Care system descriptions that do not supply a field dictionary.

需要明确核实的例子包括：NACRS 按年份和机构的覆盖与报告层级；日间手术或门诊活动究竟落在 DAD 还是 NACRS；生命统计网页介绍多种事件但链接工作簿仅覆盖死亡；以及 SCM 或 Connect Care 的系统介绍并未提供字段字典。

When a page and workbook conflict, do not silently choose one. Record both statements in the analysis plan and ask the data custodian to resolve the discrepancy for the requested extract.

若网页与工作簿冲突，不应默默任选其一。应在分析计划中同时记录两种说法，并请数据保管方针对本次提取作出确认。

## Permission and reuse / 许可与复用

- Do **not** mirror, re-host, commit, or redistribute the original XLSX files in this repository. Link to the publisher-hosted originals instead. / **不要**在本仓库镜像、重新托管、提交或再分发原始 XLSX；请链接发布方托管的原文件。
- Retain source attribution and follow the publisher's terms, permissions, privacy requirements, and any data-sharing agreement. A public download is not a blanket licence for every form of reuse. / 保留来源署名，并遵守发布方条款、许可、隐私要求及数据共享协议。可以公开下载并不等于获得所有形式的复用许可。
- The Markdown files in this folder are original explanatory notes. They neither reproduce the workbooks nor replace the source documentation. / 本目录中的 Markdown 是原创解读，不复制工作簿内容，也不替代源文档。
- Never place row-level health data, personal identifiers, small-cell outputs, credentials, or request-confidential specifications in this folder. / 切勿在本目录放置行级健康数据、个人标识符、小单元格结果、凭据或申请保密规范。

## Official starting points / 官方入口

- [University of Calgary Centre for Health Informatics — AHS datasets](https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets)
- [Alberta Health Services — Requesting Data Resources](https://www.albertahealthservices.ca/research/Page16074.aspx)
- [Government of Alberta — Health research and data access](https://www.alberta.ca/health-research)

**Link and content verification date / 链接与内容核验日期:** 2026-08-10. Links and upstream documents can change; re-check them before every new request. / 链接和上游文档可能变化；每次新申请前请重新核验。

The machine-readable [`source-manifest.json`](./source-manifest.json) records the official URLs, observed file sizes, SHA-256 hashes, and workbook modified dates used in this review. It is provenance metadata, not a copy of the workbooks. / 机器可读的 [`source-manifest.json`](./source-manifest.json) 记录本次核验使用的官方链接、观测文件大小、SHA-256 校验值及工作簿修改日期；它是来源元数据，并非工作簿副本。
