import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import * as Speech from "expo-speech";
import { Screen } from "@/components/Screen";
import { Body, Muted, Title } from "@/components/Typography";
import { useApp } from "@/context/AppContext";
import { getAdventEntry } from "@/data/adventEntries";
import { getChristmasEntry } from "@/data/christmasEntries";
import { getSource } from "@/data/sources";
import type { DailyEntry } from "@/types/content";
import { formatDateISO } from "@/lib/churchCalendar";
import {
  loadJournal,
  markDayRead,
  progressKey,
  saveJournalLine,
  toggleBookmark,
} from "@/lib/storage";

function loadEntry(season: string, day: number): DailyEntry {
  if (season === "christmas") return getChristmasEntry(day);
  return getAdventEntry(day);
}

export default function DailyScreen() {
  const { season, day: dayStr } = useLocalSearchParams<{
    season: string;
    day: string;
  }>();
  const day = Number(dayStr);
  const entry = loadEntry(season ?? "advent", day);
  const { colors, settings } = useApp();
  const year = new Date().getFullYear();
  const [journal, setJournal] = useState("");
  const dateISO = formatDateISO(new Date());

  useEffect(() => {
    void markDayRead(progressKey(season ?? "advent", year, day));
    void loadJournal().then((rows) => {
      const row = rows.find((r) => r.dateISO === dateISO);
      if (row) setJournal(row.line);
    });
  }, [season, day, year, dateISO]);

  const readAloud = () => {
    const text = [entry.reference, entry.text, entry.prayer]
      .filter(Boolean)
      .join(". ");
    Speech.speak(text, { rate: settings.textSize === "large" ? 0.9 : 1 });
  };

  const source = getSource(entry.sourceId);

  return (
    <Screen scroll>
      <Muted>
        Day {day} · {entry.reference}
      </Muted>
      <Title>{season === "christmas" ? "Christmas" : "Advent"}</Title>

      <Body>{entry.text}</Body>

      {entry.reflection ? (
        <View style={[styles.block, { borderColor: colors.border }]}>
          <Muted>Reflection</Muted>
          <Body>{entry.reflection}</Body>
        </View>
      ) : null}

      <View style={[styles.block, { borderColor: colors.border }]}>
        <Muted>Prayer</Muted>
        <Body>{entry.prayer}</Body>
      </View>

      {settings.mode === "family" && entry.familyAction ? (
        <View style={[styles.block, { borderColor: colors.border }]}>
          <Muted>Family</Muted>
          <Body>{entry.familyAction}</Body>
        </View>
      ) : null}

      <Muted style={styles.source}>
        Source: {source?.label ?? entry.sourceId}
      </Muted>

      <TextInput
        placeholder="One line for today (private, on device)"
        placeholderTextColor={colors.muted}
        value={journal}
        onChangeText={setJournal}
        onBlur={() => void saveJournalLine(dateISO, journal)}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.border,
            backgroundColor: colors.card,
          },
        ]}
      />

      <View style={styles.row}>
        <Pressable
          style={[styles.btn, { borderColor: colors.accent }]}
          onPress={readAloud}
        >
          <Body>Read aloud</Body>
        </Pressable>
        <Pressable
          style={[styles.btn, { borderColor: colors.accent }]}
          onPress={() =>
            void toggleBookmark({
              id: `${season}-${day}`,
              kind: "daily",
              ref: `${season}/${day}`,
              title: `${season} day ${day}`,
              createdAt: new Date().toISOString(),
            })
          }
        >
          <Body>Bookmark</Body>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  source: { marginTop: 12 },
  input: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  row: { flexDirection: "row", gap: 12, marginTop: 16 },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
});
