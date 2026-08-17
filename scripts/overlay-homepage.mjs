import { cp, mkdir, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const homepageDist = resolve(projectRoot, "apps/homepage/dist/client");
const siteDist = resolve(projectRoot, "dist");

await mkdir(siteDist, { recursive: true });

for (const entry of await readdir(homepageDist, { withFileTypes: true })) {
  if (entry.name === "index.html") continue;
  await cp(resolve(homepageDist, entry.name), resolve(siteDist, entry.name), {
    recursive: entry.isDirectory(),
    force: true,
  });
}

await cp(resolve(homepageDist, "index.html"), resolve(siteDist, "index.html"), {
  force: true,
});
