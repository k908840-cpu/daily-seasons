import type { PrayerItem } from "@/types/content";

/** Original contemporary prayers composed for Daily Seasons; not historical liturgical translations. */
export const DAILY_PRAYERS: PrayerItem[] = [
  { id: "morning", title: "Morning Prayer", category: "daily", sourceId: "daily-seasons-original", text: "God of mercy, thank you for this new day. Give me wisdom in my choices, patience with others, and courage to do what is right. Help me notice those who need kindness and meet them with love. Amen." },
  { id: "evening", title: "Evening Prayer", category: "daily", sourceId: "daily-seasons-original", text: "God of peace, I bring you the joys and burdens of this day. Thank you for every kindness received and every chance to give. Forgive what I have done poorly, guide me to make things right, and grant rest to all who are weary. Amen." },
  { id: "night", title: "Night Prayer", category: "daily", sourceId: "daily-seasons-original", text: "Lord, as this day comes to an end, quiet my thoughts and ease my worries. Watch over those I love, those who are alone, and those who cannot sleep. May tomorrow find me ready to begin again with hope. Amen." },
  { id: "examen", title: "Daily Examen", category: "examen", sourceId: "daily-seasons-original", text: "God, help me remember today with honesty and gratitude. Where did I experience love? When did I turn away from it? Show me one thing to give thanks for, one thing to make right, and one small step toward faithfulness tomorrow. Amen." },
];

/** Complete original devotional prayers; historical texts will be added only with verified sources. */
export const LIBRARY_PRAYERS: PrayerItem[] = [
  { id: "lib-gratitude", title: "Prayer of Gratitude", category: "library", sourceId: "daily-seasons-original", text: "Generous God, open my eyes to the gifts I overlook: the people who care for me, the work of ordinary hands, and the beauty of this world. Teach me to receive each day with gratitude and to share what I have with joy. Amen." },
  { id: "lib-peace", title: "Prayer for Peace", category: "library", sourceId: "daily-seasons-original", text: "God of peace, calm the anger within me and soften the words I speak. Protect those living in fear and guide those who hold power toward justice and mercy. Make me a patient listener and a faithful peacemaker wherever I go. Amen." },
  { id: "lib-anxiety", title: "Prayer in Anxiety", category: "library", sourceId: "daily-seasons-original", text: "Lord, when my thoughts race ahead of me, help me return to this moment. Give me strength for what I can do today, wisdom to ask for help, and trust when I cannot see the way forward. Be near to all who are afraid. Amen." },
  { id: "lib-forgiveness", title: "Prayer for Forgiveness", category: "library", sourceId: "daily-seasons-original", text: "Merciful God, show me where I have caused harm, through my actions or my silence. Give me humility to admit my wrongs, courage to make amends, and grace to forgive those who have hurt me. Lead me toward a more loving life. Amen." },
  { id: "lib-family", title: "Prayer for Family and Friends", category: "library", sourceId: "daily-seasons-original", text: "Loving God, bless the people entrusted to my care and those who care for me. Strengthen our patience, deepen our understanding, and help us speak with kindness. Be especially close to anyone who feels distant, lonely, or forgotten. Amen." },
  { id: "lib-guidance", title: "Prayer for Guidance", category: "library", sourceId: "daily-seasons-original", text: "God of wisdom, when choices are difficult, help me seek what is true and good rather than what is merely easy. Give me clear judgment, honest counsel, and the courage to act with compassion. Guide my steps today. Amen." },
  { id: "lib-sick", title: "Prayer for the Sick and Those Who Care for Them", category: "library", sourceId: "daily-seasons-original", text: "Compassionate God, be near to those who are ill, in pain, or awaiting answers. Give skill and endurance to those who care for them, and comfort to their loved ones. May each person receive dignity, practical help, and hope. Amen." },
  { id: "lib-work", title: "Prayer Before Work or Study", category: "library", sourceId: "daily-seasons-original", text: "Lord, bless the work before me. Help me learn with curiosity, serve with integrity, and treat others fairly. When I make mistakes, teach me to begin again. May my efforts contribute something good to the lives of others. Amen." },
];

export function getPrayerById(id: string): PrayerItem | undefined {
  return [...DAILY_PRAYERS, ...LIBRARY_PRAYERS].find((p) => p.id === id);
}
