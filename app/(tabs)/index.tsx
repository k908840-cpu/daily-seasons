
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { AdventWreath } from "@/components/AdventWreath";
import { useApp } from "@/context/AppContext";
import {
  adventSundaysLit,
  daysUntilChristmas,
  getCurrentSeason,
  getNextSeason,
} from "@/lib/churchCalendar";
import { loadProgress } from "@/lib/storage";
import { isDayPaywalled } from "@/lib/purchases";
import { recommendPrayer } from "@/lib/recommendations";

export default function HomeScreen() {
  const { colors, premium, settings } = useApp();
  const router = useRouter();

  const today = new Date();
  const year = today.getFullYear();
  const season = getCurrentSeason(today);
  const next = getNextSeason(today);

  const isAdventCalendarDate =
    today.getMonth() === 11 && today.getDate() <= 25;

  const adventDay = isAdventCalendarDate
    ? today.getDate()
    : null;

  const [readDays, setReadDays] = useState<number[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const reveal = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (mounted) setReducedMotion(value); });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReducedMotion);
    return () => { mounted = false; sub.remove(); };
  }, []);
  useEffect(() => {
    if (reducedMotion) { reveal.setValue(1); return; }
    Animated.timing(reveal, { toValue: 1, duration: 550, useNativeDriver: true }).start();
  }, [reducedMotion, reveal]);

  useEffect(() => {
    let active = true;

    loadProgress().then((progress) => {
      if (!active) return;

      const days = progress.readDays
        .filter((key) => key.startsWith(`advent-${year}-`))
        .map((key) => Number(key.split("-").pop()))
        .filter((day) => Number.isInteger(day));

      setReadDays(days);
    });

    return () => {
      active = false;
    };
  }, [year]);

  const openDay = (day: number) => {
    if (adventDay !== null && day > adventDay) return;

    if (isDayPaywalled(day, premium)) {
      router.push("/paywall");
      return;
    }

    router.push(`/day/advent/${day}`);
  };

  const recommendation = recommendPrayer(settings, today.getHours());
  const hour = today.getHours();
  const greeting = hour < 11 ? "A gentle morning." : hour < 17 ? "A moment to pause." : "Rest in this moment.";
  const personalContext = settings.spiritualGoal === "Find a moment of peace" ? "A little room to breathe and pray."
    : settings.spiritualGoal === "Explore Scripture" ? "A moment to listen through Scripture."
    : settings.spiritualGoal === "Build a prayer habit" ? "Small, faithful steps each day."
    : settings.spiritualGoal === "Grow closer to God" ? "A daily invitation to draw near."
    : "Your companion through the Christian year.";
  const tradition = settings.denomination && settings.denomination !== "Exploring / not sure" ? settings.denomination : "Your own path";
  const duration = settings.preferredDuration ?? 5;
  const quickPrayerId = hour < 12 ? "morning" : hour < 19 ? "lib-peace" : "evening";
  const countdown = daysUntilChristmas(today);
  const seasonName = season?.label ?? "Ordinary Time";

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Screen scroll style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.accent }]}>
          ONE FAITH · MANY TRADITIONS
        </Text>

        <Text style={[styles.date, { color: colors.muted }]}>
          {formattedDate}
        </Text>

        <Text style={[styles.title, { color: colors.text }]}>
          {greeting}
        </Text>

        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {personalContext}
        </Text>
      </View>

      <View
        style={[
          styles.seasonCard,
          { backgroundColor: colors.accent },
        ]}
      >
        <Text style={styles.cardEyebrow}>
          CURRENT SEASON
        </Text>

        <Text style={styles.seasonTitle}>
          {seasonName}
        </Text>

        <Text style={styles.seasonDescription}>
          Make room for prayer, reflection, and hope today.
        </Text>

        {next && (
          <View style={styles.nextSeason}>
            <Text style={styles.nextLabel}>
              COMING NEXT
            </Text>

            <Text style={styles.nextValue}>
              {next.label} ·{" "}
              {next.start.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>
        )}
      </View>

      <Pressable onPress={() => router.push("/scripture")} style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 18, marginBottom: 26 }}>
        <Text style={{ color: colors.accent, fontSize: 11, fontWeight: "700", letterSpacing: 1.5 }}>EXPLORE SCRIPTURE</Text>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "600", marginTop: 7 }}>Open the Bible  →</Text>
        <Text style={{ color: colors.muted, fontSize: 13, marginTop: 6 }}>Browse books and chapters</Text>
      </Pressable>

      <Pressable onPress={() => router.push(recommendation.route)} style={{ backgroundColor: colors.accent, borderRadius: 19, padding: 20, marginBottom: 12 }}>
        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700", letterSpacing: 1 }}>TODAY'S PRAYER</Text>
        <Text style={{ color: "#fff", fontSize: 21, fontWeight: "600", marginTop: 8 }}>{recommendation.title} →</Text>
        <Text style={{ color: "#F2F0F7", marginTop: 5 }}>{recommendation.subtitle}</Text>
      </Pressable>
      <View style={{ flexDirection: "row", gap: 11, marginBottom: 12 }}>
        <Pressable accessibilityRole="button" onPress={() => router.push("/(tabs)/prayers")} style={{ flex: 1, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>Your prayer library →</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 7 }}>Save favorites for quiet moments</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push("/night-prayer")} style={{ flex: 1, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>Night prayer →</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 7 }}>Listen and release the day</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: "row", gap: 11, marginBottom: 27 }}>
        <Pressable onPress={() => router.push("/calendar")} style={{ flex: 1, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>Christian calendar →</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 7 }}>Seasons and observances</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/seasonal-journeys")} style={{ flex: 1, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>Seasonal journeys →</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 7 }}>Daily reflection plans</Text>
        </Pressable>
      </View>
      {today.getMonth() === 11 && today.getDate() <= 25 && <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          The journey to Christmas
        </Text>

        <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
          A season of waiting, wonder, and light.
        </Text>
      </View>

      <View
        style={[
          styles.countdownCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.wreathContainer}>
          <AdventWreath candlesLit={adventSundaysLit(today)} />
        </View>

        <Text style={[styles.countdownNumber, { color: colors.text }]}>
          {countdown === 0 ? "Christmas" : countdown}
        </Text>

        <Text style={[styles.countdownLabel, { color: colors.muted }]}>
          {countdown === 0
            ? "Christmas Day is here"
            : "days until Christmas"}
        </Text>
      </View>

      <View style={styles.calendarHeading}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Advent Calendar
          </Text>

          <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
            Discover a reflection for each day.
          </Text>
        </View>

        <Text style={[styles.progressLabel, { color: colors.accent }]}>
          {readDays.length}/25
        </Text>
      </View>

      <View
        style={[
          styles.progressTrack,
          { backgroundColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.accent,
              width: `${(readDays.length / 25) * 100}%`,
            },
          ]}
        />
      </View>

      <View style={styles.calendarGrid}>
        {Array.from({ length: 25 }, (_, index) => {
          const day = index + 1;
          const isFuture =
            adventDay !== null && day > adventDay;
          const isToday = adventDay === day;
          const completed = readDays.includes(day);
          const paywalled = isDayPaywalled(day, premium);

          return (
            <Pressable
              key={day}
              onPress={() => openDay(day)}
              disabled={isFuture}
              accessibilityRole="button"
              accessibilityLabel={`Advent day ${day}${
                completed ? ", completed" : ""
              }${isFuture ? ", unavailable" : ""}`}
              style={[
                styles.dayTile,
                {
                  backgroundColor: completed
                    ? colors.accent
                    : isToday
                    ? colors.gold
                    : colors.card,
                  borderColor:
                    isToday ? colors.gold : colors.border,
                  opacity: isFuture ? 0.45 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  {
                    color:
                      completed || isToday
                        ? "#FFFFFF"
                        : colors.text,
                  },
                ]}
              >
                {day}
              </Text>

              {completed && (
                <Text style={styles.tileIndicator}>✓</Text>
              )}

              {!completed && paywalled && !isFuture && (
                <Text
                  style={[
                    styles.tileIndicator,
                    { color: colors.muted },
                  ]}
                >
                  ✦
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.calendarNote, { color: colors.muted }]}>
        Take your time. Your reflections remain available,
        and there are no streaks to lose.
      </Text>

      </>}
      {season?.id === "christmas" && !(today.getMonth() === 11 && today.getDate() <= 25) && (
        <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 20, marginTop: 12 }}>
          <Text style={{ color: colors.text, fontSize: 21, fontWeight: "600" }}>Celebrate Christmas</Text>
          <Text style={{ color: colors.muted, lineHeight: 22, marginTop: 8 }}>Explore reflections on the birth of Christ and the twelve days of Christmas.</Text>
          <Pressable onPress={() => router.push("/seasonal-journeys")} style={{ paddingVertical: 14 }}><Text style={{ color: colors.accent, fontWeight: "700" }}>Open Christmas journey →</Text></Pressable>
        </View>
      )}
      <Pressable
        onPress={() => router.push("/sources")}
        style={styles.footer}
      >
        <Text style={[styles.footerText, { color: colors.muted }]}>
          Sources & licenses
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  personalCard: { borderWidth: 1, borderRadius: 24, padding: 19, marginBottom: 22 },
  personalHeading: { flexDirection: "row", alignItems: "center", gap: 12 },
  personalSymbol: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  personalEyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  personalTitle: { fontSize: 19, fontWeight: "700", marginTop: 4 },
  personalDetail: { fontSize: 13, marginTop: 14 },
  personalActions: { flexDirection: "row", gap: 10, marginTop: 16 },
  personalAction: { flex: 1, borderRadius: 14, minHeight: 49, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  personalActionText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  personalEdit: { borderWidth: 1, borderRadius: 14, width: 50, alignItems: "center", justifyContent: "center" },
  quickHeading: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  quickRow: { flexDirection: "row", gap: 11, marginBottom: 23 },
  quickTile: { flex: 1, borderWidth: 1, borderRadius: 19, padding: 16, gap: 8 },
  quickTitle: { fontSize: 15, fontWeight: "700" },
  quickCaption: { fontSize: 12 },
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 26,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 35,
    fontWeight: "700",
    letterSpacing: -1.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
  },
  seasonCard: {
    borderRadius: 24,
    padding: 25,
    marginBottom: 34,
  },
  cardEyebrow: {
    color: "#D8E5DC",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 14,
  },
  seasonTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 12,
  },
  seasonDescription: {
    color: "#F0F5F0",
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 24,
  },
  nextSeason: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.25)",
    paddingTop: 17,
  },
  nextLabel: {
    color: "#D8E5DC",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 7,
  },
  nextValue: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  sectionHeader: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 21,
  },
  countdownCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    marginBottom: 34,
  },
  wreathContainer: {
    marginBottom: 12,
  },
  countdownNumber: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1,
    textAlign: "center",
  },
  countdownLabel: {
    fontSize: 15,
    marginTop: 3,
  },
  calendarHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 12,
  },
  progressTrack: {
    height: 6,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 22,
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  dayTile: {
    width: "18.3%",
    aspectRatio: 1,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumber: {
    fontSize: 19,
    fontWeight: "700",
  },
  tileIndicator: {
    position: "absolute",
    right: 5,
    top: 3,
    color: "#FFFFFF",
    fontSize: 11,
  },
  calendarNote: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 20,
  },
  footer: {
    paddingVertical: 24,
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
