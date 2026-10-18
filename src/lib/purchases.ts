import { Platform } from "react-native";
import * as RNIap from "react-native-iap";
import { setPremiumUnlocked } from "./storage";

export const LIFETIME_SKU = "daily_seasons_lifetime";

let connectionReady = false;

export async function initPurchases(): Promise<void> {
  if (Platform.OS !== "android") return;
  try {
    await RNIap.initConnection();
    connectionReady = true;
  } catch {
    connectionReady = false;
  }
}

export async function endPurchases(): Promise<void> {
  if (connectionReady) await RNIap.endConnection();
}

export async function restorePurchases(): Promise<boolean> {
  if (Platform.OS !== "android" || !connectionReady) return false;
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
  if (Platform.OS !== "android" || !connectionReady) return false;
  try {
    await RNIap.requestPurchase({ skus: [LIFETIME_SKU] });
    // Never unlock merely because the purchase sheet was opened.\n    // Confirm Google Play ownership after checkout; pending purchases remain locked.\n    return await restorePurchases();
  } catch {
    return false;
  }
}

/** Days 1–7 of Advent free; day 8+ requires purchase. */
export function isDayPaywalled(adventDay: number, premium: boolean): boolean {
  if (premium) return false;
  return adventDay > 7;
}
