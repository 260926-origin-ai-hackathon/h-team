import type { FunctionReturnType } from "convex/server";
import type { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

export type Farmer = FunctionReturnType<typeof api.farmers.list>[number];
export type Product = FunctionReturnType<typeof api.products.byFarmer>[number];
export type Reservation = FunctionReturnType<typeof api.reservations.listMine>[number];
export type Review = FunctionReturnType<typeof api.reviews.byFarmer>[number];
export type FarmerId = Id<"farmers">;
export type ProductId = Id<"products">;
export type ReservationId = Id<"reservations">;
export type ReservationStatus = Reservation["status"];
export type Fulfillment = Reservation["method"];
