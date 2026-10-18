import { Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Body, Muted, Title } from "@/components/Typography";
import { useApp } from "@/context/AppContext";
import { purchaseLifetime } from "@/lib/purchases";

export default function PaywallScreen() {
  const { colors, restore, refreshPremium } = useApp();
  const router = useRouter();

  const buy = async () => {
    const ok = await purchaseLifetime();
    if (ok) {
      await refreshPremium();
      router.back();
    }
  };

  const onRestore = async () => {
    const ok = await restore();
    if (ok) router.back();
  };

  return (
    <Screen scroll>
      <Title>Unlock full Advent & updates</Title>
      <Body>
        Days 1–7 are free. One-time purchase (about $9.99 USD, localized in Play)
        unlocks the rest of Advent, Christmas, and free content updates including
        Lent and Easter.
      </Body>
      <Muted>No subscription. No account. Works offline after install.</Muted>

      <Pressable
        style={[styles.primary, { backgroundColor: colors.accent }]}
        onPress={() => void buy()}
      >
        <Body style={styles.primaryText}>Unlock lifetime access</Body>
      </Pressable>

      <Pressable style={styles.secondary} onPress={() => void onRestore()}>
        <Body>Restore purchase</Body>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  primary: {
    marginTop: 28,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "600" },
  secondary: {
    marginTop: 16,
    padding: 16,
    alignItems: "center",
  },
});
