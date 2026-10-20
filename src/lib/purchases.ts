/**
 * Google Play Billing is intentionally unavailable in the current preview build.
 * The incompatible native dependency was removed to restore Android builds.
 * Never simulate purchases or grant entitlements without Play verification.
 */
export const LIFETIME_SKU = "daily_seasons_lifetime";
export const BILLING_AVAILABLE = false;

export async function initPurchases(): Promise<void> {}
export async function endPurchases(): Promise<void> {}
export async function restorePurchases(): Promise<boolean> { return false; }
export async function purchaseLifetime(): Promise<boolean> { return false; }

/** Days 1–7 of Advent free; day 8+ requires purchase. */
export function isDayPaywalled(adventDay: number, premium: boolean): boolean {
  return !premium && adventDay > 7;
}
