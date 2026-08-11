import type { LocalizedText } from "./deep-dives";

export const DICTIONARY_DATASET_IDS = [
  "dad",
  "nacrs",
  "claims",
  "pld",
  "pin",
  "vital",
  "registry",
  "scm",
  "connect-care",
] as const;

export type DictionaryDatasetId = (typeof DICTIONARY_DATASET_IDS)[number];
export type DictionaryStatus = "linked" | "partial" | "request";

export type DictionaryConcept = {
  title: LocalizedText;
  fields?: string;
  note: LocalizedText;
};

export type DictionaryGuide = {
  datasetId: DictionaryDatasetId;
  status: DictionaryStatus;
  officialFile?: string;
  officialUrl?: string;
  guideFile: string;
  workbook: LocalizedText;
  grain: LocalizedText;
  scope: LocalizedText;
  concepts: DictionaryConcept[];
  reading: LocalizedText[];
  cautions: LocalizedText[];
  requestUrl?: string;
};

const pair = (zh: string, en: string): LocalizedText => ({ zh, en });

export const dictionaryGuides: DictionaryGuide[] = [
  {
    datasetId: "dad",
    status: "linked",
    officialFile: "DAD_elements.xlsx",
    officialUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/DAD_elements.xlsx",
    guideFile: "dad.md",
    workbook: pair(
      "4 个工作表 · 58 行常用元素 · CCI 与 ICD 参考表",
      "4 worksheets · 58 commonly requested rows · CCI and ICD reference tabs",
    ),
    grain: pair(
      "一个报告机构的一次住院离院摘要",
      "One inpatient separation abstract from one reporting facility",
    ),
    scope: pair(
      "用于规划离院、诊断、干预、服务、住院时长和病例组合字段。",
      "Supports planning for separation, diagnosis, intervention, service, length-of-stay, and case-mix fields.",
    ),
    concepts: [
      {
        title: pair("记录与联结", "Record and linkage"),
        fields: "SEQNUM · ULI · PHN · CHARTNO",
        note: pair("先区分摘要键、患者键与院内病历号。", "Separate abstract, person-linkage, and local chart identifiers."),
      },
      {
        title: pair("入院、离院与转院", "Admission, discharge, and transfer"),
        fields: "ADMITDATE · DISDATE · DISP · INSTFROM · INSTTO",
        note: pair("连续转院可形成多条摘要。", "A continuous transfer journey can create several abstracts."),
      },
      {
        title: pair("诊断与诊断类型", "Diagnoses and diagnosis types"),
        fields: "DXCODE1–DXCODE25 · DXTYPE1–DXTYPE25",
        note: pair("代码位置与 diagnosis type 共同决定含义。", "Position and diagnosis type jointly determine interpretation."),
      },
      {
        title: pair("操作与资源", "Interventions and resources"),
        fields: "PROCCODE1–20 · ALL_DAYS · ACUTE_DAYS · CMG · RIW",
        note: pair("CCI、CMG 与 RIW 必须记录方法学版本。", "CCI, CMG, and RIW require documented methodology versions."),
      },
    ],
    reading: [
      pair("先把分析单位写成 patient、stay 还是 transfer-linked episode。", "State whether the analytic unit is a patient, stay, or transfer-linked episode."),
      pair("按研究年份冻结 ICD-10-CA、CCI 和 grouper 版本。", "Freeze ICD-10-CA, CCI, and grouper versions for the study period."),
      pair("逐项确认重复字段的最大位次与最终交付结构。", "Confirm repeating-field limits and the final delivered structure."),
    ],
    cautions: [
      pair("一条 DAD 摘要不等于一位患者。", "One DAD abstract is not one patient."),
      pair("Alberta 日间手术通常在 NACRS，而不是当前 DAD 队列。", "Alberta day surgery is generally reported through NACRS rather than the current DAD stream."),
      pair("公开工作簿是申请规划工具，不是当前 custodian 的最终规格。", "The public workbook is a request-planning aid, not the current custodian specification."),
    ],
  },
  {
    datasetId: "nacrs",
    status: "linked",
    officialFile: "NACRS_elements.xlsx",
    officialUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/NACRS_elements.xlsx",
    guideFile: "nacrs.md",
    workbook: pair(
      "2 个工作表 · 43 行常用元素",
      "2 worksheets · 43 commonly requested rows",
    ),
    grain: pair("一次可报告的门诊或急诊就诊摘要", "One reportable ambulatory-care encounter abstract"),
    scope: pair(
      "覆盖急诊、日间手术、紧急护理与部分门诊的核心行政和临床元素。",
      "Covers core administrative and clinical elements for ED, day surgery, urgent care, and selected ambulatory activity.",
    ),
    concepts: [
      {
        title: pair("记录、场景与提交", "Record, setting, and submission"),
        fields: "SEQNUM · ABSTRACT_TYPE · MIS_CODE · ED_VISIT_INDICATOR",
        note: pair("先识别真正急诊与其他门诊活动。", "First distinguish true ED encounters from other ambulatory activity."),
      },
      {
        title: pair("分诊与流程时间", "Triage and process timing"),
        fields: "TRIAGE_DATE/TIME · PIA_DATE/TIME · ED_DEPT_DATE/TIME",
        note: pair("到达、初评、决定去向和实际离开不是同一时间点。", "Arrival, first assessment, disposition decision, and physical departure are different events."),
      },
      {
        title: pair("诊断与操作", "Diagnoses and interventions"),
        fields: "DXCODE1–10 · PROCCODE1–10",
        note: pair("字段深度取决于提交层级与服务类型。", "Field depth depends on submission level and service type."),
      },
      {
        title: pair("离院与资源分组", "Disposition and resource grouping"),
        fields: "DISPOSITION · INSTTO · CACS_CODE · CACS_RIW",
        note: pair("转入住院后的完整过程通常需要联结 DAD。", "The full post-admission course usually requires DAD linkage."),
      },
    ],
    reading: [
      pair("先按急诊、日间手术和其他门诊分别界定队列。", "Define ED, day-surgery, and other ambulatory cohorts separately."),
      pair("为返诊研究明确使用登记、决定去向还是实际离开时间。", "Specify whether return-visit timing starts at registration, disposition decision, or physical departure."),
      pair("跨 2010 年分析时单独处理 AACRS/ACCS 与 NACRS。", "Handle AACRS/ACCS and NACRS separately in analyses spanning 2010."),
    ],
    cautions: [
      pair("急诊覆盖较高不代表专科门诊完整。", "Strong ED coverage does not imply complete specialty-clinic coverage."),
      pair("当前网页与旧工作簿对历史起点存在不同口径。", "The current catalogue and older workbook use different historical start points."),
      pair("时间戳缺失或顺序异常必须在 protocol 中预先处理。", "Missing or out-of-order timestamps require prespecified protocol rules."),
    ],
  },
  {
    datasetId: "claims",
    status: "linked",
    officialFile: "CLAIMS_Elements.xlsx",
    officialUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/CLAIMS_Elements.xlsx",
    guideFile: "claims.md",
    workbook: pair(
      "2 个工作表 · 22 行常用元素",
      "2 worksheets · 22 commonly requested rows",
    ),
    grain: pair("一项已申报并处理的计费服务", "One submitted and processed billed service"),
    scope: pair(
      "聚焦服务日期、计费服务、诊断、提供者、服务地点与付款字段。",
      "Focuses on service dates, billed services, diagnoses, providers, delivery settings, and payment fields.",
    ),
    concepts: [
      {
        title: pair("患者与时间", "Recipient and timing"),
        fields: "RCPT_ULI · SE_START_DATE · SE_END_DATE · FISC_YR",
        note: pair("服务日期与处理/付款日期不能混用。", "Service dates must not be confused with processing or payment dates."),
      },
      {
        title: pair("服务与诊断", "Service and diagnosis"),
        fields: "HLTH_SRVC_CCPX_CODE · HLTH_DX_ICD9X_CODE_1–3",
        note: pair("使用与服务日期相符的代码表版本。", "Use code-list versions aligned with the service date."),
      },
      {
        title: pair("提供者与场景", "Provider and setting"),
        fields: "DOCTOR_CLASS · PRVD_SKILL_TYPE_CLS · DELV_SITE_TYPE_CLS",
        note: pair("角色、技能与交付地点是不同概念。", "Provider role, skill, and delivery setting are distinct concepts."),
      },
      {
        title: pair("付款与替代支付", "Payment and alternate plans"),
        fields: "FRE_ACTUAL_PAID_AMT · PGM_APP_IND",
        note: pair("付款字段受 shadow billing 与计划规则影响。", "Payment fields are affected by shadow-billing and program rules."),
      },
    ],
    reading: [
      pair("先识别调整、冲销、重复申报和支付状态。", "Identify adjustments, reversals, duplicates, and payment status first."),
      pair("用服务期对应的 SOMB/服务代码表解释利用率。", "Interpret utilization with the SOMB/service code set in effect during service."),
      pair("聚合到 person-time 前保留原始 claim-line 粒度。", "Preserve claim-line grain before aggregating to person-time."),
    ],
    cautions: [
      pair("申报的服务不等于完整临床接触或疾病事实。", "A billed service is not a complete clinical encounter or disease truth."),
      pair("当前网页写约 4 个月滞后，旧工作簿写 6 个月或更长。", "The current catalogue says about four months; the older workbook says six months or longer."),
      pair("研究访问与 AHS 内部 QI 的申请路径不同。", "Research access and internal AHS QI follow different request routes."),
    ],
  },
  {
    datasetId: "pld",
    status: "linked",
    officialFile: "LAB_elements.xlsx",
    officialUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/LAB_elements.xlsx",
    guideFile: "pld.md",
    workbook: pair(
      "3 个工作表 · 14 行常用元素 · 10,872 行检验名称参考",
      "3 worksheets · 14 commonly requested rows · 10,872-row test-name reference",
    ),
    grain: pair("一次已验证的实验室检验结果", "One verified laboratory test result"),
    scope: pair(
      "说明患者键、医嘱/检验标识、结果、单位、参考范围、异常标记与验证时间。",
      "Documents person keys, order/test identifiers, results, units, reference ranges, abnormal flags, and verification time.",
    ),
    concepts: [
      {
        title: pair("患者与医嘱", "Person and order"),
        fields: "CLNT_ULI · CLNT_PHN · ORDR_TEST_CODE_CD/NM",
        note: pair("panel 医嘱与单项 test 结果需要区分。", "Panel orders and individual test results must be distinguished."),
      },
      {
        title: pair("检验标识", "Test identity"),
        fields: "TEST_CD · TEST_NM",
        note: pair("源系统名称并非天然可跨站点比较。", "Source-system names are not inherently comparable across sites."),
      },
      {
        title: pair("结果与单位", "Result and unit"),
        fields: "TEST_RSLT · TEST_UOFM · TEST_ABNRML_FLAG",
        note: pair("数值必须与单位和结果限定符一起解释。", "Values require units and result qualifiers for interpretation."),
      },
      {
        title: pair("参考范围与时间", "Reference range and timing"),
        fields: "TEST_REF_RNG · TEST_REF_RNG_NRML_LOW/HIGH · TEST_VRFY_DTTM",
        note: pair("参考范围可随年龄、记录性别、方法和系统变化。", "Reference ranges can vary by age, recorded sex, method, and system."),
      },
    ],
    reading: [
      pair("先建立测试代码、名称、单位与来源系统的版本化 crosswalk。", "Build a versioned crosswalk of test codes, names, units, and source systems first."),
      pair("保留文本结果、< 或 > 限定符，以及修正结果状态。", "Preserve text results, < or > qualifiers, and corrected-result status."),
      pair("明确使用采集、执行、验证还是入库时间作为分析锚点。", "Specify collection, performance, verification, or load time as the analytic anchor."),
    ],
    cautions: [
      pair("多个历史 LIS 的代码、单位和业务流程存在差异。", "Historical laboratory systems differ in codes, units, and workflows."),
      pair("裸数值不能跨方法或参考范围直接比较。", "Raw values cannot be compared directly across methods or reference ranges."),
      pair("point-of-care 检测和部分专门领域可能不完整。", "Point-of-care testing and some specialized domains may be incomplete."),
    ],
  },
  {
    datasetId: "pin",
    status: "linked",
    officialFile: "PIN_elements.xlsx",
    officialUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/PIN_elements.xlsx",
    guideFile: "pin.md",
    workbook: pair(
      "4 个工作表 · 11 行常用元素 · DIN 与 ATC 参考表",
      "4 worksheets · 11 commonly requested rows · DIN and ATC reference tabs",
    ),
    grain: pair("一次社区药房配药事件", "One community-pharmacy dispensing event"),
    scope: pair(
      "聚焦配药日期、取消状态、DIN/ATC、数量、单位、预计供应天数与患者联结。",
      "Focuses on dispense date, cancellation, DIN/ATC, quantity, unit, expected days supplied, and person linkage.",
    ),
    concepts: [
      {
        title: pair("患者与事件", "Person and event"),
        fields: "RCPT_ULI · RCPT_DOB · DSPN_DATE · DSPN_CANCEL_DATE",
        note: pair("先排除或正确标记被撤回的 fill。", "Exclude or correctly classify retracted fills first."),
      },
      {
        title: pair("药品标识", "Drug identity"),
        fields: "DRUG_DIN · SUPP_DRUG_ATC_CODE",
        note: pair("DIN 是产品标识，ATC 是治疗分类。", "DIN identifies a product; ATC is a therapeutic classification."),
      },
      {
        title: pair("数量与单位", "Quantity and unit"),
        fields: "DSPN_AMT_QTY · DSPN_AMT_UNT_MSR_CD",
        note: pair("数量本身不是剂量。", "Dispensed quantity alone is not dose."),
      },
      {
        title: pair("供应天数", "Days supplied"),
        fields: "DSPN_DAY_SUPPLY_QTY · DSPN_DAY_SUPPLY_UNT_MSR_CD",
        note: pair("预计覆盖天数不是实际服药天数。", "Expected coverage days are not observed medication-taking days."),
      },
    ],
    reading: [
      pair("冻结 DIN/ATC 清单、层级与代码表版本。", "Freeze DIN/ATC lists, hierarchy level, and code-set version."),
      pair("预先定义重叠 fill、stockpiling、宽限期和药物转换。", "Prespecify overlapping fills, stockpiling, grace periods, and switching."),
      pair("住院期空白需结合 DAD 判断机构供药。", "Interpret inpatient gaps with DAD because institutional supply may be absent."),
    ],
    cautions: [
      pair("配药不等于开方，也不等于服药。", "Dispensing is not prescribing and does not prove use."),
      pair("研究提取不自动包含完整临床 PIN 功能。", "A research extract does not automatically include the full clinical PIN feature set."),
      pair("当前 Alberta Health 资产说明 PIN Dispenses 不含财务信息。", "Alberta Health currently states that PIN Dispenses contains no financial information."),
    ],
  },
  {
    datasetId: "vital",
    status: "partial",
    officialFile: "VitalStatisticsDeath_elements.xlsx",
    officialUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/VitalStatisticsDeath_elements.xlsx",
    guideFile: "vital-statistics-death.md",
    workbook: pair(
      "2 个工作表 · 21 行常用元素 · 当前链接仅死亡登记",
      "2 worksheets · 21 commonly requested rows · current link covers Death Registry only",
    ),
    grain: pair("一次已登记的死亡事件", "One registered death event"),
    scope: pair(
      "当前公开工作簿说明死亡日期、地点、人口学、联结键、尸检与基础死因。",
      "The current public workbook documents death date, place, demographics, linkage keys, autopsy, and underlying cause.",
    ),
    concepts: [
      {
        title: pair("事件与登记", "Event and registration"),
        fields: "DR_ID · DETHDATE · YEAR · FISCAL_YR",
        note: pair("事件年、财政年与登记更新不能混用。", "Event year, fiscal year, and registration updates must not be conflated."),
      },
      {
        title: pair("患者联结", "Person linkage"),
        fields: "STKH_NUM_1–5 · BIRTH_DATE · SEX",
        note: pair("一个人可能有 primary 与 secondary ULI。", "A person may have primary and secondary ULIs."),
      },
      {
        title: pair("地点与情境", "Place and context"),
        fields: "PL_DETH · HOSP_ID · POSTCODE · PL_INJURY",
        note: pair("死亡地、居住地与受伤地是不同概念。", "Place of death, residence, and injury are different concepts."),
      },
      {
        title: pair("死因", "Cause of death"),
        fields: "U_CAUSE · AUTOPSY",
        note: pair("基础死因不等于所有 contributing causes。", "Underlying cause is not the same as all contributing causes."),
      },
    ],
    reading: [
      pair("把死亡事件日期与数据截止、登记滞后和修订状态同时记录。", "Record event date together with cutoff, registration lag, and revision status."),
      pair("为 ULI 联结成功率和多 ULI 处理设定规则。", "Define ULI linkage success and multiple-ULI handling."),
      pair("按使用年份记录死因 ICD 版本。", "Document the cause-of-death ICD version for each period."),
    ],
    cautions: [
      pair("公开链接不是出生与死胎登记的完整字典。", "The public link is not a complete birth and stillbirth dictionary."),
      pair("Vital Statistics 具有独立授权与小样本披露要求。", "Vital Statistics has separate authorization and small-cell disclosure requirements."),
      pair("工作簿说明的死因编码并非 ICD-10-CA。", "The workbook states that cause-of-death coding is not ICD-10-CA."),
    ],
  },
  {
    datasetId: "registry",
    status: "linked",
    officialFile: "Registry_elements.xlsx",
    officialUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/Registry_elements.xlsx",
    guideFile: "registry.md",
    workbook: pair(
      "2 个工作表 · 15 行常用元素",
      "2 worksheets · 15 commonly requested rows",
    ),
    grain: pair("工作簿描述的财政年末参保者快照", "A fiscal-year-end registrant snapshot as described by the workbook"),
    scope: pair(
      "说明年末参保、年龄组、迁入迁出、出生/死亡提示、地址地域与联结标识。",
      "Documents year-end coverage, age group, migration, birth/death indicators, geography, and linkage identifiers.",
    ),
    concepts: [
      {
        title: pair("联结与身份", "Linkage and identity"),
        fields: "ASN · PHN · BIRTH_DT · SEX",
        note: pair("申请时确认披露的是何种转换键。", "Confirm which transformed linkage key will be disclosed."),
      },
      {
        title: pair("年末资格", "Year-end eligibility"),
        fields: "ACTIVE_COVERAGE · FYE · PERS_REAP_END_DATE",
        note: pair("年末快照不等于全年连续资格。", "A year-end snapshot is not continuous eligibility throughout the year."),
      },
      {
        title: pair("人口变化", "Population change"),
        fields: "BIRTH_IND · DEATH_IND · IN_MIGRATION_IND · OUT_MIGRATION_IND",
        note: pair("迁入迁出和报告延迟会改变分母。", "Migration and reporting delays alter denominators."),
      },
      {
        title: pair("地理与分层", "Geography and stratification"),
        fields: "POSTAL_CD · RHA · AGE_GRP_CD",
        note: pair("邮寄地址可能不是实际居住地。", "Mailing address may not be actual residence."),
      },
    ],
    reading: [
      pair("先确认交付结构是年末快照还是资格区间。", "First confirm whether delivery is a year-end snapshot or eligibility interval."),
      pair("定义连续资格、允许缺口和迁移的 person-time 规则。", "Define continuous coverage, allowable gaps, migration, and person-time rules."),
      pair("让地理字段与相应年度的边界版本匹配。", "Align geography fields with boundary versions from the same period."),
    ],
    cautions: [
      pair("AHCIP 登记人口不是人口普查。", "The AHCIP registry is not a census."),
      pair("当前网页写约 1 年滞后，旧工作簿写约 6 个月。", "The current catalogue says about one year; the older workbook says about six months."),
      pair("ALT_PREM_ARRANGEMENT 在 2009 年后质量下降。", "The workbook warns that ALT_PREM_ARRANGEMENT quality declined after 2009."),
    ],
  },
  {
    datasetId: "scm",
    status: "request",
    guideFile: "scm.md",
    workbook: pair("CHI 当前未链接公开字段工作簿", "CHI currently links no public field workbook"),
    grain: pair("依模块而定：就诊、医嘱、结果、用药或文书", "Module-specific: encounter, order, result, medication, or note"),
    scope: pair(
      "这是历史系统概念指南；实际表、字段、站点与截止日期必须在项目申请中确认。",
      "This is a historical-system concept guide; actual tables, fields, sites, and cutoff dates require project-specific confirmation.",
    ),
    concepts: [
      {
        title: pair("患者与就诊", "Person and encounter"),
        note: pair("索取 patient、encounter、ADT 与站点键的映射。", "Request the mapping of patient, encounter, ADT, and site keys."),
      },
      {
        title: pair("医嘱与结果", "Orders and results"),
        note: pair("明确订单、标本、结果与修订状态的关系。", "Clarify relationships among orders, specimens, results, and revisions."),
      },
      {
        title: pair("文书与用药", "Documentation and medication"),
        note: pair("模块、文本范围和时间戳语义需逐项申请。", "Modules, text scope, and timestamp semantics must be requested explicitly."),
      },
      {
        title: pair("迁移与截止", "Migration and cutoff"),
        note: pair("记录每个 Calgary 站点迁往 Connect Care 的时间。", "Record each Calgary site's migration date to Connect Care."),
      },
    ],
    reading: [
      pair("把所需模块、实体、站点、年份和输出粒度写入数据规格。", "Specify modules, entities, sites, years, and output grain in the data request."),
      pair("要求当前字段清单、实体关系图与值集版本。", "Request the current field list, entity relationships, and value-set versions."),
      pair("用重叠期验证 SCM 到 Connect Care 的迁移映射。", "Validate SCM-to-Connect Care mappings during overlap periods."),
    ],
    cautions: [
      pair("历史数据可访问不代表系统仍持续新增。", "Historical availability does not imply ongoing capture."),
      pair("不同模块没有单一统一记录粒度。", "Different modules do not share one universal record grain."),
      pair("不要把 CHI 的旧“current / daily”表述当作 2026 实时状态。", "Do not treat CHI's older current/daily wording as a 2026 real-time status."),
    ],
    requestUrl: "https://www.albertahealthservices.ca/research/Page16074.aspx",
  },
  {
    datasetId: "connect-care",
    status: "request",
    guideFile: "connect-care.md",
    workbook: pair("CHI 当前未链接公开研究字段工作簿", "CHI currently links no public research field workbook"),
    grain: pair("依数据域而定：就诊内事件、医嘱、结果、MAR、flowsheet 或文书", "Domain-specific: encounter event, order, result, MAR, flowsheet row, or note"),
    scope: pair(
      "这是申请型系统指南；项目必须确认 Epic/Cogito 来源、表、字段、值集和提取刷新规则。",
      "This is an application-oriented system guide; projects must confirm Epic/Cogito sources, tables, fields, value sets, and extract-refresh rules.",
    ),
    concepts: [
      {
        title: pair("患者、就诊与 ADT", "Person, encounter, and ADT"),
        note: pair("保留 encounter context 与转科/转床时间线。", "Preserve encounter context and transfer timelines."),
      },
      {
        title: pair("医嘱、结果与操作", "Orders, results, and procedures"),
        note: pair("区分 ordered、performed、resulted 与 verified 时间。", "Distinguish ordered, performed, resulted, and verified times."),
      },
      {
        title: pair("药物与 MAR", "Medication and MAR"),
        note: pair("处方、配药、给药和停药是不同事件。", "Ordering, dispensing, administration, and discontinuation are different events."),
      },
      {
        title: pair("文书、flowsheet 与来源", "Notes, flowsheets, and provenance"),
        note: pair("记录模板、copy-forward 和配置版本。", "Document templates, copy-forward, and configuration versions."),
      },
    ],
    reading: [
      pair("按站点 go-live 日期建立可观察性矩阵。", "Build an observability matrix by site go-live date."),
      pair("逐个数据域定义行粒度、主键、时间戳与状态字段。", "Define row grain, keys, timestamps, and statuses for each domain."),
      pair("确认使用的 Epic/Cogito 层和项目专用提取逻辑。", "Confirm the Epic/Cogito layer and project-specific extraction logic."),
    ],
    cautions: [
      pair("2019–2024 分波次上线会造成站点与时间覆盖偏差。", "The 2019–2024 phased rollout creates site and time-coverage bias."),
      pair("源系统每日刷新不等于研究数据可当天交付。", "Daily source refresh does not mean same-day research-data delivery."),
      pair("工作流与本地配置变化会改变记录生成方式。", "Workflow and local configuration changes alter how records are generated."),
    ],
    requestUrl: "https://www.albertahealthservices.ca/research/Page16074.aspx",
  },
];
