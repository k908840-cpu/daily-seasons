import Constants from "expo-constants";
import { Platform } from "react-native";
import type { UserSettings } from "./storage";

// Expo Go on Android SDK 53 does not support push notifications.
// Load the notifications module only in a development/production build.
const inExpoGo = Constants.appOwnership === "expo";

function notifications() {
  const Notifications = require("expo-notifications") as typeof import("expo-notifications");
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  return Notifications;
}

export async function ensureNotificationPermission(): Promise<boolean> {
  if (inExpoGo) return false;
  const Notifications = notifications();
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleDailyReminder(settings: UserSettings): Promise<void> {
  if (inExpoGo) return;
  const Notifications = notifications();
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("daily-reminder", {
      name: "Daily reminder",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  if (!(await ensureNotificationPermission())) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Daily Seasons",
      body: "A quiet moment for today's reading and prayer.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: settings.reminderHour,
      minute: settings.reminderMinute,
      channelId: Platform.OS === "android" ? "daily-reminder" : undefined,
    },
  });
}
