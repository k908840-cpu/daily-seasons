/** Structured Rosary steps. Prayer wording is deliberately excluded pending source verification. */
export const MYSTERIES = {
  Joyful: ["The Annunciation", "The Visitation", "The Nativity", "The Presentation", "The Finding in the Temple"],
  Sorrowful: ["The Agony in the Garden", "The Scourging at the Pillar", "The Crowning with Thorns", "The Carrying of the Cross", "The Crucifixion"],
  Glorious: ["The Resurrection", "The Ascension", "The Descent of the Holy Spirit", "The Assumption", "The Coronation of Mary"],
  Luminous: ["The Baptism of Jesus", "The Wedding at Cana", "The Proclamation of the Kingdom", "The Transfiguration", "The Institution of the Eucharist"],
} as const;
export type MysteryKind = keyof typeof MYSTERIES;
export interface RosaryStep { title: string; mystery?: string; instruction: string }
export function buildRosary(kind: MysteryKind): RosaryStep[] {
  const steps: RosaryStep[] = [
    { title: "Sign of the Cross", instruction: "Begin the Rosary." },
    { title: "Apostles' Creed", instruction: "Pray the Apostles' Creed." },
    { title: "Our Father", instruction: "Pray one Our Father." },
    ...Array.from({ length: 3 }, (_, i) => ({ title: `Hail Mary ${i + 1} of 3`, instruction: "Pray one Hail Mary for faith, hope, and charity." })),
    { title: "Glory Be", instruction: "Pray the Glory Be." },
  ];
  MYSTERIES[kind].forEach((mystery, i) => {
    steps.push({ title: `Mystery ${i + 1}: ${mystery}`, mystery, instruction: "Announce and contemplate this mystery." });
    steps.push({ title: "Our Father", mystery, instruction: "Pray one Our Father." });
    for (let n = 1; n <= 10; n++) steps.push({ title: `Hail Mary ${n} of 10`, mystery, instruction: "Pray one Hail Mary while contemplating the mystery." });
    steps.push({ title: "Glory Be", mystery, instruction: "Pray the Glory Be. An optional Fatima Prayer may follow." });
  });
  steps.push({ title: "Closing prayers", instruction: "Conclude with the Hail Holy Queen and Sign of the Cross." });
  return steps;
}
export function suggestedMystery(day: number): MysteryKind {
  return (["Glorious", "Joyful", "Sorrowful", "Glorious", "Luminous", "Sorrowful", "Glorious"] as MysteryKind[])[day];
}
