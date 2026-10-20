import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
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
  musicEnabled: boolean;
  musicVolume: number;
  setMusicEnabled: (enabled: boolean) => Promise<void>;
  setMusicVolume: (volume: number) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [premium, setPremium] = useState(false);
  const player = useAudioPlayer(require("../../assets/audio/piano-dreamcloud-meditation.mp3"));
  const musicEnabled = settings?.musicEnabled ?? false;
  const musicVolume = settings?.musicVolume ?? 0.15;
  useEffect(() => { void setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false }); }, []);
  useEffect(() => { player.loop = true; player.volume = Math.max(0, Math.min(1, musicVolume)); if (musicEnabled) player.play(); else player.pause(); }, [player, musicEnabled, musicVolume]);

  useEffect(() => {
    void (async () => {
      try { setSettings(await loadSettings()); }
      catch { setSettings({ onboardingComplete: false, textSize: "normal", reminderHour: 7, reminderMinute: 0, mode: "personal", darkMode: "system", preferredDuration: 5, speechRate: 0.9 }); }
      try { setPremium(await isPremiumUnlocked()); } catch { setPremium(false); }
      // Billing initialization must never block the first render.
      void initPurchases();
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

  const setMusicEnabled = useCallback(async (enabled: boolean) => { await updateSettings({ musicEnabled: enabled }); }, [updateSettings]);
  const setMusicVolume = useCallback(async (volume: number) => { await updateSettings({ musicVolume: Math.max(0, Math.min(1, volume)) }); }, [updateSettings]);

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
            musicEnabled,
            musicVolume,
            setMusicEnabled,
            setMusicVolume,
          }
        : null,
    [settings, updateSettings, premium, refreshPremium, restore, colors, isDark, musicEnabled, musicVolume, setMusicEnabled, setMusicVolume]
  );

  if (!value) return null;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp outside AppProvider");
  return ctx;
}
