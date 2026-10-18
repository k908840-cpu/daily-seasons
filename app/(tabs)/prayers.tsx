import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Body, Muted, Title } from "@/components/Typography";
import { DAILY_PRAYERS, LIBRARY_PRAYERS } from "@/data/prayers";
import { useApp } from "@/context/AppContext";

export default function PrayersScreen() {
  const router = useRouter();
  const { colors } = useApp();

  return (
    <Screen>
      <View style={styles.pad}>
        <Title>Daily prayers</Title>
        {DAILY_PRAYERS.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => router.push(`/prayer/${p.id}`)}
            style={[styles.row, { borderColor: colors.border }]}
          >
            <Body>{p.title}</Body>
          </Pressable>
        ))}

        <Title style={styles.libTitle}>Library</Title>
        <Muted>Traditional prayers (~30). Text pending your content files.</Muted>
        <FlatList
          data={LIBRARY_PRAYERS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/prayer/${item.id}`)}
              style={[styles.row, { borderColor: colors.border }]}
            >
              <Body>{item.title}</Body>
            </Pressable>
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { flex: 1, padding: 20 },
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  libTitle: { marginTop: 24 },
});
