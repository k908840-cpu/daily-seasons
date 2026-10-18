import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { Screen } from "@/components/Screen";
import { Body, Title } from "@/components/Typography";
import { getPrayerById } from "@/data/prayers";
import { useApp } from "@/context/AppContext";

export default function PrayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const prayer = getPrayerById(id ?? "");
  const { settings } = useApp();

  if (!prayer) {
    return (
      <Screen>
        <Body>Prayer not found.</Body>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <Title>{prayer.title}</Title>
      <Body>{prayer.text}</Body>
      <Pressable
        style={styles.btn}
        onPress={() =>
          Speech.speak(prayer.text, {
            rate: settings.textSize === "large" ? 0.9 : 0.95,
          })
        }
      >
        <Body>Read aloud</Body>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  btn: { marginTop: 20, padding: 12 },
});
