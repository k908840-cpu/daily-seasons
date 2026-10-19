import { Platform } from "react-native";
import Constants from "expo-constants";

// Expo Go does not contain the native Google Play Billing module.
// Resolve it lazily so the rest of the app can be previewed in Expo Go.
type BillingModule = typeof import("react-native-iap");
let billing: BillingModule | null = null;
function getBilling(): BillingModule | null {
  if (Platform.OS !== "android" || Constants.appOwnership === "expo") return null;
  if (billing) return billing;
  try { billing = require("react-native-iap") as BillingModule; }
  catch { billing = null; }
  return billing;
}
import { setPremiumUnlocked } from "./storage";

export const LIFETIME_SKU = "daily_seasons_lifetime";

let connectionReady = false;

export async function initPurchases(): Promise<void> {
  const RNIap = getBilling();
  if (!RNIap) return;
  try {
    await RNIap.initConnection();
    connectionReady = true;
  } catch {
    connectionReady = false;
  }
}

export async function endPurchases(): Promise<void> {
  const RNIap = getBilling();
  if (connectionReady && RNIap) await RNIap.endConnection();
  connectionReady = false;
}

export async function restorePurchases(): Promise<boolean> {
  const RNIap = getBilling();
  if (!RNIap || !connectionReady) return false;
  try {
    const purchases = await RNIap.getAvailablePurchases();
    const owned = purchases.some((p) => p.productId === LIFETIME_SKU);
    if (owned) await setPremiumUnlocked(true);
    return owned;
  } catch {
    return false;
  }
}

export async function purchaseLifetime(): Promise<boolean> {
  const RNIap = getBilling();
  if (!RNIap || !connectionReady) return false;
  try {
    await RNIap.requestPurchase({ skus: [LIFETIME_SKU] });
    // Never unlock merely because the purchase sheet was opened.
    // Confirm Google Play ownership after checkout; pending purchases remain locked.
    return await restorePurchases();
  } catch {
    return false;
  }
}

/** Days 1–7 of Advent free; day 8+ requires purchase. */
export function isDayPaywalled(adventDay: number, premium: boolean): boolean {
  if (premium) return false;
  return adventDay > 7;
}
