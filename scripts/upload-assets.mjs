// Upload demo photos to Convex File Storage and register them by file name (without extension).
// Usage: CONVEX_URL=https://xxx.convex.cloud node scripts/upload-assets.mjs assets/mock/hirose
import { ConvexHttpClient } from "convex/browser";
import { readdirSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { api } from "../convex/_generated/api.js";

const url = process.env.CONVEX_URL ?? process.env.EXPO_PUBLIC_CONVEX_URL;
const dir = process.argv[2];
if (!url || !dir) {
  console.error("usage: CONVEX_URL=<deployment url> node scripts/upload-assets.mjs <dir>");
  process.exit(1);
}
const client = new ConvexHttpClient(url);
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
for (const f of files) {
  const key = basename(f, extname(f));
  const type = /\.png$/i.test(f) ? "image/png" : /\.webp$/i.test(f) ? "image/webp" : "image/jpeg";
  const uploadUrl = await client.mutation(api.assets.generateUploadUrl, {});
  const res = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": type }, body: readFileSync(join(dir, f)) });
  if (!res.ok) throw new Error(`upload failed for ${f}: ${res.status}`);
  const { storageId } = await res.json();
  await client.mutation(api.assets.register, { key, storageId });
  console.log("uploaded", key);
}
console.log(`done: ${files.length} files → ${url}`);
