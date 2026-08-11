export type LocalizedText = {
  zh: string;
  en: string;
};

export type DeepDiveExample = {
  title: LocalizedText;
  question: LocalizedText;
  design: Array<{
    label: LocalizedText;
    value: LocalizedText;
  }>;
  takeaway: LocalizedText;
};

export type DeepDive = {
  id: "dad" | "nacrs" | "pin";
  acronym: string;
  name: LocalizedText;
  context: LocalizedText;
  intro: LocalizedText;
  facts: Array<{
    label: LocalizedText;
    value: LocalizedText;
  }>;
  trace: LocalizedText[];
  fieldGroups: Array<{
    title: LocalizedText;
    fields: string;
    description: LocalizedText;
  }>;
  captures: LocalizedText[];
  blindSpots: LocalizedText[];
  sample: Array<{
    field: string;
    value: LocalizedText;
    meaning: LocalizedText;
  }>;
  examples: DeepDiveExample[];
  pitfalls: LocalizedText[];
  sources: Array<{
    label: LocalizedText;
    url: string;
  }>;
};

const pair = (zh: string, en: string): LocalizedText => ({ zh, en });

export const deepDives: DeepDive[] = [
  {
    id: "dad",
    acronym: "DAD",
    name: pair("出院摘要数据库", "Discharge Abstract Database"),
    context: pair("急性住院离院", "Acute inpatient separations"),
    intro: pair(
      "DAD 把一次住院结束时形成的出院摘要组织成可分析记录，包含人口学、入院、诊断、干预、服务、资源利用与出院转归。它特别适合研究住院事件、手术、住院时长、转院和再入院，但并不是逐分钟病历。在 Alberta，日间手术通常通过 NACRS 报告；具体提取口径需确认。",
      "DAD turns the discharge abstract created at the end of a hospital stay into an analyzable record. It brings together demographic, admission, diagnosis, intervention, service, resource-use, and discharge information. It is especially useful for hospital events, procedures, length of stay, transfers, and readmissions—but it is not a minute-by-minute clinical chart. In Alberta, day surgery is generally reported through NACRS; confirm the project-specific extract.",
    ),
    facts: [
      {
        label: pair("一条记录", "One record"),
        value: pair(
          "一个报告机构的一次住院离院摘要",
          "One inpatient separation from a reporting facility",
        ),
      },
      {
        label: pair("Alberta 目录范围", "Alberta catalogue range"),
        value: pair("2002-04—当前；正式申请前确认", "Apr 2002–present; confirm before requesting"),
      },
      {
        label: pair("常用分类", "Core classifications"),
        value: pair("ICD-10-CA 诊断 · CCI 干预", "ICD-10-CA diagnoses · CCI interventions"),
      },
      {
        label: pair("最常回答", "Best suited to"),
        value: pair("住院、手术、资源利用与出院结局", "Admissions, procedures, resource use, and discharge outcomes"),
      },
    ],
    trace: [
      pair("入院与来源", "Admission and origin"),
      pair("诊断与干预", "Diagnoses and interventions"),
      pair("服务与资源使用", "Services and resource use"),
      pair("出院、转院或死亡", "Discharge, transfer, or death"),
    ],
    fieldGroups: [
      {
        title: pair("身份、人口与地理", "Identity, demographics, and geography"),
        fields: "ULI / PHN · AGE_ADMIT · SEX · POSTCODE · RCPT_ZONE",
        description: pair(
          "用于获批联结、年龄分层、性别 / 性别记录与居住地分析；直接标识符通常会在披露时删除、替换或扰码。",
          "Supports approved linkage and stratification by age, recorded sex/gender, and residence. Direct identifiers are normally removed, substituted, or scrambled for disclosure.",
        ),
      },
      {
        title: pair("入院时间与入口", "Admission timing and entry"),
        fields: "ADMITDATE · ADMITTIME · ADMITCAT · ENTRYCODE · ADMITBYAMB",
        description: pair(
          "描述何时正式住院、入院类别、最后入口以及是否由救护车到达。",
          "Describes when the inpatient stay officially began, admission category, point of entry, and ambulance arrival.",
        ),
      },
      {
        title: pair("出院与转归", "Discharge and destination"),
        fields: "DISDATE · DISTIME · DISP · INSTFROM · INSTTO",
        description: pair(
          "用于界定索引出院日、出院状态和机构间转移；连续转院可能产生多条摘要。",
          "Defines the index discharge date, discharge status, and inter-facility transfers. A continuous transfer episode may create several abstracts.",
        ),
      },
      {
        title: pair("诊断", "Diagnoses"),
        fields: "DXCODE1–DXCODE25 · DXTYPE1–DXTYPE25",
        description: pair(
          "最多多次出现的 ICD-10-CA 诊断及诊断类型；病例定义不能只看“是否出现代码”，还要考虑位置和类型。",
          "Repeated ICD-10-CA diagnosis codes and diagnosis types. A case definition should consider position and type—not merely whether a code appears.",
        ),
      },
      {
        title: pair("干预与手术", "Interventions and procedures"),
        fields: "PROCCODE1–PROCCODE20",
        description: pair(
          "用 CCI 代码描述住院期间实施的干预，可用于定义手术队列或比较不同操作路径。",
          "Uses CCI codes to describe interventions during the stay, supporting procedure cohorts and comparisons of care pathways.",
        ),
      },
      {
        title: pair("服务与提供者角色", "Services and provider roles"),
        fields: "MPSERV · DOCSVC1–8 · DOCTYPE1–8",
        description: pair(
          "描述主要患者服务、提供者类型与相关服务；它们是角色和服务分类，不是完整临床团队记录。",
          "Describes the main patient service, provider types, and services. These are role and service classifications—not a full care-team record.",
        ),
      },
      {
        title: pair("住院时长与重症照护", "Length of stay and special care"),
        fields: "ALL_DAYS · ACUTE_DAYS · ICU_HOURS · CCU_HOURS · SCUHOURS",
        description: pair(
          "支持住院时长、急性照护天数和 ICU / 特殊照护资源使用分析；先确认派生逻辑与缺失规则。",
          "Supports analysis of total and acute length of stay plus ICU or special-care use. Confirm derivation and missing-value rules first.",
        ),
      },
      {
        title: pair("病例组合与资源强度", "Case mix and resource intensity"),
        fields: "CMG · MCC · RIW · COMORB_LVL",
        description: pair(
          "CIHI 分组与资源权重适合风险描述和资源比较，但版本变化会影响跨年度可比性。",
          "CIHI grouping and resource-weight measures support case-mix and utilization comparisons, but version changes affect comparability over time.",
        ),
      },
    ],
    captures: [
      pair("急性住院的离院摘要", "Acute inpatient separation abstracts"),
      pair("住院期间记录的诊断、干预和主要服务", "Diagnoses, interventions, and major services documented during the stay"),
      pair("入院、出院、转院和住院时长", "Admission, discharge, transfer, and length-of-stay information"),
      pair("出院时死亡等住院内转归", "In-hospital outcomes such as death at discharge"),
    ],
    blindSpots: [
      pair("逐分钟生命体征、完整检验轨迹或临床文书", "Minute-by-minute vital signs, full lab trajectories, or clinical notes"),
      pair("患者出院后是否领取或服用药物", "Whether medication was dispensed or taken after discharge"),
      pair("Alberta 日间手术、未住院急诊与其他门诊；通常在 NACRS", "Alberta day surgery, non-admitted ED care, and other ambulatory activity; generally in NACRS"),
      pair("仅凭代码无法确定的疾病严重度与因果关系", "Severity and causality that cannot be established from codes alone"),
      pair("患者级实际费用；RIW 是相对资源强度，不是账单", "Actual patient-level cost; RIW is relative resource intensity, not a bill"),
    ],
    sample: [
      {
        field: "ADMITDATE",
        value: pair("2025-04-12", "2025-04-12"),
        meaning: pair("正式入院日", "Official admission date"),
      },
      {
        field: "DISDATE",
        value: pair("2025-04-16", "2025-04-16"),
        meaning: pair("索引出院日", "Index discharge date"),
      },
      {
        field: "DXCODE / DXTYPE",
        value: pair("I50.- / 主要诊断（示意）", "I50.- / main diagnosis (illustrative)"),
        meaning: pair("心力衰竭代码族及其角色", "Heart-failure code family and its role"),
      },
      {
        field: "DISP",
        value: pair("回家（示意）", "Home (illustrative)"),
        meaning: pair("出院转归", "Discharge disposition"),
      },
      {
        field: "ALL_DAYS",
        value: pair("4 天", "4 days"),
        meaning: pair("派生总住院时长", "Derived total length of stay"),
      },
    ],
    examples: [
      {
        title: pair("案例 A · 30 天再入院", "Example A · 30-day readmission"),
        question: pair(
          "心衰住院活着出院后，30 天内发生非计划再住院的比例是多少？",
          "What proportion of patients discharged alive after a heart-failure admission have an unplanned readmission within 30 days?",
        ),
        design: [
          {
            label: pair("队列", "Cohort"),
            value: pair("用已验证的 ICD-10-CA 算法识别成人心衰住院，并确认活着出院。", "Identify adult heart-failure admissions using a validated ICD-10-CA algorithm and require live discharge."),
          },
          {
            label: pair("索引", "Index"),
            value: pair("每位患者符合规则的出院日；先把同一转院链合并为一个照护事件。", "The qualifying discharge date for each patient, after consolidating a continuous transfer chain into one episode."),
          },
          {
            label: pair("结局", "Outcome"),
            value: pair("第 1—30 天内下一次符合定义的 DAD 入院。", "The next qualifying DAD admission on days 1–30."),
          },
          {
            label: pair("联结", "Linkage"),
            value: pair("Registry 判断资格；Vital Statistics 处理随访期死亡；NACRS 可补充仅急诊返诊。", "Use the Registry for eligibility, Vital Statistics for deaths, and NACRS for ED returns that do not become admissions."),
          },
        ],
        takeaway: pair(
          "关键不是简单寻找下一条 DAD 记录，而是先界定转院、计划入院、死亡竞争风险和每人的索引规则。",
          "The key is not merely finding the next DAD record; it is defining transfers, planned admissions, competing death, and the per-person index rule.",
        ),
      },
      {
        title: pair("案例 B · 髋关节置换后的资源使用", "Example B · Resource use after hip replacement"),
        question: pair(
          "不同医院的择期髋关节置换住院时长与 30 天急性照护再使用是否不同？",
          "Do length of stay and 30-day acute-care reuse after elective hip replacement differ across hospitals?",
        ),
        design: [
          {
            label: pair("队列", "Cohort"),
            value: pair("用 CCI 操作代码、入院类别和年龄规则定义择期手术。", "Define elective procedures using CCI intervention codes, admission category, and age criteria."),
          },
          {
            label: pair("暴露", "Exposure"),
            value: pair("实施手术的机构或区域；报告时遵守机构和小样本披露规则。", "Treating facility or zone, subject to facility and small-cell disclosure rules."),
          },
          {
            label: pair("结局", "Outcomes"),
            value: pair("ALL_DAYS / ACUTE_DAYS、院内转归，以及 30 天 DAD 再住院或 NACRS 急诊。", "ALL_DAYS or ACUTE_DAYS, in-hospital disposition, and 30-day DAD readmission or NACRS ED visit."),
          },
          {
            label: pair("调整", "Adjustment"),
            value: pair("年龄、诊断类型、共病、转院与病例组合版本。", "Age, diagnosis type, comorbidity, transfers, and case-mix methodology version."),
          },
        ],
        takeaway: pair(
          "机构差异可能来自病例组合、转院和编码实践；观察性差异不能直接解释为质量因果效应。",
          "Facility differences may reflect case mix, transfers, and coding practice; an observed difference is not automatically a causal quality effect.",
        ),
      },
    ],
    pitfalls: [
      pair("把一条出院摘要当成一位患者；同一人会有多次住院。", "Treating one abstract as one person; the same person can have many admissions."),
      pair("只搜索诊断代码而忽略诊断类型、位置和经过验证的病例算法。", "Searching diagnosis codes without considering diagnosis type, position, and a validated case algorithm."),
      pair("把机构间转院误算成再入院，或把同一照护链拆成多个独立事件。", "Counting an inter-facility transfer as a readmission or splitting one episode into independent events."),
      pair("混用入院年度、出院年度与财政年度，造成观察窗错位。", "Mixing admission year, discharge year, and fiscal year and misaligning observation windows."),
      pair("跨年份使用 CMG、RIW、ICD 或 CCI，却未记录版本与字段规则变化。", "Comparing CMG, RIW, ICD, or CCI across years without recording version and field-rule changes."),
    ],
    sources: [
      {
        label: pair("UCalgary CHI · DAD 数据字典", "UCalgary CHI · DAD data dictionary"),
        url: "https://cumming.ucalgary.ca/sites/default/files/teams/30/DAD_elements.xlsx",
      },
      {
        label: pair("CIHI · DAD 元数据", "CIHI · DAD metadata"),
        url: "https://www.cihi.ca/en/discharge-abstract-database-dad-metadata",
      },
      {
        label: pair("CIHI · 2026–2027 DAD 数据元素", "CIHI · 2026–2027 DAD data elements"),
        url: "https://www.cihi.ca/sites/default/files/document/dad-data-elements-2026-2027-en.pdf",
      },
      {
        label: pair("CIHI · 2024–2025 DAD 数据质量", "CIHI · 2024–2025 DAD data quality"),
        url: "https://www.cihi.ca/sites/default/files/document/dad-data-quality-closed-year-information-2024-2025-report-en.pdf",
      },
      {
        label: pair("Government of Alberta · Health data access", "Government of Alberta · Health data access"),
        url: "https://www.alberta.ca/health-research",
      },
    ],
  },
  {
    id: "nacrs",
    acronym: "NACRS",
    name: pair("国家门诊护理报告系统", "National Ambulatory Care Reporting System"),
    context: pair("急诊、日间手术与部分门诊", "Emergency, day surgery, and selected ambulatory care"),
    intro: pair(
      "NACRS 记录一次医院或社区门诊接触，Alberta 最稳定的研究用途通常是急诊和日间手术。它能连接到达、分诊、首次医师评估、诊断、干预与离院转归，适合研究急诊流量、等待、返诊和转入住院。不同场景、站点、年份和提交层级的完整性需要分别核对。",
      "NACRS records one hospital- or community-based ambulatory encounter. In Alberta, its most stable research uses are generally ED and day-surgery activity. It can connect arrival, triage, physician initial assessment, diagnoses, interventions, and visit disposition, making it useful for ED flow, waits, revisits, and admission. Completeness must be checked separately by care setting, site, year, and submission level.",
    ),
    facts: [
      {
        label: pair("一条记录", "One record"),
        value: pair("一次急诊、日间手术或其他门诊就诊", "One ED, day-surgery, or other ambulatory visit"),
      },
      {
        label: pair("Alberta 目录范围", "Alberta catalogue range"),
        value: pair("历史约从 2002；2010 起 NACRS 格式", "Historical data from ~2002; NACRS format from 2010"),
      },
      {
        label: pair("常用分类", "Core classifications"),
        value: pair("ICD-10-CA · CCI · CED-DxS / EDVS", "ICD-10-CA · CCI · CED-DxS / EDVS"),
      },
      {
        label: pair("最常回答", "Best suited to"),
        value: pair("急诊流程、等待、返诊与转归", "ED flow, waiting, revisits, and disposition"),
      },
    ],
    trace: [
      pair("登记与到达", "Registration and arrival"),
      pair("分诊与首次评估", "Triage and first assessment"),
      pair("诊断与干预", "Diagnoses and interventions"),
      pair("离院、转院或住院", "Discharge, transfer, or admission"),
    ],
    fieldGroups: [
      {
        title: pair("就诊类型与接触方式", "Visit type and mode"),
        fields: "ABSTRACT_TYPE · Submission Level · VISIT_MODE · ED_VISIT_INDICATOR · MIS_CODE",
        description: pair(
          "区分急诊、日间手术、诊所、安排就诊与接触方式；混合场景前必须先分层。",
          "Distinguishes ED, day surgery, clinic, scheduled/arranged activity, and contact mode. Separate care settings before combining them.",
        ),
      },
      {
        title: pair("登记与离院时间", "Registration and departure timing"),
        fields: "VISIT_DATE · VISIT_TIME · ED_DEPT_DATE · ED_DEPT_TIME",
        description: pair(
          "形成急诊总停留时间和跨午夜事件的基础；时间缺失或顺序异常需要质量规则。",
          "Forms the basis for total ED length of stay and encounters crossing midnight. Missing or out-of-order timestamps require quality rules.",
        ),
      },
      {
        title: pair("分诊", "Triage"),
        fields: "TRIAGECODE · TRIAGE_DATE · TRIAGE_TIME",
        description: pair(
          "记录分诊级别与时间，可用于病例组合和等待分析；临床严重度不能只靠单一分诊代码。",
          "Records triage level and timing for case mix and wait analyses. Clinical severity should not be inferred from a single triage code alone.",
        ),
      },
      {
        title: pair("首次医师评估", "Physician initial assessment"),
        fields: "PIA_DATE · PIA_TIME",
        description: pair(
          "可与登记或分诊时间组合生成到医师评估的等待指标，但需明确起点和缺失处理。",
          "Can be combined with registration or triage time to measure time to physician assessment, provided the start point and missingness rules are explicit.",
        ),
      },
      {
        title: pair("诊断与主诉", "Diagnoses and presenting complaint"),
        fields: "DXCODE1–DXCODE10 · Presenting Complaint · ED Discharge Diagnosis",
        description: pair(
          "包括 ICD-10-CA 问题代码及 CIHI 急诊 pick-lists；主诉、离院诊断和最终住院诊断不是同一个概念。",
          "Includes ICD-10-CA problem codes and CIHI ED pick-lists. Presenting complaint, ED discharge diagnosis, and final inpatient diagnosis are different concepts.",
        ),
      },
      {
        title: pair("干预与服务", "Interventions and services"),
        fields: "PROCCODE1–10 · PROVIDER_TYPE1–8 · PROVIDER_SVC1–8",
        description: pair(
          "描述就诊中记录的干预与服务角色；不同提交层级可能影响可用细节。",
          "Describes recorded interventions and provider/service roles. The submission level can affect the amount of detail available.",
        ),
      },
      {
        title: pair("转归与机构流向", "Disposition and facility flow"),
        fields: "DISPOSITION · DISP_DATE · DISP_TIME · INSTFROM · INSTTO",
        description: pair(
          "用于区分回家、转院、离开未完成照护或转入住院，并构建照护链。",
          "Distinguishes discharge home, transfer, incomplete care, or admission and supports construction of a care episode.",
        ),
      },
      {
        title: pair("停留时间与病例组合", "Length of stay and case mix"),
        fields: "VISIT_LOS_MINUTES · ED_ER_MINUTES · CACS_CODE · CACS_RIW · MAC",
        description: pair(
          "支持急诊停留与相对资源使用比较；派生值、分组版本和有效时间戳都需要核验。",
          "Supports ED length-of-stay and relative-resource comparisons. Derived values, grouper versions, and valid timestamps all require verification.",
        ),
      },
    ],
    captures: [
      pair("Alberta 急诊与日间手术活动，以及部分其他门诊", "Alberta ED and day-surgery activity plus selected other ambulatory care"),
      pair("登记、分诊、首次医师评估与离院时间", "Registration, triage, physician initial assessment, and departure timing"),
      pair("就诊问题、诊断、干预和转归", "Visit problems, diagnoses, interventions, and disposition"),
      pair("救护车到达、转院和转入住院线索", "Ambulance arrival, transfers, and clues to inpatient admission"),
    ],
    blindSpots: [
      pair("不保证所有专科门诊、站点和年份完整一致", "It does not guarantee uniform completeness across clinics, sites, and years"),
      pair("急诊离院后的住院全过程；需联结 DAD", "The full inpatient stay after ED disposition; link to DAD"),
      pair("详细临床文书、完整检验结果与用药执行", "Detailed clinical notes, complete lab results, and medication administration"),
      pair("仅凭等待时间无法判断照护质量或因果", "Waiting time alone cannot establish quality or causality"),
    ],
    sample: [
      {
        field: "VISIT_TIME",
        value: pair("14:08", "14:08"),
        meaning: pair("登记时间", "Registration time"),
      },
      {
        field: "TRIAGECODE",
        value: pair("3 级（示意）", "Level 3 (illustrative)"),
        meaning: pair("分诊级别", "Triage level"),
      },
      {
        field: "PIA_TIME",
        value: pair("14:47", "14:47"),
        meaning: pair("首次医师评估", "Physician initial assessment"),
      },
      {
        field: "DISPOSITION",
        value: pair("离院回家（示意）", "Discharged home (illustrative)"),
        meaning: pair("就诊转归", "Visit disposition"),
      },
      {
        field: "VISIT_LOS_MINUTES",
        value: pair("210 分钟", "210 minutes"),
        meaning: pair("派生总停留时间", "Derived total visit length"),
      },
    ],
    examples: [
      {
        title: pair("案例 A · 72 小时急诊返诊", "Example A · 72-hour ED revisit"),
        question: pair(
          "离院回家后的急诊患者中，72 小时内出现非计划返诊的比例是多少？",
          "Among ED patients discharged home, what proportion make an unplanned return visit within 72 hours?",
        ),
        design: [
          {
            label: pair("队列", "Cohort"),
            value: pair("选择真实急诊、可联结且转归为离院的索引就诊；排除安排就诊。", "Select linkable, true ED index visits ending in discharge and exclude arranged visits."),
          },
          {
            label: pair("索引", "Index"),
            value: pair("患者离开急诊的日期与时间，而非只用登记日期。", "The date and time the patient left the ED, not registration date alone."),
          },
          {
            label: pair("结局", "Outcome"),
            value: pair("离院后 72 小时内下一次符合规则的 NACRS 急诊记录。", "The next qualifying NACRS ED record within 72 hours after departure."),
          },
          {
            label: pair("联结", "Linkage"),
            value: pair("DAD 捕获随后住院；Vital Statistics 捕获死亡；Registry 判断资格。", "Use DAD for subsequent admission, Vital Statistics for death, and the Registry for eligibility."),
          },
        ],
        takeaway: pair(
          "先定义何为“返诊”：同院还是全省、计划还是非计划、72 小时从哪个时间戳开始。",
          "Define “revisit” first: same facility or province-wide, arranged or unplanned, and which timestamp starts the 72-hour clock.",
        ),
      },
      {
        title: pair("案例 B · 日间手术后的急性照护", "Example B · Acute care after day surgery"),
        question: pair(
          "成人日间手术后 7 天内是否发生急诊就诊，30 天内是否发生住院？",
          "After adult day surgery, does an ED visit occur within 7 days or an inpatient admission within 30 days?",
        ),
        design: [
          {
            label: pair("队列", "Cohort"),
            value: pair("用 ABSTRACT_TYPE、MIS 场景和经验证的主 CCI 操作定义日间手术，并要求活着回家。", "Define day surgery with ABSTRACT_TYPE, the MIS setting, and a validated main CCI intervention; require discharge alive to home."),
          },
          {
            label: pair("索引", "Index"),
            value: pair("日间手术服务日期；小时级分析需确认适用的结束时间，不能直接套用急诊离开字段。", "The day-surgery service date. Hour-level work requires the applicable end-time field and must not automatically reuse an ED departure field."),
          },
          {
            label: pair("结局", "Outcomes"),
            value: pair("第 1—7 天真正的 NACRS 急诊，以及第 1—30 天 DAD 急性住院。", "A true NACRS ED encounter on days 1–7 and a DAD acute admission on days 1–30."),
          },
          {
            label: pair("联结", "Linkage"),
            value: pair("连接 NACRS 日间手术、后续 NACRS 急诊、DAD 住院与 Registry 资格；排除同次直接转住院。", "Link the NACRS day surgery to later NACRS ED care, DAD admissions, and Registry eligibility; exclude a direct same-episode transfer."),
          },
        ],
        takeaway: pair(
          "计划复诊和其他门诊不能误算为急诊返诊；跨年还要记录 CCI 与 CACS grouper 版本。",
          "Do not misclassify planned follow-up or another ambulatory contact as an ED return; record CCI and CACS grouper versions across years.",
        ),
      },
    ],
    pitfalls: [
      pair("把“ED 高覆盖”理解为所有场景都完整；CIHI 2024–2025 仍记录 Alberta 19 家机构存在不完整期间，约缺 900 条 ED 记录。", "Treating high ED coverage as universal completeness; CIHI still identified incomplete periods at 19 Alberta facilities in 2024–2025, representing about 900 missing ED records."),
      pair("忽略提交层级、站点、年份和 Connect Care 流程变化，把字段缺失当成没有发生。", "Ignoring submission level, site, year, and Connect Care flow changes and treating a missing field as an absent event."),
      pair("把主诉、急诊离院诊断和住院最终诊断视为同一概念。", "Treating presenting complaint, ED discharge diagnosis, and final inpatient diagnosis as equivalent."),
      pair("只用日期而不用时间，误判跨午夜返诊、转院或等待。", "Using dates without times and misclassifying overnight revisits, transfers, or waits."),
      pair("把转入住院后的同一照护链误算为新的独立事件；需与 DAD 协调。", "Counting admission from the ED as a new independent event instead of reconciling the episode with DAD."),
    ],
    sources: [
      {
        label: pair("UCalgary CHI · NACRS 数据字典", "UCalgary CHI · NACRS data dictionary"),
        url: "https://cumming.ucalgary.ca/sites/default/files/teams/30/NACRS_elements.xlsx",
      },
      {
        label: pair("CIHI · NACRS 元数据", "CIHI · NACRS metadata"),
        url: "https://www.cihi.ca/en/national-ambulatory-care-reporting-system-nacrs-metadata",
      },
      {
        label: pair("CIHI · 2026–2027 NACRS 数据元素", "CIHI · 2026–2027 NACRS data elements"),
        url: "https://www.cihi.ca/sites/default/files/document/nacrs-data-elements-2026-2027-en.pdf",
      },
      {
        label: pair("CIHI · 2024–2025 NACRS 数据质量", "CIHI · 2024–2025 NACRS data quality"),
        url: "https://www.cihi.ca/sites/default/files/document/nacrs-data-quality-closed-year-information-2024-2025-report-en.pdf",
      },
    ],
  },
  {
    id: "pin",
    acronym: "PIN",
    name: pair("药品信息网络配药数据", "Pharmaceutical Information Network Dispenses"),
    context: pair("Alberta 社区药房配药", "Alberta community-pharmacy dispensing"),
    intro: pair(
      "研究申请中的 PIN 资产主要是 PIN Dispenses：一条记录表示社区药房发生的一次配药。它可观察药物何时被配出、产品、数量、供应天数与取消记录，适合研究出院后领取、续配和持续性。它观察的是配药行为，不是处方意图、实际服药或住院内给药。",
      "The PIN asset available for research is primarily PIN Dispenses: one record represents a dispense from a community pharmacy. It can show when a product was dispensed, its product coding, quantity, days supplied, and cancellation information, supporting studies of post-discharge fills, refills, and persistence. It observes dispensing—not prescribing intent, actual consumption, or inpatient administration.",
    ),
    facts: [
      {
        label: pair("一条记录", "One record"),
        value: pair("一次社区药房配药事件", "One community-pharmacy dispense event"),
      },
      {
        label: pair("Alberta 申请范围", "Alberta request range"),
        value: pair("2008—当前；PIN Dispenses", "2008–present; PIN Dispenses"),
      },
      {
        label: pair("产品分类", "Product classifications"),
        value: pair("DIN 产品号 · ATC 治疗分类", "DIN product identifier · ATC therapeutic class"),
      },
      {
        label: pair("最常回答", "Best suited to"),
        value: pair("领取、续配、覆盖天数与持续性", "Fills, refills, days covered, and persistence"),
      },
    ],
    trace: [
      pair("识别目标药物", "Identify the target drug"),
      pair("配药日期与数量", "Dispense date and quantity"),
      pair("供应天数与重叠", "Days supplied and overlap"),
      pair("续配、停顿或取消", "Refill, gap, or cancellation"),
    ],
    fieldGroups: [
      {
        title: pair("获批联结键", "Approved linkage key"),
        fields: "RCPT_ULI",
        description: pair(
          "用于在获批条件下连接同一人的 DAD、Claims 或 Registry 记录；研究披露通常不会保留原始直接标识。",
          "Supports approved person-level linkage to DAD, Claims, or the Registry. Research disclosures normally do not retain the raw direct identifier.",
        ),
      },
      {
        title: pair("基本人口学", "Basic demographics"),
        fields: "RCPT_DOB · RCPT_GENDER_CD",
        description: pair(
          "可用于年龄或性别 / 性别记录检查；正式分析通常优先采用 Registry 中经规格确认的人口学变量。",
          "Can support age and recorded sex/gender checks. Analyses often prefer specification-confirmed demographic fields from the Registry.",
        ),
      },
      {
        title: pair("配药日期", "Dispense date"),
        fields: "DSPN_DATE",
        description: pair(
          "定义首次领取、出院后领取窗口和续配序列的核心时间字段。",
          "The core timing field for first fills, post-discharge windows, and refill sequences.",
        ),
      },
      {
        title: pair("取消 / 撤回", "Cancellation or reversal"),
        fields: "DSPN_CANCEL_DATE",
        description: pair(
          "标识配药项目后来被撤回；未处理取消会把非有效事件算作领取。",
          "Identifies a dispense that was later retracted. Ignoring cancellations can count an invalid event as a fill.",
        ),
      },
      {
        title: pair("产品标识", "Product identifier"),
        fields: "DRUG_DIN",
        description: pair(
          "DIN 是具体获批药品产品的 8 位标识，应按文本保存前导零；跨时间需要版本化清单和退市 / 新产品处理。",
          "The DIN is an 8-digit identifier for a specific authorized drug product and should be stored as text to preserve leading zeros. Longitudinal work needs a versioned product list and rules for new or discontinued products.",
        ),
      },
      {
        title: pair("治疗分类", "Therapeutic classification"),
        fields: "SUPP_DRUG_ATC_CODE",
        description: pair(
          "ATC 是五层治疗分类；必须预先写明分析层级与版本，不能把它当成 DIN 的同义代码。",
          "ATC is a five-level therapeutic hierarchy. Pre-specify the analysis level and version; it is not interchangeable with a DIN.",
        ),
      },
      {
        title: pair("配药数量与单位", "Dispensed quantity and unit"),
        fields: "DSPN_AMT_QTY · DSPN_AMT_UNT_MSR_CD",
        description: pair(
          "数量必须连同单位和剂型解释；不能把片数、毫升或装置直接混为同一尺度。",
          "Quantity must be interpreted with its unit and formulation. Tablets, millilitres, and devices are not directly comparable scales.",
        ),
      },
      {
        title: pair("供应天数", "Days supplied"),
        fields: "DSPN_DAY_SUPPLY_QTY · DSPN_DAY_SUPPLY_UNT_MSR_CD",
        description: pair(
          "常用于构建覆盖天数、缺口和持续性，但需要缺失、极端值、提前续配与重叠规则。",
          "Often used to construct days covered, gaps, and persistence, with explicit rules for missing/extreme values, early refills, and overlaps.",
        ),
      },
    ],
    captures: [
      pair("Alberta 社区药房报告的配药事件", "Dispense events reported by Alberta community pharmacies"),
      pair("产品 DIN、ATC 类别、数量与单位", "Product DIN, ATC class, quantity, and unit"),
      pair("配药日期、供应天数与取消日期", "Dispense date, days supplied, and cancellation date"),
      pair("经获批联结后的纵向续配序列", "Longitudinal refill sequences after approved linkage"),
    ],
    blindSpots: [
      pair("产生配药的原始处方与开方意图；无配药不能区分未开方和未领取", "The source prescription and prescribing intent; no dispense cannot distinguish not prescribed from not filled"),
      pair("患者是否按说明实际服药", "Whether the patient took the medication as directed"),
      pair("住院、机构、继续照护、公共卫生及其他非社区药房供应", "Inpatient, institutional, continuing-care, public-health, and other non-community supply"),
      pair("当前 Alberta 研究资产中的药费或付款信息", "Drug cost or payment information in the current Alberta research asset"),
    ],
    sample: [
      {
        field: "DSPN_DATE",
        value: pair("2025-04-18", "2025-04-18"),
        meaning: pair("社区药房配药日", "Community-pharmacy dispense date"),
      },
      {
        field: "DRUG_DIN",
        value: pair("示例 DIN", "Example DIN"),
        meaning: pair("具体药品产品", "Specific drug product"),
      },
      {
        field: "SUPP_DRUG_ATC_CODE",
        value: pair("C09…（示意）", "C09… (illustrative)"),
        meaning: pair("治疗类别", "Therapeutic class"),
      },
      {
        field: "DSPN_AMT_QTY",
        value: pair("30 片（示意）", "30 tablets (illustrative)"),
        meaning: pair("数量需与单位合读", "Quantity interpreted with its unit"),
      },
      {
        field: "DSPN_DAY_SUPPLY_QTY",
        value: pair("30 天", "30 days"),
        meaning: pair("估计覆盖期", "Estimated coverage period"),
      },
    ],
    examples: [
      {
        title: pair("案例 A · 出院后 7 天内领取", "Example A · Fill within 7 days of discharge"),
        question: pair(
          "心衰住院出院后，患者是否在 7 天内领取目标药物类别？",
          "After a heart-failure hospitalization, does the patient fill the target drug class within 7 days of discharge?",
        ),
        design: [
          {
            label: pair("队列", "Cohort"),
            value: pair("DAD 中满足已验证病例定义、活着出院且具随访资格的成人。", "Adults meeting a validated DAD case definition, discharged alive, and observable during follow-up."),
          },
          {
            label: pair("索引", "Index"),
            value: pair("DAD 出院日期；明确第 0 天是否计入。", "The DAD discharge date, with an explicit rule for whether day 0 counts."),
          },
          {
            label: pair("结局", "Outcome"),
            value: pair("第 0—7 天内、未取消且 DIN / ATC 属于预先版本化清单的首次 PIN 配药。", "The first non-cancelled PIN dispense on days 0–7 whose DIN or ATC belongs to a pre-versioned target list."),
          },
          {
            label: pair("联结", "Linkage"),
            value: pair("以获批 ULI 联结 DAD—PIN；Registry 确认资格，Vital Statistics 处理死亡。", "Link DAD to PIN using the approved ULI; use the Registry for eligibility and Vital Statistics for death."),
          },
        ],
        takeaway: pair(
          "结果应表述为“观察到配药”，而不是“患者开始治疗”或“遵医嘱服药”。",
          "Describe the outcome as an observed dispense—not treatment initiation or medication adherence.",
        ),
      },
      {
        title: pair("案例 B · 180 天续配持续性", "Example B · 180-day refill persistence"),
        question: pair(
          "新开始某类药物后，180 天内出现超过 30 天无药覆盖缺口的比例是多少？",
          "After a new start in a drug class, what proportion have a gap of more than 30 uncovered days within 180 days?",
        ),
        design: [
          {
            label: pair("新使用者", "New users"),
            value: pair("设置足够 washout 期，期间没有目标 DIN / ATC 类别的有效配药。", "Require a sufficient washout period with no valid dispense in the target DIN or ATC class."),
          },
          {
            label: pair("覆盖", "Coverage"),
            value: pair("从 DSPN_DATE 加供应天数构建区间；预先定义提前续配是顺延、截断还是允许重叠。", "Build coverage intervals from DSPN_DATE plus days supplied and pre-specify how early refills carry forward, truncate, or overlap."),
          },
          {
            label: pair("结局", "Outcome"),
            value: pair("180 天内首次超过 30 天的无覆盖缺口；另行定义换药与类别内替换。", "The first gap longer than 30 uncovered days within 180 days, with separate rules for switching within or outside the class."),
          },
          {
            label: pair("竞争事件", "Competing events"),
            value: pair("死亡、迁出、长期住院与资格终止可能让后续社区配药不可观察。", "Death, out-migration, prolonged hospitalization, and loss of eligibility can make later community dispensing unobservable."),
          },
        ],
        takeaway: pair(
          "持续性指标对供应天数、取消、重叠、换药和不可观察时间的规则非常敏感。",
          "Persistence estimates are highly sensitive to rules for days supplied, cancellations, overlaps, switching, and unobservable time.",
        ),
      },
    ],
    pitfalls: [
      pair("把“配药”写成“已服用”或“依从”；PIN 不能直接观察吞服行为。", "Describing a dispense as consumption or adherence; PIN cannot directly observe ingestion."),
      pair("未排除取消 / 撤回记录或未处理同日重复配药。", "Failing to exclude cancellations/reversals or reconcile same-day duplicate dispenses."),
      pair("把数量当作剂量，或忽略片、毫升、装置等单位差异。", "Treating quantity as dose or ignoring units such as tablets, millilitres, and devices."),
      pair("把 DIN 与 ATC 混用，或用当前清单回溯所有年份却未保存层级、前导零和版本。", "Interchanging DIN and ATC, or applying a current list to all years without preserving hierarchy, leading zeros, and version."),
      pair("把住院内无社区配药误判为停药；住院期间的给药通常不在 PIN Dispenses 中。", "Calling an inpatient period a treatment gap when inpatient administration is generally outside PIN Dispenses."),
    ],
    sources: [
      {
        label: pair("UCalgary CHI · PIN 数据字典", "UCalgary CHI · PIN data dictionary"),
        url: "https://cumming.ucalgary.ca/sites/default/files/teams/30/PIN_elements.xlsx",
      },
      {
        label: pair("Government of Alberta · Health data access", "Government of Alberta · Health data access"),
        url: "https://www.alberta.ca/health-research",
      },
      {
        label: pair("UCalgary CHI · AHS 数据集目录", "UCalgary CHI · AHS dataset catalogue"),
        url: "https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets",
      },
      {
        label: pair("Health Canada · DIN 说明", "Health Canada · DIN fact sheet"),
        url: "https://www.canada.ca/en/health-canada/services/drugs-health-products/drug-products/fact-sheets/drug-identification-number.html",
      },
      {
        label: pair("Alberta Netcare · PIN 常见问题", "Alberta Netcare · PIN frequently asked questions"),
        url: "https://www.albertanetcare.ca/learningcentre/PIN-FAQ.htm",
      },
    ],
  },
];
