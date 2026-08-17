#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const defaultRoot = resolve(scriptDir, "../../../..");
const rootFlag = process.argv.indexOf("--project-root");
const projectRoot = rootFlag >= 0 ? resolve(process.argv[rootFlag + 1]) : defaultRoot;
const homepageRoot = join(projectRoot, "apps/homepage");

const paths = {
  app: join(homepageRoot, "src/BookshelfApp.jsx"),
  css: join(homepageRoot, "src/styles.css"),
  appEntry: join(homepageRoot, "src/App.jsx"),
  homepageHtml: join(homepageRoot, "dist/client/index.html"),
  rootHtml: join(projectRoot, "dist/index.html"),
  publicAssets: join(homepageRoot, "public/assets"),
  homepageDistAssets: join(homepageRoot, "dist/client/assets"),
  rootDistAssets: join(projectRoot, "dist/assets"),
};

const errors = [];
const fail = message => errors.push(message);

for (const [name, path] of Object.entries(paths)) {
  if (name.endsWith("Assets")) continue;
  try { await access(path); } catch { fail(`Missing ${name}: ${path}`); }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const [app, css, appEntry, homepageHtml, rootHtml] = await Promise.all([
  readFile(paths.app, "utf8"),
  readFile(paths.css, "utf8"),
  readFile(paths.appEntry, "utf8"),
  readFile(paths.homepageHtml, "utf8"),
  readFile(paths.rootHtml, "utf8"),
]);

async function readBuiltJavaScript(assetDirectory) {
  const entries = await readdir(assetDirectory);
  const chunks = await Promise.all(
    entries.filter(name => name.endsWith(".js")).map(name => readFile(join(assetDirectory, name), "utf8")),
  );
  return chunks.join("\n");
}

const [homepageJavaScript, rootJavaScript] = await Promise.all([
  readBuiltJavaScript(paths.homepageDistAssets),
  readBuiltJavaScript(paths.rootDistAssets),
]);
const homepageBuild = homepageHtml + homepageJavaScript;
const rootBuild = rootHtml + rootJavaScript;

const start = app.indexOf("export const books = [");
const end = app.indexOf("\n];", start);
if (start < 0 || end < 0) fail("Could not locate the exported books array.");
const booksBlock = app.slice(start, end);
const capture = pattern => [...booksBlock.matchAll(pattern)].map(match => match[1]);
const ids = capture(/\bid:\s*"([^"]+)"/g);
const numbers = capture(/\bnumber:\s*"([^"]+)"/g);
const titles = capture(/\btitle:\s*"([^"]+)"/g);
const localAssets = [...new Set(capture(/(?:artwork|href):\s*"(\/assets\/[^"]+)"/g))];
const pdfAssets = localAssets.filter(asset => asset.toLowerCase().endsWith(".pdf"));

if (!ids.length) fail("No books found.");
if (ids.length !== numbers.length || ids.length !== titles.length) fail(`Field counts differ: ids=${ids.length}, numbers=${numbers.length}, titles=${titles.length}.`);

for (const [label, values] of [["ID", ids], ["number", numbers]]) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length) fail(`Duplicate ${label}: ${[...new Set(duplicates)].join(", ")}`);
}

numbers.forEach((number, index) => {
  const expected = String(index + 1).padStart(2, "0");
  if (number !== expected) fail(`Book ${index + 1} uses ${number}; expected ${expected}.`);
});

for (const asset of localAssets) {
  const relative = asset.replace(/^\/assets\//, "");
  for (const [label, base] of [["public", paths.publicAssets], ["homepage dist", paths.homepageDistAssets], ["root dist", paths.rootDistAssets]]) {
    try { await access(join(base, relative)); } catch { fail(`Missing ${label} asset: ${asset}`); }
  }
}

if (!appEntry.includes("<EmbeddedBookshelf />")) fail("EmbeddedBookshelf is not mounted in App.jsx.");
if (!css.includes("skewY(-18.4349488deg)")) fail("Right page skew invariant is missing.");
if (/\.book-spine\b/.test(css) || /className="book-spine"/.test(app)) fail("A forbidden left spine face is present.");
if (!app.includes("ResizeObserver") || !app.includes('setProperty("--loop-distance"')) fail("Measured responsive loop is missing.");
if (!app.includes('aria-hidden={setIndex !== 0 ? "true" : undefined}')) fail("Clone accessibility hiding is missing.");

if (pdfAssets.length) {
  const hasSafeStaticGuard = /startsWith\(["']data:application\/pdf;base64,/.test(app);
  if (app.includes("window.atob") && !hasSafeStaticGuard) fail("PDF click handler base64-decodes static production paths; add a data-URL guard.");
  if (!app.includes('target={book.format === "pdf" ? "_blank"')) fail("PDF books do not declare a new-tab target.");
}

for (const title of titles) {
  if (!homepageBuild.includes(title) || !rootBuild.includes(title)) fail(`Built output does not contain title: ${title}`);
}

const outputStats = await Promise.all([stat(paths.homepageHtml), stat(paths.rootHtml)]);
const result = {
  ok: errors.length === 0,
  books: ids.length,
  pdfBooks: pdfAssets.length,
  localAssets: localAssets.length,
  homepageHtmlBytes: outputStats[0].size,
  rootHtmlBytes: outputStats[1].size,
  sourceSha256: createHash("sha256").update(app).digest("hex"),
  errors,
};

console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exit(1);
