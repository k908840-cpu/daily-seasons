import type { UserSettings } from "@/lib/storage";
export interface PrayerRecommendation { title: string; subtitle: string; route: "/daily-path" | "/lectio" | "/rosary" | "/seasonal-journeys" | "/night-prayer" | "/scripture" }
export function recommendPrayer(settings: UserSettings, hour: number): PrayerRecommendation {
  const interest = settings.preferredInterest ?? "";
  const goal = settings.spiritualGoal ?? "";
  const time = settings.preferredPrayerTime ?? "";
  if (time === "In the evening" || (hour >= 20 || hour < 5)) return { title: "Rest with a night prayer", subtitle: "A quiet close to your day", route: "/night-prayer" };
  if (interest === "The Rosary" || interest === "Traditional prayers") return { title: "Pray the Rosary", subtitle: "A guided five-decade devotion", route: "/rosary" };
  if (interest === "Lent and Easter" || interest === "Advent and Christmas" || goal === "Follow the Christian seasons") return { title: "Walk through the seasons", subtitle: "Daily seasonal reflections", route: "/seasonal-journeys" };
  if (interest === "Daily reflections" || goal === "Explore Scripture") return { title: "Pray with Scripture", subtitle: "Four stages of Lectio Divina", route: "/lectio" };
  return { title: "Begin My Daily Path", subtitle: `${settings.preferredDuration ?? 5}-minute personal prayer routine`, route: "/daily-path" };
}
