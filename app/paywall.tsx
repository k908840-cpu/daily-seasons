import { Alert, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Body, Muted, Title } from "@/components/Typography";
import { useApp } from "@/context/AppContext";
import { BILLING_AVAILABLE, purchaseLifetime } from "@/lib/purchases";

export default function PaywallScreen() {
  const { colors, restore, refreshPremium } = useApp();
  const router = useRouter();

  const buy = async () => {
    if (!BILLING_AVAILABLE) { Alert.alert("Purchases coming soon", "Google Play purchases are not enabled in this preview build. Your free prayers and Scripture remain available."); return; }
    const ok = await purchaseLifetime();
    if (ok) {
      await refreshPremium();
      router.back();
    }
  };

  const onRestore = async () => {
    if (!BILLING_AVAILABLE) { Alert.alert("Restore unavailable", "Google Play Billing is not enabled in this preview build."); return; }
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
      {!BILLING_AVAILABLE && <Muted>Lifetime purchase and restoration are not yet available in this preview build. No payment will be taken.</Muted>}

      <Pressable
        onPress={() => void buy()}
        accessibilityState={{ disabled: !BILLING_AVAILABLE }}
        disabled={!BILLING_AVAILABLE}
        style={[styles.primary, { backgroundColor: colors.accent, opacity: BILLING_AVAILABLE ? 1 : 0.45 }]}
      >
        <Body style={styles.primaryText}>Unlock lifetime access</Body>
      </Pressable>

      <Pressable style={styles.secondary} onPress={() => void onRestore()} disabled={!BILLING_AVAILABLE} accessibilityState={{ disabled: !BILLING_AVAILABLE }}>
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
