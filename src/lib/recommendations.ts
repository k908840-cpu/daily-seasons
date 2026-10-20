import type { UserSettings } from "@/lib/storage";
export interface PrayerRecommendation { title: string; subtitle: string; route: "/daily-path" | "/lectio" | "/rosary" | "/seasonal-journeys" | "/night-prayer" | "/scripture" }
export function recommendPrayer(settings: UserSettings, hour: number): PrayerRecommendation {
  const interest = settings.preferredInterest ?? "";
  const goal = settings.spiritualGoal ?? "";
  const time = settings.preferredPrayerTime ?? "";
  if ((time === "In the evening" && hour >= 18) || ((hour >= 21 || hour < 5) && time !== "Early morning")) return { title: "Rest with a night prayer", subtitle: "A quiet close to your day", route: "/night-prayer" };
  if (interest === "The Rosary" || (interest === "Traditional prayers" && settings.denomination === "Catholic")) return { title: "Pray the Rosary", subtitle: "A guided five-decade devotion", route: "/rosary" };
  if (interest === "Traditional prayers") return { title: "Pray with Scripture", subtitle: "A shared Christian practice of reflection", route: "/lectio" };
  const month = new Date().getMonth();
  const seasonalInterest = (interest === "Advent and Christmas" && (month === 11 || month === 0)) || (interest === "Lent and Easter" && month >= 1 && month <= 4);
  if (seasonalInterest || goal === "Follow the Christian seasons") return { title: "Walk through the seasons", subtitle: "Daily seasonal reflections", route: "/seasonal-journeys" };
  if (interest === "Daily reflections" || goal === "Explore Scripture") return { title: "Pray with Scripture", subtitle: "Four stages of Lectio Divina", route: "/lectio" };
  if (settings.denomination === "Catholic" && !interest) return { title: "Pray the Rosary", subtitle: "A guided devotion you can begin anytime", route: "/rosary" };
  if (settings.denomination === "Protestant" && !interest) return { title: "Explore Scripture", subtitle: "Read and reflect on the Bible", route: "/scripture" };
  return { title: "Begin My Daily Path", subtitle: `${settings.preferredDuration ?? 5}-minute personal prayer routine`, route: "/daily-path" };
}
