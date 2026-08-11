# PIN Dispenses field guide / PIN 社区药房配药字段指南

> **Public planning workbook available / 已有公开规划工作簿**  
> This page describes **PIN Dispenses as an analytical asset**, not every feature of the clinical Pharmaceutical Information Network visible in Alberta Netcare. / 本页介绍的是研究与分析资产 **PIN Dispenses**，并不等同于 Alberta Netcare 临床 PIN 的全部功能。

- **Official workbook / 官方工作簿:** [PIN_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/PIN_elements.xlsx)
- **Catalogue availability / 目录可用期:** 2008-01-01 to current / 2008-01-01 至当前
- **Catalogue refresh / 目录刷新:** weekly, about one-week delay / 每周更新，约滞后一周
- **Access / 访问:** controlled application; Alberta Health identifies PIN Dispenses as community-pharmacy data without financial information / 受控申请；Alberta Health 将其描述为不含财务信息的社区药房配药数据
- **Verified / 核验日期:** 2026-08-10

## What one row means / 一行数据代表什么

The natural grain is **one medication-dispensing event**. A new row is generated when a prescription item is dispensed; one prescription may lead to several fills. A populated cancellation date marks a retracted fill. The public common-elements sheet does not list a unique dispense ID or source prescription ID, so required keys and deduplication rules must be confirmed in the approved specification.

自然粒度是 **一次药物配药事件**。每次某处方项目被配出时可形成一条记录，同一处方可产生多次 fill。取消日期表示被撤回的配药。公开常用字段页没有列出唯一 dispense ID 或原始 prescription ID，因此必须在获批规格中确认键值和去重规则。

PIN Dispenses can support longitudinal refill analyses, but an observed dispense does not prove prescribing intent, medication administration, or actual ingestion. Community-pharmacy capture also does not guarantee complete institutional, acute-care, continuing-care, public-health, out-of-province, sample, study-drug, or over-the-counter medication history.

PIN Dispenses 可支持纵向续配分析，但“观察到配药”不能证明开方意图、给药或实际服用。社区药房覆盖也不保证完整捕获机构内、急性照护、持续照护、公共卫生、省外、样品药、研究药或非处方药记录。

## Workbook structure / 工作簿结构

- **4 worksheets / 4 个工作表:** Overview; Commonly requested elements; Reference-DIN; Reference-ATC codes.
- **11 commonly requested elements / 11 个常用申请字段.**
- **50,575 DIN reference rows and 2,547 ATC reference rows / 50,575 条 DIN 与 2,547 条 ATC 参考数据行.** Treat them as the workbook's historical reference snapshot; verify current product status and classification. / 它们是工作簿历史参考快照，须重核当前产品状态与分类。
- The workbook metadata was last modified on 2020-08-21. / 工作簿元数据最后修改于 2020-08-21。

## The 11 common elements / 11 个常用字段

| Field / 字段 | 中文解读 | English interpretation | Analysis note / 分析提示 |
|---|---|---|---|
| `DRUG_DIN` | 加拿大药品识别号，通常为 8 位产品级代码。 | Canadian Drug Identification Number, normally an eight-digit product code. | Store as text to retain leading zeros; freeze the product list and version. / 以文本保存前导零，并冻结产品清单与版本。 |
| `DSPN_AMT_QTY` | 本次实际配出的产品数量。 | Quantity of product dispensed in the event. | It is not a dose without unit, strength, form, and frequency. / 脱离单位、强度、剂型和频率时不等于剂量。 |
| `DSPN_AMT_UNT_MSR_CD` | 配出数量的计量单位代码。 | Unit-of-measure code for the dispensed quantity. | Request the applicable value set. / 应申请相应值集。 |
| `DSPN_CANCEL_DATE` | 被撤回 fill 的取消日期。 | Cancellation date recorded when a fill is retracted. | Define whether cancelled rows are excluded or retained as status history. / 明确排除还是保留为状态历史。 |
| `DSPN_DATE` | 药品被配出的日期。 | Date on which the medication was dispensed. | It is not necessarily the date medication use began. / 不一定是开始服药日期。 |
| `DSPN_DAY_SUPPLY_QTY` | 该次配药预计覆盖的天数。 | Recorded number of days the dispense is expected to cover. | It is an algorithm input, not observed days taken. / 它是算法输入，不是观察到的服药天数。 |
| `DSPN_DAY_SUPPLY_UNT_MSR_CD` | 供应天数单位代码；PIN 中隐含为天。 | Unit code for days supplied; PIN implies days. | Validate missing, zero, and implausible values. / 检查缺失、零值和不合理值。 |
| `RCPT_DOB` | 接受者出生日期。 | Recipient date of birth. | Request only the precision necessary for the approved question. / 只申请研究所需精度。 |
| `RCPT_GENDER_CD` | 源系统的 recipient gender code。 | Source-system recipient gender code. | Do not infer sex assigned at birth or current gender identity. / 不推断出生时性别或当前性别认同。 |
| `RCPT_ULI` | Central Stakeholder Registry 中的患者联结标识。 | Recipient linkage identifier from the Central Stakeholder Registry. | Use only under the approved linkage plan; confirm primary/secondary ULI handling. / 仅按获批方案使用，并确认主/次 ULI 处理。 |
| `SUPP_DRUG_ATC_CODE` | Anatomical Therapeutic Chemical 分类代码。 | Anatomical Therapeutic Chemical classification code. | State the ATC level and freeze the code-list version. / 写明 ATC 层级并冻结代码表版本。 |

## Practical reading order / 实用阅读顺序

1. **Define the medication concept / 定义药物概念:** exact DINs, ingredients, routes, dosage forms, and/or the chosen ATC level. / 明确 DIN、成分、途径、剂型及/或 ATC 层级。
2. **Clean event status / 清理事件状态:** handle `DSPN_CANCEL_DATE`, same-day records, duplicates, and extract reconciliation before counting. / 计数前处理取消、同日记录、重复与提取后续对账。
3. **Define observability / 定义可观察性:** establish Alberta eligibility, migration, death, hospital stays, and settings not captured by community pharmacies. / 明确参保、迁移、死亡、住院期及社区药房未覆盖场景。
4. **Construct supply intervals / 构建供应区间:** only after validating days supplied, units, overlapping fills, stockpiling, switches, and grace periods. / 仅在验证供应天数、单位、重叠 fill、库存累积、换药和宽限期后构建。
5. **Name the endpoint honestly / 准确命名结局:** use “observed dispense” or “refill persistence,” not adherence, unless additional evidence supports adherence. / 使用“观察到配药”或“续配持续性”，除非有更多证据，不直接称依从性。

## Illustrative example 1: post-discharge fill / 合成示例 1：出院后配药

> The 7-day window below is an analytic example, not a clinical recommendation. / 下述 7 天窗口只是分析示例，不是临床建议。

**Question / 问题:** Among adults discharged alive after a DAD hospitalization, what proportion has an eligible community-pharmacy dispense for a target class on days 0–7? / 成人存活出院后，第 0–7 天内在社区药房出现目标药物类别配药的比例是多少？

- Use an approved DAD cohort and DAD discharge date as the index; define transfer handling. / 用获批的 DAD 队列与出院日作索引，并定义转院处理。
- Freeze the DIN/ATC list and exclude or separately classify retracted fills. / 冻结 DIN/ATC 清单，并排除或另行标记撤回 fill。
- Link through the approved person key; use Registry/mortality data to identify loss of observability or early death. / 通过获批个人键链接，并用 Registry/死亡资料识别失去可观察性或早期死亡。
- Valid interpretation: **a post-discharge community dispense was observed in PIN**. / 合理解释：**PIN 中观察到出院后社区配药**。
- Invalid interpretation: the drug was definitely prescribed at discharge or the patient took it. / 不合理解释：出院时一定开方，或患者一定服药。

## Illustrative example 2: refill persistence / 合成示例 2：续配持续性

> A 365-day washout, 30-day grace period, and 180-day horizon are illustrative protocol choices. / 365 天 washout、30 天宽限和 180 天观察期都是示例参数。

- Identify a first eligible non-cancelled target-class dispense after the washout. / 在 washout 后识别首个符合条件且未取消的目标类别配药。
- Construct each interval as `[DSPN_DATE, DSPN_DATE + DSPN_DAY_SUPPLY_QTY - 1]` only after days-supply validation. / 仅在供应天数验证后构建该区间。
- Prespecify carry-forward for early refills, same-day products, ingredient or class switching, hospitalization, migration, and death. / 预先规定提前续配结转、同日产品、成分或类别转换、住院、迁移和死亡的处理。
- Report the result as **community-dispensing-record-supported refill persistence**, not medication-taking adherence. / 结果应称为 **社区配药记录支持的续配持续性**，而非实际服药依从性。

## Major interpretation traps / 主要解读陷阱

- **Dispense ≠ prescription ≠ use / 配药不等于开方或服用.** An absent dispense cannot distinguish not prescribed, not filled, existing supply, direct institutional supply, or missing capture. / 未见配药无法区分未开方、未配药、已有存药、机构直接供药或数据缺失。
- **Care-setting gaps / 场景缺口.** Hospital or continuing-care supply may be absent, so a hospital-period gap is not automatically discontinuation. / 住院或持续照护供药可能缺失，因此住院期空白不自动等于停药。
- **DIN ≠ ATC / DIN 不等于 ATC.** DIN is product-level; ATC is hierarchical and may vary by route, strength, or combination. / DIN 是产品级标识，ATC 是层级分类，并可能随途径、强度或复方变化。
- **Quantity ≠ dose / 数量不等于剂量.** The common list lacks the source prescription frequency needed for many dose calculations. / 常用字段缺少许多剂量计算所需的原始处方频率。
- **Reconciliation and versioning / 对账与版本.** Records and code tables can change; record the extraction date and freeze the analytic version. / 记录与代码表可能变化，应记录提取日期并冻结分析版本。

## Request-design checklist / 数据申请设计清单

- [ ] State the medication definition, DIN/ATC level, versions, index date, washout, follow-up, and allowable switches. / 写明药物定义、DIN/ATC 层级与版本、索引日、washout、随访及允许的换药。
- [ ] Confirm event keys, prescription/refill keys if needed, cancellation handling, duplicates, and reconciliation rules. / 确认事件键、所需处方/续配键、取消处理、重复和对账规则。
- [ ] Specify days-supply cleaning, overlapping-fill carry-forward, grace periods, PRN/taper handling, and sensitivity analyses. / 规定供应天数清理、重叠结转、宽限期、PRN/减量及敏感性分析。
- [ ] Document settings and products that are not reliably captured. / 记录不能稳定捕获的场景与产品。
- [ ] Apply approved controls to ULI, DOB, dates, rare products, prescriber/pharmacy context, and small cells. / 对 ULI、DOB、日期、罕见产品、开方者/药房信息和小单元格执行获批控制。

## Sources and reuse / 来源与复用

- [CHI — AHS datasets catalogue](https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets)
- [CHI — PIN_elements.xlsx](https://cumming.ucalgary.ca/sites/default/files/teams/30/PIN_elements.xlsx)
- [Government of Alberta — Health data access](https://www.alberta.ca/health-research)
- [Alberta Netcare — PIN FAQ](https://www.albertanetcare.ca/learningcentre/PIN-FAQ.htm)
- [Health Canada — Drug Identification Number](https://www.canada.ca/en/health-canada/services/drugs-health-products/drug-products/fact-sheets/drug-identification-number.html)
- [UCalgary Website Terms and Conditions](https://www.ucalgary.ca/website-terms-conditions)

The original XLSX is not mirrored in this repository. Underlying PIN records are controlled health data; the public planning workbook does not authorize data release or redistribution. / 本仓库不镜像原始 XLSX。底层 PIN 记录属于受控健康数据，公开规划工作簿不授权底层数据披露或再分发。

**Content verification date / 内容核验日期:** 2026-08-10.
