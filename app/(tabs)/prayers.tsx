import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { loadBookmarks, toggleBookmark } from "@/lib/storage";
import { useApp } from "@/context/AppContext";
import { DAILY_PRAYERS, LIBRARY_PRAYERS } from "@/data/prayers";

type Category = "All" | "Favorites" | "Daily" | "Library" | "Traditional";
const categories: Category[] = ["All", "Favorites", "Daily", "Library", "Traditional"];

export default function PrayersScreen() {
  const router = useRouter();
  const { colors } = useApp();
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  useFocusEffect(useCallback(() => { let active = true; void loadBookmarks().then(items => { if (active) setFavorites(items.filter(b => b.kind === "prayer").map(b => b.ref)); }); return () => { active = false; }; }, []));
  const toggleFavorite = async (id: string, title: string) => {
    const items = await toggleBookmark({ id: `prayer-${id}`, kind: "prayer", ref: id, title, createdAt: new Date().toISOString() });
    setFavorites(items.filter(b => b.kind === "prayer").map(b => b.ref));
  };
  const [category, setCategory] = useState<Category>("All");

  const entries = useMemo(() => {
    const items = [
      ...DAILY_PRAYERS.map((prayer) => ({ ...prayer, group: "Daily" as const })),
      ...LIBRARY_PRAYERS.map((prayer) => ({ ...prayer, group: "Library" as const })),
    ];
    return items.filter((prayer) =>
      (category === "All" || (category === "Favorites" ? favorites.includes(prayer.id) : category === "Traditional" ? prayer.sourceId !== "daily-seasons-original" : prayer.group === category)) &&
      prayer.title.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [query, category, favorites]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={[styles.hero, { backgroundColor: colors.accent }]}>
              <View style={styles.heroIcon}>
                <Ionicons name="book-outline" size={25} color="#fff" />
              </View>
              <Text style={styles.eyebrow}>THE PRAYER LIBRARY</Text>
              <Text style={styles.heroTitle}>Find your quiet moment.</Text>
              <Text style={styles.heroCopy}>A place to pause, reflect, and return to prayer.</Text>
            </View>
            <Text style={[styles.heading, { color: colors.text }]}>Explore prayers</Text>
            <Text style={[styles.description, { color: colors.muted }]}>
              Daily devotions, traditional prayers, and original reflections.
            </Text>
            <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="search-outline" size={20} color={colors.muted} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                value={query}
                onChangeText={setQuery}
                placeholder="Search by prayer name"
                placeholderTextColor={colors.muted}
                accessibilityLabel="Search prayers"
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery("")} accessibilityLabel="Clear search">
                  <Ionicons name="close-circle" size={20} color={colors.muted} />
                </Pressable>
              )}
            </View>
            <View style={styles.filters}>
              {categories.map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: category === option }}
                  onPress={() => setCategory(option)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: category === option ? colors.accent : colors.card,
                      borderColor: category === option ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text style={{ color: category === option ? "#fff" : colors.text, fontWeight: "600" }}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.listHeading}>
              <Text style={[styles.listTitle, { color: colors.text }]}>Prayer collection</Text>
              <Text style={[styles.count, { color: colors.muted }]}>{entries.length} entries</Text>
            </View>
          </>
        }
        renderItem={({ item }) => {
          const pending = item.sourceId === "placeholder";
          const historical = item.sourceId !== "daily-seasons-original" && !pending;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.title + (pending ? ", text not yet available" : "")}
              onPress={() => router.push({ pathname: "/prayer/[id]", params: { id: item.id } })}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.symbol, { backgroundColor: colors.background }]}>
                <Ionicons
                  name={item.group === "Daily" ? "sunny-outline" : "book-outline"}
                  size={22}
                  color={colors.accent}
                />
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.cardCaption, { color: colors.muted }]}>
                  {historical ? "Traditional prayer" : item.group}{pending ? " · Text pending verification" : ""}
                </Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel={favorites.includes(item.id) ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`} onPress={() => void toggleFavorite(item.id, item.title)} hitSlop={12} style={{ padding: 10 }}>
                <Ionicons name={favorites.includes(item.id) ? "heart" : "heart-outline"} size={23} color={favorites.includes(item.id) ? colors.accent : colors.muted} />
              </Pressable>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.muted }]}>No matching prayers. Save a prayer with the heart icon or try another search.</Text>
        }
        ListFooterComponent={
          <Text style={[styles.footer, { color: colors.muted }]}>
            Original reflections and selected short traditional prayers. More historical texts are being reviewed.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 50 },
  hero: { borderRadius: 26, padding: 24, minHeight: 205, justifyContent: "center", marginBottom: 30 },
  heroIcon: { marginBottom: 14 },
  eyebrow: { color: "#DDE9E1", fontSize: 11, fontWeight: "700", letterSpacing: 2, marginBottom: 8 },
  heroTitle: { color: "#fff", fontSize: 30, fontWeight: "700", letterSpacing: -0.8, lineHeight: 36 },
  heroCopy: { color: "#ECF2ED", fontSize: 14, lineHeight: 21, marginTop: 9 },
  heading: { fontSize: 25, fontWeight: "700", letterSpacing: -0.5 },
  description: { fontSize: 14, lineHeight: 21, marginTop: 6, marginBottom: 20 },
  search: { height: 54, borderRadius: 16, borderWidth: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 10 },
  searchInput: { flex: 1, fontSize: 15 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginTop: 15, marginBottom: 28 },
  chip: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 24, borderWidth: 1 },
  listHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  listTitle: { fontSize: 20, fontWeight: "700" },
  count: { fontSize: 13 },
  card: { borderWidth: 1, borderRadius: 18, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 12 },
  symbol: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardCaption: { fontSize: 12, marginTop: 5 },
  empty: { textAlign: "center", marginVertical: 28 },
  footer: { fontSize: 12, textAlign: "center", lineHeight: 18, marginTop: 22 },
});
