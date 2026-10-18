import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { calendarForMonth } from "@/lib/seasonalCalendar";
import { getCurrentSeason } from "@/lib/churchCalendar";

const colorsForSeason: Record<string, string> = { advent: "#69638E", christmas: "#C29B60", lent: "#9873A0", "holy-week": "#A36978", easter: "#C29B60", ordinary: "#789282" };
export default function CalendarScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [selected, setSelected] = useState(() => new Date().getDate());
  const days = useMemo(() => calendarForMonth(year, month), [year, month]);
  const firstWeekday = new Date(year, month, 1).getDay();
  const chosen = days.find(d => d.date.getDate() === selected);
  const changeMonth = (delta: number) => { const date = new Date(year, month + delta, 1); setMonth(date.getMonth()); setYear(date.getFullYear()); setSelected(1); };
  return <Screen scroll style={{ padding: 20, paddingBottom: 60 }}>
    <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700", letterSpacing: 2 }}>THE CHRISTIAN YEAR</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 9 }}>Seasonal calendar</Text>
    <Text style={{ color: colors.muted, lineHeight: 21, marginTop: 9 }}>Explore the Western Christian year and its major observances.</Text>
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 25 }}>
      <Pressable onPress={() => changeMonth(-1)} style={{ padding: 12 }}><Text style={{ color: colors.accent, fontSize: 22 }}>‹</Text></Pressable>
      <Text style={{ color: colors.text, fontSize: 21, fontWeight: "600" }}>{new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</Text>
      <Pressable onPress={() => changeMonth(1)} style={{ padding: 12 }}><Text style={{ color: colors.accent, fontSize: 22 }}>›</Text></Pressable>
    </View>
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <Text key={d} style={{ width: "14.285%", color: colors.muted, textAlign: "center", marginBottom: 12, fontSize: 12 }}>{d}</Text>)}
      {Array.from({ length: firstWeekday }, (_, i) => <View key={`blank-${i}`} style={{ width: "14.285%", height: 53 }} />)}
      {days.map(d => {
        const n = d.date.getDate();
        const active = n === selected;
        return <Pressable key={n} onPress={() => setSelected(n)} style={{ width: "14.285%", height: 53, padding: 3, alignItems: "center" }}>
          <View style={{ width: 35, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: active ? colors.accent : colors.card, borderWidth: d.events.length ? 1.5 : 0, borderColor: colorsForSeason[d.season] }}>
            <Text style={{ color: active ? "#fff" : colors.text, fontWeight: d.events.length ? "700" : "400" }}>{n}</Text>
          </View>
          <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: d.events.length ? colorsForSeason[d.season] : "transparent", marginTop: 2 }} />
        </Pressable>;
      })}
    </View>
    {chosen && <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 20, marginTop: 22 }}>
      <Text style={{ color: colors.muted }}>{chosen.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</Text>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: "600", marginTop: 8 }}>{getCurrentSeason(chosen.date)?.label ?? "Ordinary Time"}</Text>
      {chosen.events.length ? chosen.events.map(e => <View key={e.title} style={{ borderTopWidth: 1, borderColor: colors.border, paddingTop: 14, marginTop: 15 }}>
        <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>{e.title}</Text>
        <Text style={{ color: colors.muted, lineHeight: 21, marginTop: 5 }}>{e.detail}</Text>
        {!!e.reference && <Text style={{ color: colors.accent, marginTop: 8 }}>Suggested Scripture: {e.reference}</Text>}
      </View>) : <Text style={{ color: colors.muted, marginTop: 12 }}>No major observance listed for this date.</Text>}
    </View>}
    <Pressable onPress={() => router.push("/seasonal-journeys")} style={{ padding: 16, borderRadius: 15, backgroundColor: colors.accent, marginTop: 20 }}><Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>Explore seasonal journeys →</Text></Pressable>
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 22 }}>This is a general Western Gregorian calendar, not an official denominational liturgical calendar or lectionary. Orthodox dates and transferred observances may differ.</Text>
  </Screen>;
}
