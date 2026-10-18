import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { v4 as uuidv4 } from "uuid";
import { Screen } from "@/components/Screen";
import { Body, Muted, Title } from "@/components/Typography";
import { useApp } from "@/context/AppContext";
import {
  loadPrayerList,
  savePrayerList,
  type PrayerListItem,
} from "@/lib/storage";

export default function ToolsScreen() {
  const { colors } = useApp();
  const [items, setItems] = useState<PrayerListItem[]>([]);
  const [name, setName] = useState("");
  const [intention, setIntention] = useState("");

  useEffect(() => {
    void loadPrayerList().then(setItems);
  }, []);

  const add = async () => {
    if (!name.trim()) return;
    const next = [
      ...items,
      { id: uuidv4(), name: name.trim(), intention: intention.trim(), prayed: false },
    ];
    setItems(next);
    setName("");
    setIntention("");
    await savePrayerList(next);
  };

  const toggle = async (id: string) => {
    const next = items.map((i) =>
      i.id === id ? { ...i, prayed: !i.prayed } : i
    );
    setItems(next);
    await savePrayerList(next);
  };

  return (
    <Screen>
      <View style={styles.pad}>
        <Title>Tools</Title>
        <Link href="/rosary" asChild>
          <Pressable style={[styles.linkRow, { borderColor: colors.border }]}>
            <Body>Rosary guide & bead counter</Body>
          </Pressable>
        </Link>
        <Link href="/timer" asChild>
          <Pressable style={[styles.linkRow, { borderColor: colors.border }]}>
            <Body>Prayer timer</Body>
          </Pressable>
        </Link>

        <Title style={styles.sub}>Prayer list</Title>
        <Muted>Private list on this device.</Muted>
        <TextInput
          placeholder="Name"
          placeholderTextColor={colors.muted}
          value={name}
          onChangeText={setName}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
        <TextInput
          placeholder="Intention (optional)"
          placeholderTextColor={colors.muted}
          value={intention}
          onChangeText={setIntention}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
        <Pressable
          style={[styles.add, { backgroundColor: colors.accent }]}
          onPress={() => void add()}
        >
          <Body style={styles.addText}>Add</Body>
        </Pressable>

        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => void toggle(item.id)}
              style={[styles.item, { borderColor: colors.border }]}
            >
              <Body>
                {item.prayed ? "✓ " : "○ "}
                {item.name}
              </Body>
              {item.intention ? <Muted>{item.intention}</Muted> : null}
            </Pressable>
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { flex: 1, padding: 20 },
  linkRow: { paddingVertical: 16, borderBottomWidth: 1 },
  sub: { marginTop: 28 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  add: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addText: { color: "#fff" },
  item: { paddingVertical: 12, borderBottomWidth: 1 },
});
