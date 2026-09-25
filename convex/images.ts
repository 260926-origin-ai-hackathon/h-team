import type { QueryCtx, MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

type Ctx = QueryCtx | MutationCtx;

/** Resolve an image to a URL: Convex File Storage first, remote URL fallback. */
export async function resolveImage(
  ctx: Ctx,
  storageId: Id<"_storage"> | undefined,
  url: string | undefined,
): Promise<string> {
  if (storageId) {
    const stored = await ctx.storage.getUrl(storageId);
    if (stored) return stored;
  }
  return url ?? "";
}

export async function resolveImages(
  ctx: Ctx,
  storageIds: Id<"_storage">[] | undefined,
  urls: string[] | undefined,
): Promise<string[]> {
  const out: string[] = [];
  for (const id of storageIds ?? []) {
    const u = await ctx.storage.getUrl(id);
    if (u) out.push(u);
  }
  return out.length > 0 ? out : (urls ?? []);
}
