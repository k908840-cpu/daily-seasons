import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import * as Speech from "expo-speech";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { loadListeningPosition, saveListeningPosition } from "@/lib/storage";

const reflections = [
  { title: "Release the day", text: "Take a moment to set down what you carried today. Name one thing you are grateful for. You do not need to solve tomorrow tonight." },
  { title: "Rest in peace", text: "Breathe gently. Think of a person who needs care, and hold them in prayer. Let the noise of the day settle." },
  { title: "Hope for tomorrow", text: "Remember a moment of kindness from today. Consider one small act of love you can offer tomorrow." },
];
export default function NightPrayerScreen() {
  const { colors, settings } = useApp();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(settings.speechRate ?? 0.9);
  const [minutes, setMinutes] = useState(0);
  const [playAll, setPlayAll] = useState(false);
  const session = useRef(0);
  const playAllRef = useRef(false);
  const indexRef = useRef(0);
  useEffect(() => { let active = true; void loadListeningPosition().then(saved => { if (active) { indexRef.current = saved; setIndex(saved); } }); return () => { active = false; }; }, []);
  const deadline = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stop = () => { session.current += 1; void Speech.stop(); setPlaying(false); if (deadline.current) { clearTimeout(deadline.current); deadline.current = null; } };
  const choose = (i: number) => { stop(); indexRef.current = i; setIndex(i); void saveListeningPosition(i); };
  const speakAt = (i: number, token: number) => {
    if (token !== session.current) return;
    indexRef.current = i; setIndex(i); void saveListeningPosition(i);
    Speech.speak(reflections[i].text, { rate, language: settings.speechLocale === "device" ? undefined : (settings.speechLocale ?? "en-US"), onDone: () => {
      if (token !== session.current) return;
      if (playAllRef.current && i < reflections.length - 1) speakAt(i + 1, token);
      else setPlaying(false);
    }, onStopped: () => { if (token === session.current) setPlaying(false); }, onError: () => { if (token === session.current) setPlaying(false); } });
  };
  useEffect(() => () => { session.current += 1; void Speech.stop(); if (deadline.current) clearTimeout(deadline.current); }, []);
  const play = () => {
    stop();
    setPlaying(true);
    const token = session.current;
    playAllRef.current = playAll;
    speakAt(indexRef.current, token);
    if (minutes > 0) deadline.current = setTimeout(stop, minutes * 60000);
  };
  return <Screen scroll style={{ padding: 22, paddingBottom: 60 }}>
    <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700", letterSpacing: 2 }}>END THE DAY GENTLY</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 9 }}>Night prayer</Text>
    <Text style={{ color: colors.muted, lineHeight: 22, marginTop: 10 }}>Original spoken reflections using your device's text-to-speech voice. Audio starts only when you press Play.</Text>
    <View style={{ gap: 9, marginTop: 20 }}>{reflections.map((r, i) => <Pressable key={r.title} onPress={() => choose(i)} style={{ backgroundColor: i === index ? colors.accent : colors.card, padding: 15, borderRadius: 14, borderWidth: 1, borderColor: colors.border }}>
      <Text style={{ color: i === index ? "#fff" : colors.text, fontWeight: "600" }}>{r.title}</Text>
    </Pressable>)}</View>
    <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 20, marginTop: 20 }}>
      <Text style={{ color: colors.text, fontSize: 21, fontWeight: "600" }}>{reflections[index].title}</Text>
      <Text style={{ color: colors.muted, fontSize: 16, lineHeight: 26, marginTop: 12 }}>{reflections[index].text}</Text>
    </View>
    <Text style={{ color: colors.text, fontWeight: "600", marginTop: 22 }}>Narration speed</Text>
    <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>{[0.75, 0.9, 1].map(n => <Pressable key={n} onPress={() => { stop(); setRate(n); }} style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: rate === n ? colors.accent : colors.card, borderWidth: 1, borderColor: colors.border }}><Text style={{ color: rate === n ? "#fff" : colors.text, textAlign: "center" }}>{n}×</Text></Pressable>)}</View>
    <Text style={{ color: colors.text, fontWeight: "600", marginTop: 22 }}>Stop playback after</Text>
    <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>{[0, 2, 5, 10].map(n => <Pressable key={n} onPress={() => { stop(); setMinutes(n); }} style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: minutes === n ? colors.accent : colors.card, borderWidth: 1, borderColor: colors.border }}><Text style={{ color: minutes === n ? "#fff" : colors.text, textAlign: "center" }}>{n ? `${n}m` : "Off"}</Text></Pressable>)}</View>
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: playAll }} onPress={() => { stop(); setPlayAll(!playAll); }} style={{ padding: 15, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 14, marginTop: 20 }}><Text style={{ color: colors.text, fontWeight: "600" }}>Play all reflections in order: {playAll ? "On" : "Off"}</Text></Pressable>
    <Pressable onPress={playing ? stop : play} style={{ backgroundColor: colors.accent, padding: 17, borderRadius: 15, marginTop: 25 }}><Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>{playing ? "Stop narration" : "▶ Play reflection"}</Text></Pressable>
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 16 }}>This is device-generated speech, not recorded music or continuous ambient audio. Your last selected reflection is remembered locally. Playback stops when you leave this screen; background audio and music are not yet supported.</Text>
  </Screen>;
}
