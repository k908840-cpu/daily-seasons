import { computeEasterSunday, computeAshWednesday, computePalmSunday, computeAdventStart, addDays, formatDateISO, type SeasonId } from "@/lib/churchCalendar";
export interface SeasonalJourney { id: SeasonId; title: string; intro: string; start: Date; days: number; prompts: string[]; references: string[] }
export function journeysForYear(year: number): SeasonalJourney[] {
  const easter = computeEasterSunday(year);
  return [
    { id: "advent", title: "Advent: Waiting in Hope", intro: "Prepare for Christmas through reflection and prayer.", start: computeAdventStart(year), days: 28, prompts: ["What am I waiting for?", "Where do I see hope?", "How can I prepare my heart?", "Whom can I encourage?"], references: ["Isaiah 9:2", "Luke 1:26-38", "Matthew 1:18-25", "Luke 2:1-20"] },
    { id: "christmas", title: "Christmas: Light and Joy", intro: "Reflect on the birth of Jesus and its meaning.", start: new Date(year, 11, 25), days: 12, prompts: ["Where do I notice joy?", "What gift can I share?", "Who needs welcome?", "What brings peace?"], references: ["Luke 2:1-20", "John 1:1-14", "Matthew 2:1-12"] },
    { id: "lent", title: "Lent: A Journey Inward", intro: "Make space for repentance, generosity and renewal.", start: computeAshWednesday(year), days: 40, prompts: ["What can I release?", "How can I practice generosity?", "Where do I need forgiveness?", "What matters most?"], references: ["Matthew 6:1-18", "Psalm 51", "Luke 15:11-32", "Isaiah 58:6-12"] },
    { id: "holy-week", title: "Holy Week: Walk with Jesus", intro: "Reflect on the final days before Easter.", start: computePalmSunday(year), days: 7, prompts: ["What does faithful love look like?", "Where can I serve?", "What does courage require?", "What does hope mean in waiting?"], references: ["Matthew 21:1-11", "John 13:1-17", "John 19", "Luke 23"] },
    { id: "easter", title: "Easter: New Life", intro: "Celebrate resurrection, hope and renewal.", start: easter, days: 50, prompts: ["Where do I see new life?", "What hope can I share?", "How can I practice peace?", "Where am I being called to grow?"], references: ["John 20:1-18", "Luke 24:13-35", "Acts 2:1-13"] },
    { id: "ordinary", title: "Ordinary Time: Faith Every Day", intro: "Practice everyday prayer and reflection.", start: addDays(easter, 50), days: 30, prompts: ["How can I serve today?", "What am I grateful for?", "Whom can I encourage?", "Where can I practice patience?"], references: ["Matthew 5:1-12", "Luke 10:25-37", "Mark 12:28-34"] },
  ];
}
export function journeyProgressKey(journey: SeasonalJourney, day: number): string { return `journey-${journey.id}-${formatDateISO(journey.start)}-${day}`; }
