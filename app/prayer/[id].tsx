import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Speech from "expo-speech";
import { Screen } from "@/components/Screen";
import { getPrayerById } from "@/data/prayers";
import { useApp } from "@/context/AppContext";
import { loadBookmarks, toggleBookmark } from "@/lib/storage";

const historicalSources: Record<string, string> = {
  "bcp-1662-kyrie": "The Book of Common Prayer (1662), Morning Prayer · Church of England",
  "bcp-1662-gloria": "The Book of Common Prayer (1662), Gloria Patri (excerpt) · Church of England",
  "orthodox-trisagion": "Traditional Trisagion · Orthodox Church in America",
  "ancient-jesus-prayer": "Traditional Jesus Prayer · Eastern Christian tradition",
};
export default function PrayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const prayer = getPrayerById(id ?? "");
  const { settings, colors } = useApp();
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    void loadBookmarks().then(all => setSaved(all.some(b => b.id === `prayer:${id}`)));
    return () => { Speech.stop(); };
  }, [id]);
  if (!prayer) return <Screen><Text style={{ color: colors.text }}>Prayer not found.</Text></Screen>;
  const pending = prayer.sourceId === "placeholder";
  const bookmark = async () => {
    await toggleBookmark({ id: `prayer:${id}`, kind: "prayer", ref: prayer.id, title: prayer.title, createdAt: new Date().toISOString() });
    setSaved(s => !s);
  };
  return <Screen scroll style={{ padding: 22, paddingBottom: 55 }}>
    <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700", letterSpacing: 2 }}>PRAYER LIBRARY</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 10 }}>{prayer.title}</Text>
    <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 20, marginTop: 22 }}>
      <Text style={{ color: colors.text, fontSize: 17, lineHeight: 29 }}>{pending ? "This prayer's wording and source are being verified. The full text is not yet available." : prayer.text}</Text>
    </View>
    {!pending && <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 12 }}>{prayer.sourceId === "daily-seasons-original" ? "Original contemporary prayer written for Daily Seasons · Shared Christian" : historicalSources[prayer.sourceId] ?? `Source: ${prayer.sourceId}`}</Text>}
    <Pressable onPress={() => void bookmark()} style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 13, padding: 15, marginTop: 18 }}>
      <Text style={{ color: colors.accent, fontWeight: "600", textAlign: "center" }}>{saved ? "♥ Saved to Faith Vault" : "♡ Save prayer"}</Text>
    </Pressable>
    {!pending && <>
      <Pressable onPress={() => { Speech.stop(); Speech.speak(prayer.text, { rate: settings.speechRate ?? 0.9, language: settings.speechLocale === "device" ? undefined : (settings.speechLocale ?? "en-US") }); }} style={{ backgroundColor: colors.accent, borderRadius: 13, padding: 15, marginTop: 10 }}>
        <Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>Read aloud</Text>
      </Pressable>
      <Pressable onPress={() => void Speech.stop()} style={{ padding: 14 }}><Text style={{ color: colors.muted, textAlign: "center" }}>Stop audio</Text></Pressable>
    </>}
  </Screen>;
}
