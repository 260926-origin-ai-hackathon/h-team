import type { FunctionReturnType } from "convex/server";
import type { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

export type Farmer = FunctionReturnType<typeof api.farmers.list>[number];
export type Product = FunctionReturnType<typeof api.products.byFarmer>[number];
export type CollectionEntry = FunctionReturnType<typeof api.collections.mine>[number];
export type FarmerId = Id<"farmers">;
export type ProductId = Id<"products">;
