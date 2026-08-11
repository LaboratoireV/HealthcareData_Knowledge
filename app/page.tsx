"use client";

import { useEffect, useMemo, useState } from "react";
import {
  deepDives,
  type DeepDive,
  type LocalizedText,
} from "./deep-dives";
import {
  dictionaryGuides,
  type DictionaryStatus,
} from "./dictionary-guides";

type Dataset = {
  id: string;
  acronym: string;
  nameZh: string;
  nameEn: string;
  type: "行政数据" | "临床信息系统";
  settings: string[];
  settingLabel: string;
  coverage: string;
  refresh: string;
  refreshKey: "daily" | "weekly" | "monthly" | "quarterly" | "annual";
  grain: string;
  summary: string;
  questions: string[];
  linkage: string;
  caveat: string;
  audit: string;
  sourceUrl: string;
  dictionaryUrl?: string;
  auditUrl?: string;
  legacy?: boolean;
};

const CATALOGUE_URL =
  "https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets";
const GITHUB_REPOSITORY_URL =
  "https://github.com/LaboratoireV/HealthcareData_Knowledge";
const DICTIONARY_GUIDE_BASE =
  "https://github.com/LaboratoireV/HealthcareData_Knowledge/blob/main/resources/data-dictionaries";
const UCALGARY_TERMS_URL =
  "https://www.ucalgary.ca/website-terms-conditions";

const dictionaryStatusCopy: Record<DictionaryStatus, LocalizedText> = {
  linked: { zh: "官方公开工作簿", en: "Official public workbook" },
  partial: { zh: "部分公开：仅死亡登记", en: "Partial: Death Registry only" },
  request: { zh: "无公开字段工作簿", en: "No public field workbook" },
};

const datasets: Dataset[] = [
  {
    id: "dad",
    acronym: "DAD",
    nameZh: "出院摘要数据库",
    nameEn: "Discharge Abstract Database",
    type: "行政数据",
    settings: ["住院"],
    settingLabel: "急性住院（Alberta 日间手术通常在 NACRS）",
    coverage: "CHI：2002.04—当前*",
    refresh: "每月 · 约滞后 1 个月",
    refreshKey: "monthly",
    grain: "一次报告机构的住院离院摘要",
    summary:
      "记录急性住院离院的人口学、诊断、操作、行政和转归信息，是研究住院结局与资源利用的核心来源。",
    questions: ["哪些患者在 30 天内再次住院？", "不同手术后的住院时长如何变化？"],
    linkage: "常与 NACRS、Registry、Claims、Vital Statistics 联结。",
    caveat:
      "一条摘要不等于一位患者或完整照护 episode；转院、诊断类型和编码方法学年份必须处理。",
    audit: "Alberta 日间手术通常在 NACRS；CHI 对 DAD 的日间手术表述需按项目规格向 custodian 确认。",
    sourceUrl: CATALOGUE_URL,
    dictionaryUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/DAD_elements.xlsx",
    auditUrl: "https://www.cihi.ca/en/discharge-abstract-database-dad-metadata",
  },
  {
    id: "nacrs",
    acronym: "NACRS",
    nameZh: "国家门诊护理报告系统",
    nameEn: "National Ambulatory Care Reporting System",
    type: "行政数据",
    settings: ["急诊/门诊"],
    settingLabel: "急诊 · 紧急护理 · 部分门诊",
    coverage: "历史约 2002—当前；2010 起 NACRS 格式*",
    refresh: "每月 · 约滞后 1 个月",
    refreshKey: "monthly",
    grain: "一次急诊 / 门诊就诊记录",
    summary:
      "覆盖急诊、日间手术、紧急护理以及部分门诊或专科诊所就诊，适合研究急诊使用与照护转归。",
    questions: ["急诊后 72 小时内返诊有多常见？", "哪些就诊最终转入住院？"],
    linkage: "常与 DAD、Registry、Claims 联结，构建完整照护路径。",
    caveat:
      "急诊与日间手术报告较完整不等于所有门诊完整；专科诊所、站点、年份和提交层级需分别核对。",
    audit: "Alberta 自 2010-04-01 采用 NACRS 格式；更早 AACRS/ACCS 表的起点与字段并不一致。",
    sourceUrl: CATALOGUE_URL,
    dictionaryUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/NACRS_elements.xlsx",
    auditUrl:
      "https://www.cihi.ca/en/national-ambulatory-care-reporting-system-nacrs-metadata",
  },
  {
    id: "claims",
    acronym: "CLAIMS",
    nameZh: "医务人员理赔",
    nameEn: "Practitioner Claims",
    type: "行政数据",
    settings: ["医师服务", "急诊/门诊"],
    settingLabel: "医师服务 · 初级保健",
    coverage: "CHI：1993.04—当前*",
    refresh: "每季 · 约滞后 4 个月",
    refreshKey: "quarterly",
    grain: "一项已申报的计费服务",
    summary:
      "来自 AHCIP 下的服务申报与付款记录，可观察跨住院、门诊和初级保健的医师服务利用。",
    questions: ["慢性病患者一年使用多少次医师服务？", "服务利用是否存在地域差异？"],
    linkage: "常与 Registry、DAD、NACRS、PIN 联结。",
    caveat:
      "计费行为不等于疾病真实发生，也不代表完整病历；SOMB、shadow billing 与诊断代码规则会随时间变化。",
    audit: "CHI 与旧 Alberta 概览对历史起点和完整性滞后存在不同口径。",
    sourceUrl: CATALOGUE_URL,
    dictionaryUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/CLAIMS_Elements.xlsx",
    auditUrl:
      "https://open.alberta.ca/dataset/overview-of-administrative-health-datasets",
  },
  {
    id: "pld",
    acronym: "PLD",
    nameZh: "省级实验室数据",
    nameEn: "Provincial Laboratory Data",
    type: "行政数据",
    settings: ["检验"],
    settingLabel: "住院与门诊实验室检测",
    coverage: "CHI：2012.04—当前*",
    refresh: "每日 · 约滞后 1 周",
    refreshKey: "daily",
    grain: "一次检验项目与结果",
    summary:
      "汇集常见临床化学、血液学、血清学等实验室结果，可用于识别生物标志物、疾病状态与检测轨迹。",
    questions: ["指标异常后多久发生住院？", "检测频率在不同人群间是否不同？"],
    linkage: "常与 DAD、NACRS、Claims、Connect Care 联结。",
    caveat:
      "历史上由多个地区系统汇集；检验代码、单位、参考范围和来源系统必须先协调，不能只比较裸数值。",
    audit: "当前可申请的检测、站点、时间段与 custodian 应在申请时逐项确认。",
    sourceUrl: CATALOGUE_URL,
    dictionaryUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/LAB_elements.xlsx",
    auditUrl: "https://www.alberta.ca/health-research",
  },
  {
    id: "pin",
    acronym: "PIN",
    nameZh: "药品信息网络",
    nameEn: "Pharmaceutical Information Network",
    type: "行政数据",
    settings: ["药房"],
    settingLabel: "社区药房配药",
    coverage: "2008.01—当前*",
    refresh: "每周 · 约滞后 1 周",
    refreshKey: "weekly",
    grain: "一次社区药房配药记录",
    summary:
      "研究提取主要聚焦社区药房的配药记录，可用于观察药物领取、持续性与出院后的药物轨迹。",
    questions: ["出院后患者是否领取处方药？", "不同药物的持续领取模式如何？"],
    linkage: "常与 DAD、Claims、Registry、Vital Statistics 联结。",
    caveat:
      "已配药不等于已服用；临床 PIN 应用中的过敏、警告或处方功能不应被假定全部存在于研究提取中。",
    audit: "Alberta 当前申请资产明确为 PIN Dispenses，且不含财务信息。",
    sourceUrl: CATALOGUE_URL,
    dictionaryUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/PIN_elements.xlsx",
    auditUrl: "https://www.alberta.ca/health-research",
  },
  {
    id: "vital",
    acronym: "VITAL",
    nameZh: "生命统计",
    nameEn: "Vital Statistics",
    type: "行政数据",
    settings: ["生命事件", "人口"],
    settingLabel: "出生 · 死胎 · 死亡",
    coverage: "CHI：1983—当前*",
    refresh: "每年 · 约滞后 1 年",
    refreshKey: "annual",
    grain: "一次出生或死亡登记事件",
    summary:
      "记录 Alberta 境内的出生、死胎和死亡，可用于全因或死因死亡、围产结局和人群结局研究。",
    questions: ["某队列的全因死亡风险如何？", "围产结局在地区间有何不同？"],
    linkage: "常作为 DAD、Claims、PIN 等队列的结局来源。",
    caveat:
      "Vital Statistics 另有授权要求；死因编码、登记滞后与小样本披露风险必须处理。",
    audit: "CHI 的 1983 起点与 Alberta 当前标准申请页口径不同，历史覆盖务必预先确认。",
    sourceUrl: CATALOGUE_URL,
    dictionaryUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/VitalStatisticsDeath_elements.xlsx",
    auditUrl:
      "https://www.alberta.ca/access-vital-statistics-information-data",
  },
  {
    id: "registry",
    acronym: "REGISTRY",
    nameZh: "省级人口登记",
    nameEn: "Provincial / Population Registry",
    type: "行政数据",
    settings: ["人口"],
    settingLabel: "AHCIP 资格 · 人口与地理",
    coverage: "CHI：1994.04—当前*",
    refresh: "每年 · 约滞后 1 年",
    refreshKey: "annual",
    grain: "一个参保者在一段资格期内的记录",
    summary:
      "提供 AHCIP 合资格居民的基础人口学、计划和地理信息，常用于队列定义、分母与数据联结。",
    questions: ["研究期间谁处于参保状态？", "如何构建年龄、性别和地区分层？"],
    linkage: "几乎可作为所有行政健康数据集的队列骨架。",
    caveat:
      "保险登记人口不等同于人口普查；迁入迁出、地址更新时间和资格变化会影响分母。",
    audit: "CHI 与旧 Alberta 概览的历史起点相差约一年，应以项目可用版本为准。",
    sourceUrl: CATALOGUE_URL,
    dictionaryUrl:
      "https://cumming.ucalgary.ca/sites/default/files/teams/30/Registry_elements.xlsx",
    auditUrl:
      "https://open.alberta.ca/dataset/overview-of-administrative-health-datasets",
  },
  {
    id: "scm",
    acronym: "SCM",
    nameZh: "Sunrise 临床管理系统",
    nameEn: "Sunrise Clinical Manager",
    type: "临床信息系统",
    settings: ["住院", "临床病历"],
    settingLabel: "Calgary 区历史住院 EMR",
    coverage: "2011—按站点确认",
    refresh: "遗留系统 · 可用性需确认",
    refreshKey: "daily",
    grain: "一次临床事件、医嘱、结果或文书",
    summary:
      "Calgary 区的历史临床信息系统，包含人口学、医嘱、检查结果与临床文书，现应视作遗留来源。",
    questions: ["行政记录之外的临床细节是什么？", "历史 Calgary 队列有哪些可用文书？"],
    linkage: "可与 DAD、NACRS、PLD 等对照，但需理解系统迁移。",
    caveat:
      "SCM 已被 Connect Care 逐步取代；仍可访问历史数据不代表它仍持续新增。",
    audit: "CHI 页面中的“当前 / 无延迟”不宜直接解释为 2026 年仍实时入库。",
    sourceUrl: CATALOGUE_URL,
    auditUrl:
      "https://publicshare.albertahealthservices.ca/teams/HEI/ITAccess/SitePages/CC%20Research%20Resources.aspx",
    legacy: true,
  },
  {
    id: "connect-care",
    acronym: "CC / EPIC",
    nameZh: "Connect Care",
    nameEn: "Connect Care / Epic",
    type: "临床信息系统",
    settings: ["住院", "急诊/门诊", "临床病历"],
    settingLabel: "省级统一临床信息系统",
    coverage: "2019—2024 分波次上线*",
    refresh: "源系统每日 · 提取另计",
    refreshKey: "daily",
    grain: "一次临床接触中的事件、医嘱、结果或文书",
    summary:
      "全省统一临床信息系统，将病历、医嘱、结果与工作流程连接起来；实际历史深度取决于站点上线日期。",
    questions: ["某临床队列的细粒度病历特征是什么？", "上线前后流程与结局如何变化？"],
    linkage: "可与历史行政数据和遗留 EMR 联结，形成纵向队列。",
    caveat:
      "2019—2024 分批上线会造成重要的时间与站点覆盖偏差；源系统每日刷新不等于研究数据可当天交付。",
    audit: "AHS 官方记录显示最后一次上线为 2024-11-02，而非 CHI 页面所称的 2022 年全面完成。",
    sourceUrl: CATALOGUE_URL,
    auditUrl: "https://www.albertahealthservices.ca/news/Page18624.aspx",
  },
];

const journeyStops = [
  {
    id: "population",
    step: "01",
    label: "人群与资格",
    caption: "谁在队列里？",
    datasets: ["REGISTRY"],
    note: "Registry 给队列一个人口与参保资格骨架，但它不是人口普查。",
  },
  {
    id: "ambulatory",
    step: "02",
    label: "社区与门诊",
    caption: "发生了哪些服务？",
    datasets: ["CLAIMS", "NACRS"],
    note: "理赔记录服务申报；NACRS 记录急诊和部分门诊接触。两者观察的是不同痕迹。",
  },
  {
    id: "hospital",
    step: "03",
    label: "急诊与住院",
    caption: "照护如何转归？",
    datasets: ["NACRS", "DAD", "CC / EPIC"],
    note: "NACRS → DAD 可描述急诊到住院；Connect Care 增加更细的临床上下文。",
  },
  {
    id: "lab",
    step: "04",
    label: "检查与结果",
    caption: "生理信号是什么？",
    datasets: ["PLD", "CC / EPIC"],
    note: "数值只有在代码、单位、参考范围和来源系统被协调后才可比较。",
  },
  {
    id: "pharmacy",
    step: "05",
    label: "社区药房",
    caption: "药物是否领取？",
    datasets: ["PIN"],
    note: "PIN 观察配药，而不是实际服药；研究问题要与可见行为对齐。",
  },
  {
    id: "outcome",
    step: "06",
    label: "生命结局",
    caption: "长期结局是什么？",
    datasets: ["VITAL", "DAD"],
    note: "死亡与住院结局可延伸随访，但授权、滞后和小样本披露都要预先设计。",
  },
];

const lessons = [
  {
    no: "01",
    time: "12 min",
    title: "先区分“人、记录与事件”",
    text: "同一个人在一次照护旅程中会留下多条记录。先确定分析粒度，再谈人数、就诊数或比率。",
    example: "例：一次急诊后住院，可能同时出现在 NACRS 与 DAD。",
  },
  {
    no: "02",
    time: "15 min",
    title: "把问题拆成 P-I-O-T",
    text: "明确人群 Population、指标事件 Index、结局 Outcome 与时间窗 Time；暴露或比较组再放入其中。",
    example: "例：65+ 出院者 / 出院日 / 30 天再入院 / 2019—2024。",
  },
  {
    no: "03",
    time: "18 min",
    title: "从数据字典验证可行性",
    text: "把每个概念映射到字段、代码体系、可用年份与缺失规则。字段存在，不代表质量足以回答问题。",
    example: "例：诊断代码的位置与类型会改变病例定义。",
  },
  {
    no: "04",
    time: "20 min",
    title: "设计联结与观察窗",
    text: "定义主键、索引日、回溯期、随访期与重复记录处理；联结率本身也是一项质量结果。",
    example: "例：用 Registry 判断随访期内是否仍具参保资格。",
  },
  {
    no: "05",
    time: "16 min",
    title: "识别系统迁移与偏倚",
    text: "站点上线、编码变化、计费激励和地域覆盖都会制造假趋势。先画数据生成过程，再解释曲线。",
    example: "例：Connect Care 2019—2024 分波次上线，不是同一天开始。",
  },
  {
    no: "06",
    time: "14 min",
    title: "把审批写进研究设计",
    text: "最少必要字段、安全环境、输出审查与销毁计划不是收尾文书，而是研究方法的一部分。",
    example: "例：REB 批准不自动等于 custodian 已批准披露。",
  },
];

const scenarios = [
  {
    id: "readmission",
    tab: "急诊后再入院",
    question: "急诊出院后 30 天内，哪些人再次住院？",
    datasets: ["NACRS", "DAD", "REGISTRY"],
    cohort: "在指定期间有可识别 NACRS 急诊出院记录、且随后 30 天可观察的人群。",
    timeline: "索引日：急诊出院日 → 随访：1—30 天 → 结局：DAD 住院入院。",
    roles: ["NACRS：索引急诊", "DAD：再住院结局", "Registry：资格与人口分层"],
    risk: "急诊转入住院不是“出院后再入院”；需排除同次照护链并处理死亡竞争风险。",
  },
  {
    id: "medication",
    tab: "出院后配药",
    question: "心衰住院出院后 7 天内，患者是否领取目标药物？",
    datasets: ["DAD", "PIN", "REGISTRY"],
    cohort: "DAD 中满足已验证病例定义并活着出院的成人队列。",
    timeline: "索引日：出院日 → 随访：0—7 天 → 结局：PIN 目标药物配药。",
    roles: ["DAD：住院与诊断", "PIN：配药事件", "Registry：资格与地址"],
    risk: "配药不等于服药；住院内用药通常不由社区配药记录完整反映。",
  },
  {
    id: "utilization",
    tab: "慢病服务利用",
    question: "糖尿病人群的医师服务与急诊使用是否随时间改变？",
    datasets: ["CLAIMS", "NACRS", "DAD", "REGISTRY"],
    cohort: "用经过验证的多年度诊断算法识别病例，并设置足够回溯期。",
    timeline: "回溯：2 年病例识别 → 年度观察窗 → 指标：每人年服务与急诊率。",
    roles: ["Claims：社区服务", "NACRS：急诊", "DAD：住院", "Registry：分母"],
    risk: "代码与计费实践变化可伪装成患病率或服务利用变化；年度分母需处理迁移与死亡。",
  },
];

const checklistItems = [
  { group: "申请前", text: "写清研究、QI、规划或运营目的，并确认适用审批路径" },
  { group: "申请前", text: "确认当前 custodian、申请入口与数据可用年份" },
  { group: "申请前", text: "判断是否需要指定 REB 批准，以及需要何种协议" },
  { group: "申请前", text: "只申请回答问题所需的最少字段、最短时间与最小队列" },
  { group: "分析前", text: "把概念映射到数据字典字段、代码与版本" },
  { group: "分析前", text: "记录提取日期、刷新滞后、站点覆盖和系统迁移" },
  { group: "分析中", text: "在获批安全环境中工作，不尝试重新识别个人" },
  { group: "分析中", text: "量化缺失、联结失败、编码变化与人群覆盖偏倚" },
  { group: "分享前", text: "按协议聚合结果，并执行小样本单元与输出审查" },
  { group: "分享前", text: "报告数据生成过程、可比性限制与不确定性" },
  { group: "分享前", text: "按协议保留、归档或销毁数据与衍生文件" },
];

const resources = [
  {
    access: "开放",
    title: "Alberta Interactive Health Data",
    org: "Government of Alberta",
    text: "用公开汇总表、地图与仪表盘练习率、趋势、地理比较和健康不平等解读。",
    url: "https://www.alberta.ca/interactive-health-data",
  },
  {
    access: "开放",
    title: "Alberta Open Government",
    org: "Government of Alberta",
    text: "寻找可下载的健康类公开数据与出版物，适合练习清洗、引用和可复现分析。",
    url: "https://open.alberta.ca/opendata",
  },
  {
    access: "开放",
    title: "CIHI Data Holdings",
    org: "Canadian Institute for Health Information",
    text: "查看 DAD、NACRS 等全国数据持有范围，并用公开指标进行省际比较。",
    url: "https://www.cihi.ca/en/access-data-and-reports/data-holdings",
  },
  {
    access: "申请",
    title: "AHS 9 个常用数据集目录",
    org: "UCalgary Centre for Health Informatics",
    text: "本站目录的起点：数据集描述、CHI 元数据口径和部分字段字典。",
    url: CATALOGUE_URL,
  },
  {
    access: "申请",
    title: "Health data access",
    org: "Government of Alberta",
    text: "查看当前行政健康数据资产、研究/QI 申请类别、数据规格与披露流程。",
    url: "https://www.alberta.ca/health-research",
  },
  {
    access: "申请",
    title: "Requesting AHS Data Resources",
    org: "Alberta Health Services",
    text: "了解 analyst extraction、直接系统访问、REB 与数据披露协议要求。",
    url: "https://www.albertahealthservices.ca/research/Page16074.aspx",
  },
  {
    access: "安全环境",
    title: "CIHI Custom Data Request",
    org: "Canadian Institute for Health Information",
    text: "申请定制汇总或记录级数据；记录级分析通常在 Secure Access Environment 进行。",
    url: "https://www.cihi.ca/en/access-data-and-reports/make-a-data-request",
  },
  {
    access: "安全环境",
    title: "Statistics Canada RDCs",
    org: "Statistics Canada",
    text: "经项目与安全审批后使用微数据，研究 Alberta 的社会决定因素与健康不平等。",
    url: "https://www.statcan.gc.ca/en/microdata/data-centres",
  },
  {
    access: "指南",
    title: "Health Information Act",
    org: "Government of Alberta",
    text: "理解 custodian、最少必要、非识别信息、研究披露与数据匹配等基础规则。",
    url: "https://www.alberta.ca/health-information-act",
  },
  {
    access: "指南",
    title: "ARECCI Decision Support Tools",
    org: "Alberta Innovates",
    text: "帮助区分 research、QI 与 evaluation；工具结果不是正式伦理批准。",
    url: "https://albertainnovates.ca/strategic-initiatives/a-project-ethics-community-consensus-initiative-arecci/arecci-decision-support-tools/",
  },
];

const glossary = [
  ["分析粒度", "Grain", "一行或一个分析单位代表什么：人、就诊、住院、服务还是检验。"],
  ["指标事件", "Index event", "启动观察窗的事件或日期，例如一次出院。"],
  ["回溯期", "Look-back", "指标事件之前用来识别病史、暴露或资格的时间。"],
  ["随访期", "Follow-up", "指标事件之后观察结局的时间。"],
  ["覆盖度", "Coverage", "数据对目标人群、站点、照护场景与年份的捕获范围。"],
  ["报告延迟", "Reporting lag", "事件发生到进入可分析数据源之间的时间；不是申请交付时长。"],
  ["数据联结", "Linkage", "用获批标识符或键把多个来源的同一人或事件连接起来。"],
  ["非识别信息", "Non-identifying information", "身份不能被轻易确定的信息；仍需遵守适用协议与风险控制。"],
  ["研究伦理委员会", "REB", "审查研究伦理的机构；REB 批准不自动等于数据 custodian 批准披露。"],
  ["数据披露协议", "DDA", "规定数据用途、访问、保留、披露与销毁等条件的协议。"],
];

type Locale = "zh" | "en";

type DatasetLocalizedCopy = {
  settingLabel: string;
  coverage: string;
  refresh: string;
  grain: string;
  summary: string;
  questions: string[];
  linkage: string;
  caveat: string;
  audit: string;
};

const datasetCopyEn: Record<string, DatasetLocalizedCopy> = {
  dad: {
    settingLabel: "Acute inpatient care (Alberta day surgery is generally in NACRS)",
    coverage: "CHI: Apr 2002–present*",
    refresh: "Monthly · ~1-month lag",
    grain: "One inpatient separation from a reporting facility",
    summary:
      "Captures demographic, diagnosis, intervention, administrative, and disposition information for acute inpatient separations—a core source for hospital outcomes and resource use.",
    questions: [
      "Which patients are readmitted within 30 days?",
      "How does length of stay vary by procedure?",
    ],
    linkage:
      "Commonly linked with NACRS, Population Registry, Practitioner Claims, and Vital Statistics.",
    caveat:
      "One abstract is not one person or a complete episode of care; transfers, diagnosis types, and methodology years must be handled explicitly.",
    audit:
      "Alberta day surgery is generally reported through NACRS; confirm the CHI catalogue’s DAD day-surgery wording in the project specification.",
  },
  nacrs: {
    settingLabel: "Emergency · Urgent care · Selected outpatient clinics",
    coverage: "Historical data from ~2002; NACRS format from 2010*",
    refresh: "Monthly · ~1-month lag",
    grain: "One emergency or ambulatory care visit",
    summary:
      "Covers emergency care, day surgery, urgent care, and selected outpatient or specialty-clinic visits; useful for studying emergency use and subsequent disposition.",
    questions: [
      "How often do patients return to the emergency department within 72 hours?",
      "Which visits result in hospital admission?",
    ],
    linkage:
      "Often linked with DAD, Population Registry, and Practitioner Claims to reconstruct care pathways.",
    caveat:
      "Strong ED and day-surgery reporting does not make every ambulatory setting complete; verify clinic, site, year, and submission level separately.",
    audit:
      "Alberta adopted the NACRS format on 2010-04-01; earlier AACRS/ACCS tables do not share one start date or field set.",
  },
  claims: {
    settingLabel: "Physician services · Primary care",
    coverage: "CHI: Apr 1993–present*",
    refresh: "Quarterly · ~4-month lag",
    grain: "One billed service claim",
    summary:
      "Derived from Alberta Health Care Insurance Plan service claims and payments; supports analysis of physician service use across inpatient, outpatient, and primary care settings.",
    questions: [
      "How many physician services do patients with chronic disease use in a year?",
      "Does service use differ by region?",
    ],
    linkage: "Commonly linked with Population Registry, DAD, NACRS, and PIN.",
    caveat:
      "Billing activity does not establish disease occurrence and is not a complete medical record; Schedule of Medical Benefits, shadow-billing, and diagnostic-coding rules change over time.",
    audit:
      "CHI and the older Alberta overview use different historical start dates and completeness lags.",
  },
  pld: {
    settingLabel: "Inpatient and outpatient laboratory testing",
    coverage: "CHI: Apr 2012–present*",
    refresh: "Daily · ~1-week lag",
    grain: "One laboratory test and result record",
    summary:
      "Aggregates common clinical chemistry, hematology, serology, and other laboratory results; useful for studying biomarkers, disease states, and testing trajectories.",
    questions: [
      "How soon after an abnormal result does hospitalization occur?",
      "Does testing frequency differ across population groups?",
    ],
    linkage:
      "Commonly linked with DAD, NACRS, Practitioner Claims, and Connect Care.",
    caveat:
      "Data were historically consolidated from multiple regional systems; harmonize test codes, units, reference ranges, and source systems before comparing raw values.",
    audit:
      "Confirm available tests, sites, time periods, and data custodian for each request.",
  },
  pin: {
    settingLabel: "Community pharmacy dispensing",
    coverage: "Jan 2008–present*",
    refresh: "Weekly · ~1-week lag",
    grain: "One community-pharmacy dispense record",
    summary:
      "Research extracts focus mainly on community-pharmacy dispensing records, supporting analysis of dispensing patterns, refill persistence, and post-discharge medication trajectories.",
    questions: [
      "Was a prescription dispensed after discharge?",
      "How do refill patterns differ across medications?",
    ],
    linkage:
      "Commonly linked with DAD, Practitioner Claims, Population Registry, and Vital Statistics.",
    caveat:
      "A dispense does not prove that a medication was taken; do not assume that allergies, alerts, or prescribing functions in the clinical PIN application are present in research extracts.",
    audit:
      "Alberta currently identifies the available research asset as PIN Dispenses, with no financial information.",
  },
  vital: {
    settingLabel: "Live birth · Stillbirth · Death",
    coverage: "CHI: 1983–present*",
    refresh: "Annual · ~1-year lag",
    grain: "One registered live birth, stillbirth, or death event",
    summary:
      "Records live births, stillbirths, and deaths occurring in Alberta; supports all-cause and cause-specific mortality, perinatal outcomes, and population-outcome research.",
    questions: [
      "What is the all-cause mortality risk in a cohort?",
      "How do perinatal outcomes differ by region?",
    ],
    linkage:
      "Frequently used as an outcome source for cohorts built from DAD, Practitioner Claims, and PIN.",
    caveat:
      "Vital Statistics requires separate authorization; cause-of-death coding, registration lag, and small-cell disclosure risk must be addressed.",
    audit:
      "CHI’s 1983 start date differs from Alberta’s current standard request page; confirm historical coverage in advance.",
  },
  registry: {
    settingLabel: "AHCIP eligibility · Demographics and geography",
    coverage: "CHI: Apr 1994–present*",
    refresh: "Annual · ~1-year lag",
    grain: "One registrant record for an eligibility period",
    summary:
      "Provides basic demographic, plan, and geographic information for AHCIP-eligible residents; commonly used for cohort definition, denominators, and data linkage.",
    questions: [
      "Who had active coverage during the study period?",
      "How can a cohort be stratified by age, sex, and geography?",
    ],
    linkage:
      "Serves as a cohort backbone for nearly all administrative health datasets.",
    caveat:
      "The insured population is not equivalent to the census population; migration, address recency, and eligibility changes affect denominators.",
    audit:
      "CHI and the older Alberta overview differ by roughly one year on the historical start date; use the version available to the project.",
  },
  scm: {
    settingLabel: "Historical Calgary inpatient EMR",
    coverage: "2011–confirm by site",
    refresh: "Legacy system · Confirm availability",
    grain: "One clinical event, order, result, or note",
    summary:
      "A historical Calgary Zone clinical information system containing demographics, orders, test results, and clinical notes; it should now be treated as a legacy source.",
    questions: [
      "What clinical detail is available beyond administrative records?",
      "Which notes are available for historical Calgary cohorts?",
    ],
    linkage:
      "Can be reconciled with DAD, NACRS, and PLD, but system migration must be understood.",
    caveat:
      "Connect Care progressively replaced SCM; access to historical data does not mean that new data continue to accrue.",
    audit:
      "CHI’s “current / no delay” wording should not be interpreted as real-time SCM accrual in 2026.",
  },
  "connect-care": {
    settingLabel: "Unified provincial clinical information system",
    coverage: "Phased rollout, 2019–2024*",
    refresh: "Source system daily · Extract timing varies",
    grain: "One event, order, result, or note within a clinical encounter",
    summary:
      "A province-wide clinical information system connecting records, orders, results, and workflows; historical depth depends on each site’s go-live date.",
    questions: [
      "Which fine-grained clinical features characterize a cohort?",
      "How do workflows and outcomes change before and after go-live?",
    ],
    linkage:
      "Can be linked with longitudinal administrative data and legacy EMRs.",
    caveat:
      "The phased 2019–2024 rollout creates important temporal and site-coverage bias; daily source refresh does not mean same-day research delivery.",
    audit:
      "AHS records the ninth and final launch on 2024-11-02, not full implementation in 2022 as stated on the CHI catalogue page.",
  },
};

const journeyCopyEn: Record<
  string,
  { label: string; caption: string; note: string }
> = {
  population: {
    label: "Population & eligibility",
    caption: "Who belongs in the cohort?",
    note: "The Population Registry gives a cohort a demographic and AHCIP-eligibility backbone, but it is not a census.",
  },
  ambulatory: {
    label: "Community & ambulatory",
    caption: "Which services occurred?",
    note: "Claims capture billed services; NACRS captures emergency and selected ambulatory contacts. They represent different data traces.",
  },
  hospital: {
    label: "Emergency & inpatient",
    caption: "How did care progress?",
    note: "NACRS and DAD can describe the path from emergency care to admission; Connect Care adds richer clinical context.",
  },
  lab: {
    label: "Tests & results",
    caption: "What were the physiologic signals?",
    note: "Numeric results become comparable only after test codes, units, reference ranges, and source systems are harmonized.",
  },
  pharmacy: {
    label: "Community pharmacy",
    caption: "Was medication dispensed?",
    note: "PIN observes dispensing, not medication use. Match the research question to the behaviour the data can actually observe.",
  },
  outcome: {
    label: "Vital outcomes",
    caption: "What happened over time?",
    note: "Mortality and hospitalization extend follow-up, but authorization, reporting lag, and small-cell disclosure must be designed in advance.",
  },
};

const lessonCopyEn: Record<
  string,
  { title: string; text: string; example: string }
> = {
  "01": {
    title: "Separate people, records, and events",
    text: "One person can leave many records during one care journey. Define the analytic grain before counting people, visits, or rates.",
    example: "Example: one emergency visit followed by admission may appear in both NACRS and DAD.",
  },
  "02": {
    title: "Break the question into P-I-O-T",
    text: "Specify the Population, Index event, Outcome, and Time window, then place the exposure or comparison group within that structure.",
    example: "Example: age 65+ / discharge date / 30-day readmission / 2019–2024.",
  },
  "03": {
    title: "Test feasibility with the data dictionary",
    text: "Map every concept to fields, code systems, available years, and missing-data rules. A field can exist without being fit for the question.",
    example: "Example: diagnosis position and type can change a case definition.",
  },
  "04": {
    title: "Design linkage and observation windows",
    text: "Define keys, the index date, look-back, follow-up, and duplicate handling. The linkage rate is itself a quality result.",
    example: "Example: use the Population Registry to assess eligibility during follow-up.",
  },
  "05": {
    title: "Recognize migrations and bias",
    text: "Site go-lives, coding changes, billing incentives, and geographic coverage can create artificial trends. Map data generation before interpreting a curve.",
    example: "Example: Connect Care rolled out in phases from 2019 to 2024.",
  },
  "06": {
    title: "Build authorization into the design",
    text: "Minimum-necessary fields, secure environments, output review, and destruction plans are part of the method—not closing paperwork.",
    example: "Example: REB approval does not itself authorize a custodian to disclose data.",
  },
};

const scenarioCopyEn: Record<
  string,
  {
    tab: string;
    question: string;
    cohort: string;
    timeline: string;
    roles: string[];
    risk: string;
  }
> = {
  readmission: {
    tab: "Admission after ED discharge",
    question: "Who is admitted to hospital within 30 days after discharge from the emergency department?",
    cohort: "People with an identifiable NACRS emergency-discharge record in the study period and 30 observable days afterward.",
    timeline: "Index: emergency discharge → Follow-up: days 1–30 → Outcome: DAD inpatient admission.",
    roles: [
      "NACRS: index emergency visit",
      "DAD: subsequent admission",
      "Registry: eligibility and demographic strata",
    ],
    risk: "A direct transfer from emergency to inpatient care is not a post-discharge admission. Exclude the same episode of care and consider death as a competing event.",
  },
  medication: {
    tab: "Post-discharge dispensing",
    question: "Was the target medication dispensed within 7 days after a heart-failure discharge?",
    cohort: "Adults discharged alive from a DAD admission that meets a validated case definition.",
    timeline: "Index: discharge date → Follow-up: days 0–7 → Outcome: target medication dispensed in PIN.",
    roles: [
      "DAD: admission and diagnosis",
      "PIN: dispensing event",
      "Registry: eligibility and geography",
    ],
    risk: "Dispensing does not prove medication use, and community-pharmacy records do not fully reflect medications administered in hospital.",
  },
  utilization: {
    tab: "Chronic-disease utilization",
    question: "Has physician-service and emergency use changed over time among people with diabetes?",
    cohort: "Cases identified with a validated multi-year diagnosis algorithm and an adequate look-back period.",
    timeline: "Look-back: 2-year case identification → Annual windows → Measures: services and emergency visits per person-year.",
    roles: [
      "Claims: community services",
      "NACRS: emergency care",
      "DAD: inpatient care",
      "Registry: denominator",
    ],
    risk: "Changes in coding and billing practice can mimic changes in prevalence or utilization; annual denominators must account for migration and death.",
  },
};

const checklistCopyEn = [
  { group: "Before applying", text: "Clearly define whether the purpose is research, quality improvement, planning, or operations, and confirm the applicable approval pathway" },
  { group: "Before applying", text: "Confirm the current data custodian, application route, and available data years" },
  { group: "Before applying", text: "Determine whether approval from a designated Research Ethics Board is required and which agreement applies" },
  { group: "Before applying", text: "Request only the minimum data elements, shortest time period, and smallest cohort needed to answer the question" },
  { group: "Before analysis", text: "Map each concept to data-dictionary fields, coding systems, and versions" },
  { group: "Before analysis", text: "Document the extraction date, refresh lag, site coverage, and system migrations" },
  { group: "During analysis", text: "Work only in the approved secure environment, and do not attempt to re-identify individuals" },
  { group: "During analysis", text: "Quantify missingness, linkage failures, coding changes, and bias arising from population coverage" },
  { group: "Before sharing", text: "Aggregate results as required, apply small-cell suppression rules, and complete any output disclosure review" },
  { group: "Before sharing", text: "Report the data-generation process, limitations in comparability, and uncertainty" },
  { group: "Before sharing", text: "Retain, archive, or destroy the data and derived files as required by the agreement" },
];

const resourceCopyEn = [
  {
    title: "Alberta Interactive Health Data",
    text: "Use public aggregate tables, maps, and dashboards to practise interpreting rates, trends, geographic comparisons, and health inequities.",
  },
  {
    title: "Alberta Open Government",
    text: "Find downloadable public health datasets and publications for practice in data cleaning, citation, and reproducible analysis.",
  },
  {
    title: "CIHI Data Holdings",
    text: "Review the pan-Canadian coverage of holdings such as DAD and NACRS, and use public indicators for interprovincial comparisons.",
  },
  {
    title: "Catalogue of 9 Commonly Used AHS Datasets",
    text: "The starting point for this site: dataset summaries, CHI metadata, and selected data dictionaries.",
  },
  {
    title: "Health data access",
    text: "Review current administrative health-data holdings, application pathways for research and QI, data-specification requirements, and the disclosure process.",
  },
  {
    title: "Requesting AHS Data Resources",
    text: "Learn the requirements for analyst-prepared extracts, direct system access, REB review, and applicable data-disclosure agreements.",
  },
  {
    title: "CIHI Custom Data Request",
    text: "Request customized aggregate or record-level data; record-level analysis generally takes place in CIHI’s Secure Access Environment.",
  },
  {
    title: "Statistics Canada RDCs",
    text: "After project and security approval, use microdata to study social determinants of health and health inequities in Alberta.",
  },
  {
    title: "Health Information Act",
    text: "Understand foundational rules concerning custodians, the minimum-necessary principle, non-identifying health information, disclosure for research, and data matching.",
  },
  {
    title: "ARECCI Decision Support Tools",
    text: "Helps distinguish research, quality improvement, and evaluation; results from the tool do not constitute formal ethics approval.",
  },
];

const glossaryDefinitionsEn: Record<string, string> = {
  "分析粒度": "What one row or analytic unit represents: a person, encounter, stay, service, or test.",
  "指标事件": "The event or date that starts an observation window, such as a discharge.",
  "回溯期": "Time before the index event used to identify history, exposures, or eligibility.",
  "随访期": "Time after the index event during which outcomes are observed.",
  "覆盖度": "How well the data capture the target population, sites, care settings, and years.",
  "报告延迟": "Time from an event to its appearance in an analytic source; not the turnaround time for a data request.",
  "数据联结": "Connecting the same person or event across sources using approved identifiers or keys.",
  "非识别信息": "Information from which identity cannot be readily determined; applicable agreements and risk controls still apply.",
  "研究伦理委员会": "A board that reviews research ethics; REB approval does not itself authorize a data custodian to disclose data.",
  "数据披露协议": "An agreement governing approved purpose, access, retention, disclosure, and destruction of data.",
};

const accessLabelEn: Record<string, string> = {
  开放: "Open",
  申请: "Application required",
  安全环境: "Secure environment",
  指南: "Guidance",
};

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [localeAnnouncement, setLocaleAnnouncement] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [cadence, setCadence] = useState("all");
  const [activeJourney, setActiveJourney] = useState(journeyStops[0].id);
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [activeDeepDiveId, setActiveDeepDiveId] = useState<DeepDive["id"]>(
    deepDives[0].id,
  );
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [checks, setChecks] = useState<boolean[]>(
    checklistItems.map(() => false),
  );

  const isEnglish = locale === "en";
  const tr = (zh: string, en: string) => (isEnglish ? en : zh);
  const lt = (value: LocalizedText) => value[locale];

  useEffect(() => {
    let localeTimer: number | undefined;
    try {
      const stored = window.localStorage.getItem("ah-data-locale");
      if (stored === "zh" || stored === "en") {
        document.documentElement.lang = stored === "en" ? "en-CA" : "zh-CN";
        document.title =
          stored === "en"
            ? "Alberta Health Data Atlas | Bilingual Learning Guide"
            : "Alberta Health Data Atlas｜阿省健康数据学习站";
        localeTimer = window.setTimeout(() => setLocale(stored), 0);
      }
    } catch {
      // The language switch remains usable even when storage is unavailable.
    }
    return () => {
      if (localeTimer !== undefined) window.clearTimeout(localeTimer);
    };
  }, []);

  useEffect(() => {
    let checklistTimer: number | undefined;
    try {
      const stored = window.localStorage.getItem("ah-data-checklist");
      if (stored) {
        const parsed = JSON.parse(stored) as boolean[];
        if (Array.isArray(parsed) && parsed.length === checklistItems.length) {
          checklistTimer = window.setTimeout(() => setChecks(parsed), 0);
        }
      }
    } catch {
      // The checklist remains usable even when storage is unavailable.
    }
    return () => {
      if (checklistTimer !== undefined) window.clearTimeout(checklistTimer);
    };
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return datasets.filter((dataset) => {
      const haystack = [
        dataset.acronym,
        dataset.nameZh,
        dataset.nameEn,
        dataset.settingLabel,
        dataset.summary,
        JSON.stringify(datasetCopyEn[dataset.id] ?? {}),
      ]
        .join(" ")
        .toLowerCase();
      return (
        (!normalized || haystack.includes(normalized)) &&
        (type === "all" || dataset.type === type) &&
        (cadence === "all" || dataset.refreshKey === cadence)
      );
    });
  }, [query, type, cadence]);

  const activeStop =
    journeyStops.find((stop) => stop.id === activeJourney) ?? journeyStops[0];
  const activeStopCopy = isEnglish
    ? (journeyCopyEn[activeStop.id] ?? activeStop)
    : activeStop;
  const activeScenario =
    scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0];
  const activeScenarioCopy = isEnglish
    ? (scenarioCopyEn[activeScenario.id] ?? activeScenario)
    : activeScenario;
  const activeDeepDive =
    deepDives.find((deepDive) => deepDive.id === activeDeepDiveId) ??
    deepDives[0];
  const comparedDatasets = compare
    .map((id) => datasets.find((dataset) => dataset.id === id))
    .filter((dataset): dataset is Dataset => Boolean(dataset));
  const completed = checks.filter(Boolean).length;
  const progress = Math.round((completed / checklistItems.length) * 100);

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    document.documentElement.lang = nextLocale === "en" ? "en-CA" : "zh-CN";
    document.title =
      nextLocale === "en"
        ? "Alberta Health Data Atlas | Bilingual Learning Guide"
        : "Alberta Health Data Atlas｜阿省健康数据学习站";
    setLocaleAnnouncement(
      nextLocale === "en"
        ? "Language changed to English."
        : "语言已切换为中文。",
    );
    try {
      window.localStorage.setItem("ah-data-locale", nextLocale);
    } catch {
      // Local persistence is optional.
    }
  }

  function datasetText(dataset: Dataset): DatasetLocalizedCopy {
    return isEnglish ? datasetCopyEn[dataset.id] : dataset;
  }

  function toggleCompare(id: string) {
    setCompare((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  }

  function toggleCheck(index: number) {
    setChecks((current) => {
      const next = current.map((checked, itemIndex) =>
        itemIndex === index ? !checked : checked,
      );
      try {
        window.localStorage.setItem("ah-data-checklist", JSON.stringify(next));
      } catch {
        // Local persistence is optional.
      }
      return next;
    });
  }

  function resetChecks() {
    const next = checklistItems.map(() => false);
    setChecks(next);
    try {
      window.localStorage.removeItem("ah-data-checklist");
    } catch {
      // Local persistence is optional.
    }
  }

  function openDeepDive(id: DeepDive["id"]) {
    setActiveDeepDiveId(id);
    window.requestAnimationFrame(() => {
      document
        .getElementById("deep-dive")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleDeepDiveKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % deepDives.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + deepDives.length) % deepDives.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = deepDives.length - 1;
    else return;

    event.preventDefault();
    const next = deepDives[nextIndex];
    setActiveDeepDiveId(next.id);
    window.requestAnimationFrame(() => {
      document.getElementById(`deep-dive-tab-${next.id}`)?.focus();
    });
  }

  return (
    <main id="top">
      <a className="skip-link" href="#content">
        {tr("跳到主要内容", "Skip to main content")}
      </a>

      <header className="site-header">
        <a
          className="brand"
          href="#top"
          aria-label={tr("Alberta Health Data Atlas 首页", "Alberta Health Data Atlas home")}
        >
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            <strong>Alberta Health Data Atlas</strong>
            <small>The V Lab · {tr("阿省健康数据学习站", "Bilingual learning guide")}</small>
          </span>
        </a>
        <nav aria-label={tr("主要导航", "Main navigation")}>
          <a href="#journey">{tr("数据旅程", "Data journey")}</a>
          <a href="#catalogue">{tr("数据目录", "Dataset atlas")}</a>
          <a href="#deep-dive">{tr("深度导读", "Deep dives")}</a>
          <a href="#learn">{tr("学习路径", "Learning path")}</a>
          <a href="#responsible">{tr("责任使用", "Responsible use")}</a>
        </nav>
        <div className="header-actions">
          <a
            className="header-github"
            href={GITHUB_REPOSITORY_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={tr(
              "在 GitHub 查看 Alberta Health Data Atlas 项目",
              "View the Alberta Health Data Atlas project on GitHub",
            )}
          >
            <span className="github-long">GitHub</span>
            <span className="github-short" aria-hidden="true">GH</span>
            <span aria-hidden="true">↗</span>
            <span className="sr-only">
              {tr("（在新标签页打开）", "(opens in a new tab)")}
            </span>
          </a>
          <div
            className="language-switch"
            role="group"
            aria-label={tr("语言选择", "Language selection")}
          >
            <button
              type="button"
              lang="zh-CN"
              aria-pressed={locale === "zh"}
              onClick={() => changeLocale("zh")}
            >
              中文
            </button>
            <button
              type="button"
              lang="en"
              aria-pressed={locale === "en"}
              onClick={() => changeLocale("en")}
            >
              EN
            </button>
          </div>
          <a className="header-cta" href="#blueprint">
            {tr("做一个项目蓝图", "Build a blueprint")} <span aria-hidden="true">→</span>
          </a>
        </div>
        <span className="sr-only" aria-live="polite">
          {localeAnnouncement}
        </span>
      </header>

      <div id="content">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              {tr(
                "中英双语导学 · 来源核验至 2026.08.10",
                "Bilingual guide · Sources verified 2026-08-10",
              )}
            </div>
            <h1 id="hero-title">
              {isEnglish ? (
                <>
                  From a research question,
                  <br />
                  to an <span>actionable data plan</span>
                </>
              ) : (
                <>
                  从研究问题，
                  <br />
                  走到<span>可执行的数据方案</span>
                </>
              )}
            </h1>
            <p className="hero-lede">
              {tr(
                "用 9 个常用 Alberta 健康数据集，学会识别数据痕迹、选择来源、设计队列，并负责任地申请与解释健康数据。",
                "Learn to trace, select, combine, request, and responsibly interpret nine commonly used Alberta health datasets.",
              )}
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#journey">
                {tr("从数据旅程开始", "Start with the data journey")} <span aria-hidden="true">→</span>
              </a>
              <a className="button button-ghost" href="#catalogue">
                {tr("浏览 9 个数据集", "Explore 9 datasets")}
              </a>
            </div>
            <div className="hero-disclaimer">
              <span aria-hidden="true">i</span>
              <p>
                <strong>
                  {tr(
                    "这是学习资料，不是数据下载门户。",
                    "This is a learning resource, not a data-download portal.",
                  )}
                </strong>{" "}
                {tr(
                  "本站不提供患者级数据，也不替代数据保管方或机构批准、REB 审查或 HIA 要求。",
                  "It provides no patient-level data and does not replace custodian or institutional approval, REB review, or HIA requirements.",
                )}
              </p>
            </div>
          </div>

          <div
            className="hero-visual"
            aria-label={tr(
              "九个数据集连接成一张数据网络的示意图",
              "Diagram showing nine datasets connected in a data network",
            )}
          >
            <div className="visual-topline">
              <span>ONE CARE JOURNEY</span>
              <span>MANY DATA TRACES</span>
            </div>
            <div className="atlas-grid" aria-hidden="true">
              {datasets.map((dataset, index) => (
                <div
                  className={`atlas-node atlas-node-${index + 1}`}
                  key={dataset.id}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{dataset.acronym}</strong>
                </div>
              ))}
            </div>
            <div className="visual-footer">
              <div>
                <span>{tr("研究问题", "Research question")}</span>
                <strong>{tr("先于数据选择", "comes before data selection")}</strong>
              </div>
              <div className="visual-arrow" aria-hidden="true">
                →
              </div>
              <div>
                <span>{tr("数据生成过程", "Data-generating process")}</span>
                <strong>{tr("先于结果解释", "comes before interpretation")}</strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className="signal-strip"
          aria-label={tr("网站内容概览", "Site overview")}
        >
          <div>
            <strong>09</strong>
            <span>{tr("常用受控数据集", "controlled datasets")}</span>
          </div>
          <div>
            <strong>06</strong>
            <span>{tr("从零到项目的单元", "learning modules")}</span>
          </div>
          <div>
            <strong>03</strong>
            <span>{tr("可直接套用的项目配方", "project recipes")}</span>
          </div>
          <div>
            <strong>01</strong>
            <span>{tr("责任使用检查单", "responsible-use checklist")}</span>
          </div>
        </section>

        <section className="principles section-shell" aria-labelledby="principles-title">
          <div className="section-heading compact-heading">
            <div>
              <span className="section-kicker">
                {tr("先校准三个概念", "Three distinctions to make first")}
              </span>
              <h2 id="principles-title">
                {tr("读数据之前，先读它的边界", "Before reading the data, understand its boundaries")}
              </h2>
            </div>
            <p>
              {tr(
                "这三句话能避免健康行政数据分析中最常见、也最昂贵的误解。",
                "These three distinctions prevent some of the most common—and costly—mistakes in administrative health data analysis.",
              )}
            </p>
          </div>
          <div className="principle-grid">
            <article>
              <span className="principle-no">01</span>
              <h3>{tr("可获得 ≠ 可直接下载", "Available ≠ publicly downloadable")}</h3>
              <p>
                {tr(
                  "9 个核心数据集通常需要研究目的、适用的伦理审查、数据协议和 custodian 批准。开放门户提供的是另一类公开汇总或非识别资源。",
                  "The nine core datasets generally require a defined purpose, relevant ethics review, data agreements, and custodian authorization. Open portals provide a different class of public, aggregated, or non-identifying resources.",
                )}
              </p>
            </article>
            <article>
              <span className="principle-no">02</span>
              <h3>{tr("刷新频率 ≠ 交付时长", "Refresh cadence ≠ delivery time")}</h3>
              <p>
                {tr(
                  "“每日”或“每月”描述源数据或仓库刷新，不代表申请人当天或当月能拿到研究提取。",
                  "“Daily” or “monthly” describes a source system or repository refresh—not when a research extract will be delivered.",
                )}
              </p>
            </article>
            <article>
              <span className="principle-no">03</span>
              <h3>{tr("一条记录 ≠ 一位患者", "One record ≠ one patient")}</h3>
              <p>
                {tr(
                  "一个人可有多次就诊、理赔、检验和配药。先定义分析粒度，才能正确计算人数、事件数和比率。",
                  "One person may have many encounters, claims, tests, and dispensations. Define the analytic grain before counting people, events, or rates.",
                )}
              </p>
            </article>
          </div>
        </section>

        <section className="journey section-shell" id="journey" aria-labelledby="journey-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">{tr("01 · 数据旅程", "01 · DATA JOURNEY")}</span>
              <h2 id="journey-title">
                {tr("一次照护，会在哪里留下数据痕迹？", "Where does one care journey leave data traces?")}
              </h2>
            </div>
            <p>
              {tr(
                "点击旅程节点。学习的关键不是背数据库名称，而是理解每个来源究竟“看见”了什么。",
                "Select a journey stop. The goal is not to memorize database names, but to understand what each source can—and cannot—see.",
              )}
            </p>
          </div>

          <div
            className="journey-map"
            role="group"
            aria-label={tr("照护数据旅程", "Care data journey")}
          >
            {journeyStops.map((stop) => {
              const stopCopy = isEnglish ? (journeyCopyEn[stop.id] ?? stop) : stop;
              return (
                <button
                  className={activeJourney === stop.id ? "active" : ""}
                  key={stop.id}
                  type="button"
                  aria-pressed={activeJourney === stop.id}
                  onClick={() => setActiveJourney(stop.id)}
                >
                  <span className="journey-index">{stop.step}</span>
                  <i aria-hidden="true" />
                  <strong>{stopCopy.label}</strong>
                  <small>{stopCopy.caption}</small>
                </button>
              );
            })}
          </div>

          <div className="journey-detail" aria-live="polite">
            <div className="journey-detail-label">
              <span>{activeStop.step}</span>
              <div>
                <small>{tr("当前节点", "Current stop")}</small>
                <strong>{activeStopCopy.label}</strong>
              </div>
            </div>
            <p>{activeStopCopy.note}</p>
            <div
              className="dataset-pills"
              aria-label={tr("相关数据集", "Related datasets")}
            >
              {activeStop.datasets.map((dataset) => (
                <span key={dataset}>{dataset}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="catalogue-section" id="catalogue" aria-labelledby="catalogue-title">
          <div className="section-shell">
            <div className="section-heading catalogue-heading">
              <div>
                <span className="section-kicker light">
                  {tr("02 · 数据目录", "02 · DATASET ATLAS")}
                </span>
                <h2 id="catalogue-title">
                  {tr("九个数据集，一张可筛选的学习图谱", "Nine datasets. One filterable learning map.")}
                </h2>
              </div>
              <p>
                {tr(
                  "时间范围与更新频率首先展示 CHI 页面口径；带 * 的范围必须在正式申请前向当前 custodian 再核对。",
                  "Date ranges and refresh cadences initially reflect the CHI catalogue. Verify every range marked * with the current custodian before submitting a request.",
                )}
              </p>
            </div>

            <div className="catalogue-toolbar">
              <label className="search-field">
                <span>{tr("搜索数据集", "Search datasets")}</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={tr("输入 DAD、药房、急诊…", "Try DAD, pharmacy, emergency…")}
                />
              </label>
              <label>
                <span>{tr("数据类型", "Data type")}</span>
                <select value={type} onChange={(event) => setType(event.target.value)}>
                  <option value="all">{tr("全部类型", "All types")}</option>
                  <option value="行政数据">{tr("行政数据", "Administrative data")}</option>
                  <option value="临床信息系统">
                    {tr("临床信息系统", "Clinical information system")}
                  </option>
                </select>
              </label>
              <label>
                <span>{tr("更新节奏", "Refresh cadence")}</span>
                <select
                  value={cadence}
                  onChange={(event) => setCadence(event.target.value)}
                >
                  <option value="all">{tr("全部节奏", "All cadences")}</option>
                  <option value="daily">{tr("每日", "Daily")}</option>
                  <option value="weekly">{tr("每周", "Weekly")}</option>
                  <option value="monthly">{tr("每月", "Monthly")}</option>
                  <option value="quarterly">{tr("每季", "Quarterly")}</option>
                  <option value="annual">{tr("每年", "Annual")}</option>
                </select>
              </label>
              <div className="result-count" aria-live="polite">
                <strong>{String(filtered.length).padStart(2, "0")}</strong>
                <span>
                  {isEnglish
                    ? `${filtered.length === 1 ? "result" : "results"}`
                    : "个结果"}
                </span>
              </div>
            </div>

            <div className="dataset-grid">
              {filtered.map((dataset) => {
                const selected = compare.includes(dataset.id);
                const atLimit = compare.length >= 3 && !selected;
                const copy = datasetText(dataset);
                const deepDive = deepDives.find(
                  (item) => item.id === dataset.id,
                );
                return (
                  <article className="dataset-card" key={dataset.id}>
                    <div className="dataset-card-top">
                      <span className="dataset-number">
                        {String(datasets.indexOf(dataset) + 1).padStart(2, "0")}
                      </span>
                      <div className="dataset-badges">
                        <span>
                          {dataset.type === "行政数据"
                            ? tr("行政数据", "Administrative data")
                            : tr("临床信息系统", "Clinical information system")}
                        </span>
                        {dataset.legacy && <span className="legacy-badge">LEGACY</span>}
                      </div>
                    </div>
                    <div className="dataset-title-row">
                      <div className="dataset-acronym">{dataset.acronym}</div>
                      <button
                        className={selected ? "compare-button selected" : "compare-button"}
                        type="button"
                        disabled={atLimit}
                        aria-pressed={selected}
                        onClick={() => toggleCompare(dataset.id)}
                        title={
                          atLimit
                            ? tr("最多比较 3 个数据集", "Compare up to 3 datasets")
                            : undefined
                        }
                      >
                        <span aria-hidden="true">{selected ? "✓" : "+"}</span>
                        {selected ? tr("已加入", "Added") : tr("比较", "Compare")}
                      </button>
                    </div>
                    <h3 lang={isEnglish ? "en" : "zh-CN"}>
                      {isEnglish ? dataset.nameEn : dataset.nameZh}
                    </h3>
                    <p
                      className="dataset-en"
                      lang={isEnglish ? "zh-CN" : "en"}
                    >
                      {isEnglish ? dataset.nameZh : dataset.nameEn}
                    </p>
                    <p className="dataset-summary">{copy.summary}</p>
                    <div className="dataset-facts">
                      <div>
                        <span>{tr("照护场景", "Care setting")}</span>
                        <strong>{copy.settingLabel}</strong>
                      </div>
                      <div>
                        <span>{tr("来源覆盖", "Source coverage")}</span>
                        <strong>{copy.coverage}</strong>
                      </div>
                      <div>
                        <span>{tr("刷新口径", "Refresh note")}</span>
                        <strong>{copy.refresh}</strong>
                      </div>
                      <div>
                        <span>{tr("典型粒度", "Typical grain")}</span>
                        <strong>{copy.grain}</strong>
                      </div>
                    </div>
                    <div className="caveat-line">
                      <span aria-hidden="true">!</span>
                      <p>{copy.caveat}</p>
                    </div>
                    <details>
                      <summary>
                        {tr("展开学习笔记", "Open learning notes")} <span aria-hidden="true">＋</span>
                      </summary>
                      <div className="dataset-notes">
                        <div>
                          <span>{tr("适合回答", "Good for questions such as")}</span>
                          <ul>
                            {copy.questions.map((question) => (
                              <li key={question}>{question}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span>{tr("常见联结", "Common linkages")}</span>
                          <p>{copy.linkage}</p>
                        </div>
                        <div className="audit-note">
                          <span>{tr("来源审计", "Source check")}</span>
                          <p>{copy.audit}</p>
                        </div>
                      </div>
                    </details>
                    <div className="dataset-links">
                      {deepDive && (
                        <button
                          className="dataset-deep-link"
                          type="button"
                          onClick={() => openDeepDive(deepDive.id)}
                        >
                          {tr("深度导读与案例", "Deep dive & examples")} {" "}
                          <span aria-hidden="true">→</span>
                        </button>
                      )}
                      <a href={`#dictionary-${dataset.id}`}>
                        {tr("中英字典解读", "Bilingual dictionary guide")} {" "}
                        <span aria-hidden="true">↓</span>
                      </a>
                      <a href={dataset.sourceUrl} target="_blank" rel="noreferrer">
                        {tr("CHI 来源", "CHI source")} <ArrowIcon />
                        <span className="sr-only">
                          {tr("（在新标签页打开）", "(opens in a new tab)")}
                        </span>
                      </a>
                      {dataset.dictionaryUrl && (
                        <a href={dataset.dictionaryUrl} target="_blank" rel="noreferrer">
                          {tr("字段字典", "Data dictionary")} <ArrowIcon />
                          <span className="sr-only">
                            {tr("（在新标签页打开）", "(opens in a new tab)")}
                          </span>
                        </a>
                      )}
                      {dataset.auditUrl && (
                        <a href={dataset.auditUrl} target="_blank" rel="noreferrer">
                          {tr("核验来源", "Verification source")} <ArrowIcon />
                          <span className="sr-only">
                            {tr("（在新标签页打开）", "(opens in a new tab)")}
                          </span>
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="empty-state">
                <strong>{tr("没有匹配的数据集", "No datasets match")}</strong>
                <p>
                  {tr(
                    "试试清空关键词，或把筛选改回“全部”。",
                    "Clear the search or return the filters to “All.”",
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setType("all");
                    setCadence("all");
                  }}
                >
                  {tr("重置筛选", "Reset filters")}
                </button>
              </div>
            )}
          </div>
        </section>

        {compare.length > 0 && (
          <div className="compare-dock" aria-live="polite">
            <div>
              <span className="compare-count">{compare.length}/3</span>
              <div>
                <strong>{tr("比较栏", "Comparison tray")}</strong>
                <span>{comparedDatasets.map((dataset) => dataset.acronym).join(" · ")}</span>
              </div>
            </div>
            <div className="compare-dock-actions">
              <button type="button" onClick={() => setCompare([])}>
                {tr("清空", "Clear")}
              </button>
              <button
                className="compare-open"
                type="button"
                onClick={() => setShowCompare((current) => !current)}
              >
                {showCompare
                  ? tr("收起比较", "Hide comparison")
                  : tr("打开比较", "Open comparison")}
              </button>
            </div>
          </div>
        )}

        {showCompare && comparedDatasets.length > 0 && (
          <section className="comparison section-shell" id="comparison" aria-labelledby="comparison-title">
            <div className="section-heading compact-heading">
              <div>
                <span className="section-kicker">
                  {tr("数据集对照", "Dataset comparison")}
                </span>
                <h2 id="comparison-title">
                  {tr("把“能看见什么”放在一起比较", "Compare what each source can actually see")}
                </h2>
              </div>
              <p>
                {tr(
                  "比较不是为了选一个赢家，而是判断哪些来源需要共同回答问题。",
                  "The goal is not to pick a winner, but to identify which sources must work together.",
                )}
              </p>
            </div>
            <div
              className="comparison-table"
              role="table"
              aria-label={tr("已选择数据集比较", "Selected dataset comparison")}
            >
              <div className="comparison-row comparison-head" role="row">
                <span role="columnheader">{tr("维度", "Dimension")}</span>
                {comparedDatasets.map((dataset) => (
                  <div role="columnheader" key={dataset.id}>
                    <strong>{dataset.acronym}</strong>
                  </div>
                ))}
              </div>
              {([
                [tr("看见的场景", "Observed setting"), "settingLabel"],
                [tr("典型粒度", "Typical grain"), "grain"],
                [tr("覆盖口径", "Coverage basis"), "coverage"],
                [tr("刷新口径", "Refresh note"), "refresh"],
                [tr("关键限制", "Key limitation"), "caveat"],
              ] as Array<[string, keyof DatasetLocalizedCopy]>).map(([label, field]) => (
                <div className="comparison-row" role="row" key={field}>
                  <span role="rowheader">{label}</span>
                  {comparedDatasets.map((dataset) => (
                    <p role="cell" key={dataset.id}>
                      {datasetText(dataset)[field] as string}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        <section
          className="dictionary-library"
          id="dictionaries"
          aria-labelledby="dictionary-library-title"
        >
          <div className="section-shell">
            <div className="section-heading dictionary-heading">
              <div>
                <span className="section-kicker">
                  {tr("资料库 · DATA DICTIONARIES", "LIBRARY · DATA DICTIONARIES")}
                </span>
                <h2 id="dictionary-library-title">
                  {tr(
                    "先读字段，再写数据规格",
                    "Read the fields before writing the data specification",
                  )}
                </h2>
              </div>
              <p>
                {tr(
                  "字段字典不是字段购物清单。先确认一行代表什么，再检查标识、时间、代码、重复字段和缺失规则。",
                  "A data dictionary is not a shopping list. First establish what one row represents, then inspect identifiers, timing, codes, repeating elements, and missing-value rules.",
                )}
              </p>
            </div>

            <aside className="dictionary-library-note">
              <span className="dictionary-note-mark" aria-hidden="true">i</span>
              <p>
                {tr(
                  "这里收录原创中英文解读，并直接链接 CHI 的 7 份公开工作簿。UCalgary 未为这些文件提供开放再分发许可，因此本项目不镜像原始 XLSX；SCM 与 Connect Care 则标为申请型项目规格。",
                  "This library provides original bilingual interpretation and links directly to seven public CHI workbooks. UCalgary does not provide an open redistribution licence for these files, so this project does not mirror the XLSX originals. SCM and Connect Care are labelled as request-specific specifications.",
                )}
              </p>
              <div className="dictionary-library-stats" aria-label={tr("字典状态统计", "Dictionary status totals")}>
                <span>{tr("07 · 官方直链", "07 · OFFICIAL LINKS")}</span>
                <span>{tr("02 · 申请型规格", "02 · REQUEST-SPECIFIC")}</span>
              </div>
            </aside>

            <ul className="dictionary-grid">
              {dictionaryGuides.map((guide, index) => {
                const dataset = datasets.find((item) => item.id === guide.datasetId);
                if (!dataset) return null;
                return (
                  <li key={guide.datasetId}>
                    <article
                      className={`dictionary-card dictionary-card-${guide.status}`}
                      id={`dictionary-${guide.datasetId}`}
                      aria-labelledby={`dictionary-title-${guide.datasetId}`}
                    >
                      <div className="dictionary-card-top">
                        <span className="dictionary-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={`dictionary-status status-${guide.status}`}>
                          <i aria-hidden="true" />
                          {lt(dictionaryStatusCopy[guide.status])}
                        </span>
                      </div>

                      <div className="dictionary-card-title">
                        <strong>{dataset.acronym}</strong>
                        <div>
                          <h3 id={`dictionary-title-${guide.datasetId}`}>
                            {isEnglish ? dataset.nameEn : dataset.nameZh}
                          </h3>
                          <p lang={isEnglish ? "zh-CN" : "en"}>
                            {isEnglish ? dataset.nameZh : dataset.nameEn}
                          </p>
                        </div>
                      </div>

                      <dl className="dictionary-card-facts">
                        <div>
                          <dt>{tr("典型粒度", "Typical grain")}</dt>
                          <dd>{lt(guide.grain)}</dd>
                        </div>
                        <div>
                          <dt>{tr("工作簿结构", "Workbook structure")}</dt>
                          <dd>{lt(guide.workbook)}</dd>
                        </div>
                      </dl>

                      <p className="dictionary-scope">{lt(guide.scope)}</p>

                      <div
                        className="dictionary-concepts"
                        aria-label={tr("核心字段组", "Core field groups")}
                      >
                        {guide.concepts.map((concept) => (
                          <section key={concept.title.en}>
                            <h4>{lt(concept.title)}</h4>
                            {concept.fields && <code>{concept.fields}</code>}
                            <p>{lt(concept.note)}</p>
                          </section>
                        ))}
                      </div>

                      <details className="dictionary-details">
                        <summary>
                          <span>{tr("如何读这份字典", "How to read this dictionary")}</span>
                          <i aria-hidden="true">＋</i>
                        </summary>
                        <div className="dictionary-reading-guide">
                          <section>
                            <h4>{tr("建议步骤", "Suggested reading steps")}</h4>
                            <ol>
                              {guide.reading.map((item) => (
                                <li key={item.en}>{lt(item)}</li>
                              ))}
                            </ol>
                          </section>
                          <section className="dictionary-caution">
                            <h4>{tr("不要直接假定", "Do not assume")}</h4>
                            <ul>
                              {guide.cautions.map((item) => (
                                <li key={item.en}>{lt(item)}</li>
                              ))}
                            </ul>
                          </section>
                        </div>
                      </details>

                      <div className="dictionary-actions">
                        {guide.officialUrl ? (
                          <a
                            className="dictionary-download"
                            href={guide.officialUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span>
                              {tr("打开官方工作簿", "Open official workbook")}
                              <small>{guide.officialFile}</small>
                            </span>
                            <ArrowIcon />
                            <span className="sr-only">
                              {tr("（在新标签页打开）", "(opens in a new tab)")}
                            </span>
                          </a>
                        ) : (
                          <div className="dictionary-no-public">
                            <strong>
                              {tr("没有公开字段工作簿链接", "No public field workbook is linked")}
                            </strong>
                            <p>
                              {tr(
                                "这不表示数据不可申请。请索取当前项目的数据元素清单、实体关系、值集与版本说明。",
                                "This does not mean the data cannot be requested. Ask for the current element list, entity relationships, value sets, and version notes.",
                              )}
                            </p>
                            {guide.requestUrl && (
                              <a href={guide.requestUrl} target="_blank" rel="noreferrer">
                                {tr("查看申请说明", "View request guidance")} <ArrowIcon />
                              </a>
                            )}
                          </div>
                        )}
                        <a
                          className="dictionary-guide-link"
                          href={`${DICTIONARY_GUIDE_BASE}/${guide.guideFile}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {tr("阅读 GitHub 中英解读", "Read the bilingual guide on GitHub")} <ArrowIcon />
                          <span className="sr-only">
                            {tr("（在新标签页打开）", "(opens in a new tab)")}
                          </span>
                        </a>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>

            <div className="dictionary-source-note">
              <p>
                {tr(
                  "来源核验：2026-08-10。7 份工作簿的内部修改日期均为 2020-08-21，可能早于当前目录；字段、年份、代码表与缺失规则必须向当前 custodian 重核。",
                  "Sources verified August 10, 2026. All seven workbooks carry an internal modified date of August 21, 2020 and may predate the current catalogue; reconfirm fields, years, code sets, and missing-value rules with the current custodian.",
                )}
              </p>
              <div>
                <a href={CATALOGUE_URL} target="_blank" rel="noreferrer">
                  {tr("CHI 数据目录", "CHI dataset catalogue")} <ArrowIcon />
                </a>
                <a href={UCALGARY_TERMS_URL} target="_blank" rel="noreferrer">
                  {tr("UCalgary 使用条款", "UCalgary terms of use")} <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`deep-dives deep-dives-${activeDeepDive.id}`}
          id="deep-dive"
          aria-labelledby="deep-dive-title"
        >
          <div className="section-shell">
            <div className="section-heading deep-dive-heading">
              <div>
                <span className="section-kicker">
                  {tr(
                    "专题 · 核心数据集深度导读",
                    "FEATURE · CORE DATASET DEEP DIVES",
                  )}
                </span>
                <h2 id="deep-dive-title">
                  {tr(
                    "不只知道它叫什么，还要知道一条记录能回答什么",
                    "Go beyond the name: learn what one record can answer",
                  )}
                </h2>
              </div>
              <p>
                {tr(
                  "选择 DAD、NACRS 或 PIN，查看字段地图、合成记录、两个完整研究案例，以及最容易误读的地方。",
                  "Choose DAD, NACRS, or PIN to explore a field map, a synthetic record, two complete research examples, and the most common interpretation traps.",
                )}
              </p>
            </div>

            <div
              className="deep-dive-tabs"
              role="tablist"
              aria-label={tr("核心数据集深度导读", "Core dataset deep dives")}
            >
              {deepDives.map((deepDive, index) => (
                <button
                  id={`deep-dive-tab-${deepDive.id}`}
                  key={deepDive.id}
                  type="button"
                  role="tab"
                  aria-selected={activeDeepDive.id === deepDive.id}
                  aria-controls="deep-dive-panel"
                  tabIndex={activeDeepDive.id === deepDive.id ? 0 : -1}
                  className={activeDeepDive.id === deepDive.id ? "active" : ""}
                  onClick={() => setActiveDeepDiveId(deepDive.id)}
                  onKeyDown={(event) => handleDeepDiveKeyDown(event, index)}
                >
                  <strong>{deepDive.acronym}</strong>
                  <span>{lt(deepDive.context)}</span>
                </button>
              ))}
            </div>

            <article
              className="deep-dive-panel"
              id="deep-dive-panel"
              role="tabpanel"
              aria-labelledby={`deep-dive-tab-${activeDeepDive.id}`}
            >
              <header className="deep-dive-hero">
                <div className="deep-dive-intro">
                  <span className="deep-dive-overline">DATASET DEEP DIVE</span>
                  <div className="deep-dive-name">
                    <strong>{activeDeepDive.acronym}</strong>
                    <div>
                      <h3>{lt(activeDeepDive.name)}</h3>
                      <span>{lt(activeDeepDive.context)}</span>
                    </div>
                  </div>
                  <p>{lt(activeDeepDive.intro)}</p>
                </div>
                <dl className="deep-dive-facts">
                  {activeDeepDive.facts.map((fact) => (
                    <div key={fact.label.en}>
                      <dt>{lt(fact.label)}</dt>
                      <dd>{lt(fact.value)}</dd>
                    </div>
                  ))}
                </dl>
              </header>

              <section className="record-trace" aria-labelledby="record-trace-title">
                <div className="deep-subheading">
                  <span>01</span>
                  <div>
                    <small>{tr("记录是怎样形成的", "How the record is formed")}</small>
                    <h3 id="record-trace-title">
                      {tr("把一条记录放回照护流程", "Put one record back into the care process")}
                    </h3>
                  </div>
                </div>
                <ol>
                  {activeDeepDive.trace.map((step, index) => (
                    <li key={step.en}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{lt(step)}</strong>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="field-map" aria-labelledby="field-map-title">
                <div className="deep-subheading">
                  <span>02</span>
                  <div>
                    <small>{tr("字段地图", "Field map")}</small>
                    <h3 id="field-map-title">
                      {tr("先按概念组理解，再回到字典选字段", "Understand concept groups before choosing fields")}
                    </h3>
                  </div>
                  <p>
                    {tr(
                      "以下是教学导读，不是最终数据规格。字段可用性、名称与规则必须以当前申请字典为准。",
                      "This is a teaching map, not a final data specification. Confirm field availability, names, and rules in the current request dictionary.",
                    )}
                  </p>
                </div>
                <div className="field-map-grid">
                  {activeDeepDive.fieldGroups.map((group, index) => (
                    <article key={group.title.en}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <h4>{lt(group.title)}</h4>
                      <code>{group.fields}</code>
                      <p>{lt(group.description)}</p>
                    </article>
                  ))}
                </div>
              </section>

              <div className="visibility-grid">
                <section className="visibility-card sees" aria-labelledby="captures-title">
                  <span aria-hidden="true">✓</span>
                  <div>
                    <small>{tr("它能看见", "What it captures")}</small>
                    <h3 id="captures-title">
                      {tr("适合用它回答", "Questions it can support")}
                    </h3>
                    <ul>
                      {activeDeepDive.captures.map((item) => (
                        <li key={item.en}>{lt(item)}</li>
                      ))}
                    </ul>
                  </div>
                </section>
                <section className="visibility-card misses" aria-labelledby="blind-spots-title">
                  <span aria-hidden="true">×</span>
                  <div>
                    <small>{tr("它看不见", "What it does not capture")}</small>
                    <h3 id="blind-spots-title">
                      {tr("需要其他来源或更谨慎表述", "Where another source or wording is needed")}
                    </h3>
                    <ul>
                      {activeDeepDive.blindSpots.map((item) => (
                        <li key={item.en}>{lt(item)}</li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>

              <section className="synthetic-record" aria-labelledby="synthetic-record-title">
                <div className="deep-subheading">
                  <span>03</span>
                  <div>
                    <small>{tr("合成记录示例", "Synthetic record example")}</small>
                    <h3 id="synthetic-record-title">
                      {tr("把几个字段拼成一个可读事件", "Turn a field bundle into a readable event")}
                    </h3>
                  </div>
                  <p>
                    {tr(
                      "完全虚构，仅用于解释结构；不是患者数据，也不代表正式代码值。",
                      "Entirely fictional and shown only to explain structure. This is not patient data and does not represent official coded values.",
                    )}
                  </p>
                </div>
                <div className="synthetic-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">{tr("字段", "Field")}</th>
                        <th scope="col">{tr("示例值", "Example value")}</th>
                        <th scope="col">{tr("读法", "Interpretation")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeDeepDive.sample.map((row) => (
                        <tr key={row.field}>
                          <th scope="row"><code>{row.field}</code></th>
                          <td>{lt(row.value)}</td>
                          <td>{lt(row.meaning)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="deep-examples" aria-labelledby="deep-examples-title">
                <div className="deep-subheading">
                  <span>04</span>
                  <div>
                    <small>{tr("研究案例", "Research examples")}</small>
                    <h3 id="deep-examples-title">
                      {tr("从问题走到可执行的分析框架", "From a question to an executable analysis frame")}
                    </h3>
                  </div>
                  <p>
                    {tr(
                      "案例展示设计逻辑，不是现成 protocol；疾病算法、代码表与排除规则仍需正式验证。",
                      "These examples show design logic, not a ready-made protocol. Disease algorithms, code lists, and exclusions still require formal validation.",
                    )}
                  </p>
                </div>
                <div className="deep-example-grid">
                  {activeDeepDive.examples.map((example, exampleIndex) => (
                    <article key={example.title.en}>
                      <div className="example-card-top">
                        <span>{String(exampleIndex + 1).padStart(2, "0")}</span>
                        <small>{lt(example.title)}</small>
                      </div>
                      <h4>{lt(example.question)}</h4>
                      <dl>
                        {example.design.map((item) => (
                          <div key={item.label.en}>
                            <dt>{lt(item.label)}</dt>
                            <dd>{lt(item.value)}</dd>
                          </div>
                        ))}
                      </dl>
                      <div className="example-takeaway">
                        <span aria-hidden="true">→</span>
                        <div>
                          <small>{tr("设计重点", "Design takeaway")}</small>
                          <p>{lt(example.takeaway)}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <div className="pitfalls-sources-grid">
                <section className="deep-pitfalls" aria-labelledby="deep-pitfalls-title">
                  <div className="deep-subheading">
                    <span>05</span>
                    <div>
                      <small>{tr("解释陷阱", "Interpretation traps")}</small>
                      <h3 id="deep-pitfalls-title">
                        {tr("分析前先排除这五种误读", "Rule out these five misreadings before analysis")}
                      </h3>
                    </div>
                  </div>
                  <ol>
                    {activeDeepDive.pitfalls.map((pitfall, index) => (
                      <li key={pitfall.en}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <p>{lt(pitfall)}</p>
                      </li>
                    ))}
                  </ol>
                </section>
                <aside className="deep-sources" aria-labelledby="deep-sources-title">
                  <span className="aside-label">
                    {tr("继续核验", "Continue with the source")}
                  </span>
                  <h3 id="deep-sources-title">
                    {tr("打开当前官方资料", "Open the current official material")}
                  </h3>
                  <p>
                    {tr(
                      "字段、覆盖、编码与申请流程会更新。正式设计时，请回到这些入口确认。",
                      "Fields, coverage, coding, and access processes change. Reconfirm them at these sources when finalizing a study.",
                    )}
                  </p>
                  <div>
                    {activeDeepDive.sources.map((source) => (
                      <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                        <span>{lt(source.label)}</span>
                        <ArrowIcon />
                        <span className="sr-only">
                          {tr("（在新标签页打开）", "(opens in a new tab)")}
                        </span>
                      </a>
                    ))}
                  </div>
                  <small>
                    {tr(
                      "资料核验：2026-08-10 · CHI 链接字典是规划起点，文件可能早于当前目录；教学内容不替代 custodian 数据规格。",
                      "Sources verified: 2026-08-10 · CHI-linked workbooks are planning aids and may predate the current catalogue; this teaching content does not replace custodian specifications.",
                    )}
                  </small>
                </aside>
              </div>
            </article>
          </div>
        </section>

        <section className="learn section-shell" id="learn" aria-labelledby="learn-title">
          <div className="section-heading">
            <div>
              <span className="section-kicker">
                {tr("03 · 学习路径", "03 · LEARNING PATH")}
              </span>
              <h2 id="learn-title">
                {tr(
                  "从“看懂一行”，到设计完整队列",
                  "From reading one row to designing a cohort",
                )}
              </h2>
            </div>
            <p>
              {tr(
                "六个单元按项目真实顺序排列。你可以顺序学习，也可以直接跳到当前卡住的步骤。",
                "Six modules follow the real sequence of a project. Work through them in order or jump directly to the step where you are stuck.",
              )}
            </p>
          </div>
          <div className="lesson-list">
            {lessons.map((lesson) => {
              const lessonCopy = isEnglish
                ? (lessonCopyEn[lesson.no] ?? lesson)
                : lesson;
              return (
                <article key={lesson.no}>
                  <div className="lesson-meta">
                    <span>{lesson.no}</span>
                    <small>{lesson.time}</small>
                  </div>
                  <div className="lesson-copy">
                    <h3>{lessonCopy.title}</h3>
                    <p>{lessonCopy.text}</p>
                  </div>
                  <div className="lesson-example">{lessonCopy.example}</div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="blueprint" id="blueprint" aria-labelledby="blueprint-title">
          <div className="section-shell blueprint-inner">
            <div className="blueprint-intro">
              <span className="section-kicker light">
                {tr("04 · 项目工作台", "04 · PROJECT WORKBENCH")}
              </span>
              <h2 id="blueprint-title">
                {tr(
                  "从问题反推数据，而不是反过来",
                  "Work backward from the question—not forward from the data",
                )}
              </h2>
              <p>
                {tr(
                  "选择一个教学场景，观察同一个问题如何被拆成队列、时间窗、数据集角色与风险检查。",
                  "Choose a teaching scenario to see how one question becomes a cohort, time window, set of dataset roles, and risk check.",
                )}
              </p>
              <div
                className="scenario-tabs"
                role="tablist"
                aria-label={tr("项目场景", "Project scenarios")}
              >
                {scenarios.map((scenario) => {
                  const scenarioCopy = isEnglish
                    ? (scenarioCopyEn[scenario.id] ?? scenario)
                    : scenario;
                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      role="tab"
                      aria-selected={scenarioId === scenario.id}
                      className={scenarioId === scenario.id ? "active" : ""}
                      onClick={() => setScenarioId(scenario.id)}
                    >
                      {scenarioCopy.tab}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="blueprint-card" role="tabpanel" aria-live="polite">
              <div className="blueprint-card-head">
                <span>RESEARCH BLUEPRINT</span>
                <span>
                  {tr("教学示例 · 非数据规格", "Teaching example · Not a data specification")}
                </span>
              </div>
              <h3>{activeScenarioCopy.question}</h3>
              <div className="blueprint-datasets">
                {activeScenario.datasets.map((dataset) => (
                  <span key={dataset}>{dataset}</span>
                ))}
              </div>
              <div className="blueprint-row">
                <span>{tr("队列", "Cohort")}</span>
                <p>{activeScenarioCopy.cohort}</p>
              </div>
              <div className="blueprint-row">
                <span>{tr("时间轴", "Timeline")}</span>
                <p>{activeScenarioCopy.timeline}</p>
              </div>
              <div className="blueprint-row roles-row">
                <span>{tr("数据角色", "Dataset roles")}</span>
                <ul>
                  {activeScenarioCopy.roles.map((role) => (
                    <li key={role}>{role}</li>
                  ))}
                </ul>
              </div>
              <div className="blueprint-risk">
                <span aria-hidden="true">!</span>
                <div>
                  <strong>{tr("首要解释风险", "Primary interpretation risk")}</strong>
                  <p>{activeScenarioCopy.risk}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="responsible section-shell"
          id="responsible"
          aria-labelledby="responsible-title"
        >
          <div className="section-heading responsible-heading">
            <div>
              <span className="section-kicker">
                {tr("05 · 责任使用", "05 · RESPONSIBLE USE")}
              </span>
              <h2 id="responsible-title">
                {tr(
                  "把合规与数据质量放进同一张检查单",
                  "Put compliance and data quality on the same checklist",
                )}
              </h2>
            </div>
            <div
              className="progress-card"
              aria-label={tr(
                `检查单已完成 ${progress}%`,
                `Checklist ${progress}% complete`,
              )}
            >
              <div
                className="progress-ring"
                style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}
              >
                <span>{progress}%</span>
              </div>
              <div>
                <strong>
                  {isEnglish
                    ? `${completed} of ${checklistItems.length} complete`
                    : `${completed} / ${checklistItems.length} 已完成`}
                </strong>
                <button type="button" onClick={resetChecks}>
                  {tr("重置本地进度", "Reset local progress")}
                </button>
              </div>
            </div>
          </div>

          <div className="checklist-layout">
            <div className="checklist">
              {checklistItems.map((item, index) => {
                const checklistCopy = isEnglish
                  ? (checklistCopyEn[index] ?? item)
                  : item;
                return (
                  <label className={checks[index] ? "checked" : ""} key={item.text}>
                    <input
                      type="checkbox"
                      checked={checks[index]}
                      onChange={() => toggleCheck(index)}
                    />
                    <span className="custom-check" aria-hidden="true">
                      {checks[index] ? "✓" : ""}
                    </span>
                    <small>{checklistCopy.group}</small>
                    <strong>{checklistCopy.text}</strong>
                  </label>
                );
              })}
            </div>
            <aside className="responsible-aside">
              <span className="aside-label">
                {tr("记住这个顺序", "Remember this sequence")}
              </span>
              <ol>
                <li>
                  <span>01</span>
                  <div>
                    <strong>{tr("REB / 项目审查", "REB / Project review")}</strong>
                    <p>
                      {tr(
                        "确认研究、QI 或评价的适用途径。",
                        "Confirm the applicable pathway for research, quality improvement (QI), or evaluation.",
                      )}
                    </p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <strong>
                      {tr(
                        "Custodian / 披露授权",
                        "Custodian / Disclosure authorization",
                      )}
                    </strong>
                    <p>
                      {tr(
                        "确认当前 custodian、申请字段、适用协议与安全要求。",
                        "Confirm the current custodian, requested data elements, applicable agreements, and security requirements.",
                      )}
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <strong>
                      {tr("Output / 披露审查", "Output / Disclosure review")}
                    </strong>
                    <p>
                      {tr(
                        "发布前，结果必须符合协议和任何适用的披露控制要求。",
                        "Before release, outputs must meet the agreement and any applicable disclosure-control requirements.",
                      )}
                    </p>
                  </div>
                </li>
              </ol>
              <div className="aside-warning">
                <strong>
                  {tr("审批不是一张通票", "Approval is not a blanket authorization")}
                </strong>
                <p>
                  {tr(
                    "REB 批准、custodian 数据披露授权、系统访问授权与结果披露审查是相关但不同的关卡。",
                    "REB approval, custodian authorization to disclose data, system-access authorization, and output disclosure review are related but separate requirements.",
                  )}
                </p>
              </div>
              <p className="local-note">
                <span aria-hidden="true">●</span>
                {tr(
                  "勾选状态只保存在你的浏览器，不会上传。",
                  "Checklist selections are stored only in your browser and are never uploaded.",
                )}
              </p>
            </aside>
          </div>
        </section>

        <section className="resources" id="resources" aria-labelledby="resources-title">
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  {tr("06 · 权威入口", "06 · AUTHORITATIVE RESOURCES")}
                </span>
                <h2 id="resources-title">
                  {tr(
                    "先用开放数据练手，再进入受控申请",
                    "Start with open data, then move to controlled access",
                  )}
                </h2>
              </div>
              <p>
                {tr(
                  "资源按开放、申请、安全环境与指南分层。名称、custodian 与流程会变化，请始终回到官方入口确认。",
                  "Resources are grouped as open, application-based, secure-environment, and guidance resources. Names, custodians, and processes can change; always confirm current requirements at the official source.",
                )}
              </p>
            </div>
            <div className="resource-grid">
              {resources.map((resource, index) => {
                const resourceCopy = isEnglish
                  ? (resourceCopyEn[index] ?? resource)
                  : resource;
                return (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`resource-card access-${resource.access}`}
                    key={resource.title}
                  >
                    <div>
                      <span>
                        {isEnglish
                          ? (accessLabelEn[resource.access] ?? resource.access)
                          : resource.access}
                      </span>
                      <ArrowIcon />
                    </div>
                    <h3>{resourceCopy.title}</h3>
                    <small>{resource.org}</small>
                    <p>{resourceCopy.text}</p>
                    <span className="sr-only">
                      {tr("（在新标签页打开）", "(opens in a new tab)")}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="glossary section-shell" aria-labelledby="glossary-title">
          <div className="section-heading compact-heading">
            <div>
              <span className="section-kicker">
                {tr("随身词典", "POCKET GLOSSARY")}
              </span>
              <h2 id="glossary-title">
                {tr(
                  "十个词，读懂数据申请与论文方法",
                  "Ten terms for reading data requests and methods sections",
                )}
              </h2>
            </div>
            <p>
              {tr(
                "中英文并列，便于继续阅读数据字典、protocol 与官方申请材料。",
                "Chinese and English appear together so you can continue into data dictionaries, protocols, and official application materials.",
              )}
            </p>
          </div>
          <dl className="glossary-grid">
            {glossary.map(([zh, en, definition], index) => (
              <div key={zh}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <dt lang={isEnglish ? "en" : "zh-CN"}>
                  {isEnglish ? en : zh}
                  <small lang={isEnglish ? "zh-CN" : "en"}>
                    {isEnglish ? zh : en}
                  </small>
                </dt>
                <dd>{isEnglish ? glossaryDefinitionsEn[zh] : definition}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="closing section-shell">
          <div>
            <span className="section-kicker light">
              {tr("下一步", "NEXT STEP")}
            </span>
            <h2>
              {tr(
                "带着一个问题，重新浏览这张数据地图。",
                "Return to the atlas with one question in mind.",
              )}
            </h2>
          </div>
          <p>
            {tr(
              "先写清人群、指标事件、结局与时间窗，再比较哪些来源真正留下了所需痕迹。",
              "Define the population, index event, outcome, and time window first—then compare which sources truly contain the traces you need.",
            )}
          </p>
          <a className="button button-cream" href="#catalogue">
            {tr("返回数据目录", "Return to the dataset atlas")} <span aria-hidden="true">↑</span>
          </a>
        </section>
      </div>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <div>
            <strong>Alberta Health Data Atlas</strong>
            <span>
              {tr("The V Lab 出品 · 阿省健康数据学习站", "A learning project by The V Lab")}
            </span>
          </div>
        </div>
        <div className="footer-note">
          <p>
            {tr(
              "独立教育资源。非 Alberta Health Services、Government of Alberta、University of Calgary 或 CIHI 官方网站。内容基于公开元数据；不构成法律、伦理或数据访问建议。",
              "Independent educational resource. This is not an official website of Alberta Health Services, the Government of Alberta, the University of Calgary, or the Canadian Institute for Health Information (CIHI). Content is based on publicly available metadata and does not constitute legal, ethical, or data-access advice.",
            )}
          </p>
          <span>
            {tr(
              "来源最后核验：2026-08-10 · Alberta, Canada",
              "Sources last verified: August 10, 2026 · Alberta, Canada",
            )}
          </span>
        </div>
        <div className="footer-links">
          <a
            className="footer-github"
            href={GITHUB_REPOSITORY_URL}
            target="_blank"
            rel="noreferrer"
          >
            {tr("在 GitHub 查看项目", "View project on GitHub")} <ArrowIcon />
            <span className="sr-only">
              {tr("（在新标签页打开）", "(opens in a new tab)")}
            </span>
          </a>
          <a href={CATALOGUE_URL} target="_blank" rel="noreferrer">
            {tr("核心来源", "Core source")} <ArrowIcon />
            <span className="sr-only">
              {tr("（在新标签页打开）", "(opens in a new tab)")}
            </span>
          </a>
          <a href="https://www.alberta.ca/health-research" target="_blank" rel="noreferrer">
            {tr("当前申请入口", "Current application portal")} <ArrowIcon />
            <span className="sr-only">
              {tr("（在新标签页打开）", "(opens in a new tab)")}
            </span>
          </a>
          <a href="#top">{tr("回到顶部", "Back to top")} ↑</a>
        </div>
      </footer>
    </main>
  );
}
