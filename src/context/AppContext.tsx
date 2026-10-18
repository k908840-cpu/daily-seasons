import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import {
  loadSettings,
  saveSettings,
  type UserSettings,
  isPremiumUnlocked,
} from "@/lib/storage";
import { initPurchases, endPurchases, restorePurchases } from "@/lib/purchases";
import { scheduleDailyReminder } from "@/lib/notifications";
import { palette, type ThemeColors } from "@/theme/colors";

interface AppContextValue {
  settings: UserSettings;
  updateSettings: (patch: Partial<UserSettings>) => Promise<void>;
  premium: boolean;
  refreshPremium: () => Promise<void>;
  restore: () => Promise<boolean>;
  colors: ThemeColors;
  isDark: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    void (async () => {
      await initPurchases();
      setSettings(await loadSettings());
      setPremium(await isPremiumUnlocked());
    })();
    return () => {
      void endPurchases();
    };
  }, []);

  const updateSettings = useCallback(async (patch: Partial<UserSettings>) => {
    const current = await loadSettings();
    const next = { ...current, ...patch };
    await saveSettings(next);
    setSettings(next);
    if (
      patch.reminderHour !== undefined ||
      patch.reminderMinute !== undefined ||
      patch.onboardingComplete
    ) {
      await scheduleDailyReminder(next);
    }
  }, []);

  const refreshPremium = useCallback(async () => {
    setPremium(await isPremiumUnlocked());
  }, []);

  const restore = useCallback(async () => {
    const ok = await restorePurchases();
    setPremium(ok || (await isPremiumUnlocked()));
    return ok;
  }, []);

  const isDark =
    settings?.darkMode === "dark" ||
    (settings?.darkMode !== "light" && scheme === "dark");

  const colors = isDark ? palette.dark : palette.light;

  const value = useMemo(
    () =>
      settings
        ? {
            settings,
            updateSettings,
            premium,
            refreshPremium,
            restore,
            colors,
            isDark,
          }
        : null,
    [settings, updateSettings, premium, refreshPremium, restore, colors, isDark]
  );

  if (!value) return null;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp outside AppProvider");
  return ctx;
}
