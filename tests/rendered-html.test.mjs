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
  assert.match(html, /阿省健康数据学习站/);
  assert.match(html, /核心数据集深度导读/);
  assert.match(html, /出院摘要数据库/);
  assert.match(html, /PIN Dispenses/);
  assert.match(html, /这是学习资料，不是数据下载门户/);
});

test("keeps bilingual deep-dive content and source metadata in the project", async () => {
  const [page, deepDives, layout, hosting] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/deep-dives.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Language changed to English/);
  assert.match(page, /deep-dive-tab/);
  assert.match(deepDives, /Discharge Abstract Database/);
  assert.match(deepDives, /National Ambulatory Care Reporting System/);
  assert.match(deepDives, /Pharmaceutical Information Network Dispenses/);
  assert.match(layout, /A bilingual guide to nine Alberta health datasets/);
  assert.match(hosting, /project_id/);
});
