import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the bilingual Alberta Health Data Atlas", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Alberta Health Data Atlas/);
  assert.match(html, /The V Lab/);
  assert.match(html, /阿省健康数据学习站/);
  assert.match(html, /核心数据集深度导读/);
  assert.match(html, /出院摘要数据库/);
  assert.match(html, /PIN Dispenses/);
  assert.match(html, /先读字段，再写数据规格/);
  assert.match(html, /打开官方工作簿/);
  assert.match(html, /没有公开字段工作簿链接/);
  assert.match(html, /在 GitHub 查看项目/);
  assert.equal(
    html.match(
      /href="https:\/\/github\.com\/LaboratoireV\/HealthcareData_Knowledge"/g,
    )?.length,
    2,
  );
  assert.match(html, /这是学习资料，不是数据下载门户/);
});

test("keeps bilingual deep-dive and dictionary content with source metadata", async () => {
  const [page, deepDives, dictionaries, layout, hosting] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/deep-dives.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/dictionary-guides.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Language changed to English/);
  assert.match(page, /deep-dive-tab/);
  assert.match(deepDives, /Discharge Abstract Database/);
  assert.match(deepDives, /National Ambulatory Care Reporting System/);
  assert.match(deepDives, /Pharmaceutical Information Network Dispenses/);
  assert.match(dictionaries, /DAD_elements\.xlsx/);
  assert.match(dictionaries, /NACRS_elements\.xlsx/);
  assert.match(dictionaries, /CLAIMS_Elements\.xlsx/);
  assert.match(dictionaries, /LAB_elements\.xlsx/);
  assert.match(dictionaries, /PIN_elements\.xlsx/);
  assert.match(dictionaries, /VitalStatisticsDeath_elements\.xlsx/);
  assert.match(dictionaries, /Registry_elements\.xlsx/);
  assert.match(dictionaries, /Connect Care/);
  assert.match(layout, /A bilingual guide to nine Alberta health datasets/);
  assert.match(hosting, /project_id/);
});

test("ships nine bilingual dictionary guides without mirroring source workbooks", async () => {
  const guideNames = [
    "dad.md",
    "nacrs.md",
    "claims.md",
    "pld.md",
    "pin.md",
    "vital-statistics-death.md",
    "registry.md",
    "scm.md",
    "connect-care.md",
  ];
  const guides = await Promise.all(
    guideNames.map((name) =>
      readFile(new URL(`../resources/data-dictionaries/${name}`, import.meta.url), "utf8"),
    ),
  );

  for (const guide of guides) {
    assert.match(guide, /中文|数据|字段/);
    assert.match(guide, /English|Field|field|Dataset|dataset/);
    assert.match(guide, /2026-08-10/);
  }

  const manifest = JSON.parse(
    await readFile(
      new URL("../resources/data-dictionaries/source-manifest.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(manifest.files.length, 7);
  assert.equal(manifest.verified_at, "2026-08-10");
  assert.match(manifest.redistribution_note, /not mirrored/i);
});
