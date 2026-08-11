# Alberta Health Data Atlas

中英双语的 Alberta 健康数据学习网站，围绕 9 个常用行政健康数据集与临床信息系统，帮助学习者理解数据生成过程、字段范围、队列设计、数据联结、申请路径与责任使用。

A bilingual learning website for understanding commonly used Alberta administrative health datasets and clinical information systems, with practical guidance on data-generating processes, fields, cohort design, linkage, access, and responsible use.

## Live site

https://alberta-health-data-atlas.tigerdogai.chatgpt.site

## Highlights

- 中文 / English 全站切换并在浏览器中保存语言选择
- 9 个 Alberta 健康数据集的可筛选学习图谱
- DAD、NACRS 与 PIN Dispenses 深度导读
- 字段地图、完全虚构的记录示例与研究设计案例
- 数据集比较、项目蓝图与责任使用检查清单
- 官方来源、申请入口与中英术语表
- 响应式布局、键盘操作与无障碍标签

## Core sources

- [UCalgary Centre for Health Informatics — AHS Datasets](https://cumming.ucalgary.ca/centres/centre-health-informatics/data-and-analytic-services/data-resources/ahs-datasets)
- [Government of Alberta — Health data access](https://www.alberta.ca/health-research)
- [CIHI — Discharge Abstract Database metadata](https://www.cihi.ca/en/discharge-abstract-database-dad-metadata)
- [CIHI — NACRS metadata](https://www.cihi.ca/en/national-ambulatory-care-reporting-system-nacrs-metadata)

The site is an independent educational resource. It does not provide patient-level data and does not replace legal, ethics, custodian, or data-access advice.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Validation

```bash
npm run lint
npm test
```

`npm test` builds the Cloudflare-compatible vinext output and verifies the rendered learning site.

## Project structure

- `app/page.tsx` — main interactive learning experience
- `app/deep-dives.ts` — bilingual DAD, NACRS, and PIN deep-dive content
- `app/globals.css` — design system and responsive styles
- `app/layout.tsx` — metadata and social preview configuration
- `public/` — favicon and social-preview image
- `.openai/hosting.json` — Sites project metadata

## Technology

React 19, TypeScript, vinext, Vite, Tailwind CSS, and Cloudflare Workers-compatible output.
