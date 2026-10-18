import { Screen } from "@/components/Screen";
import { Body, Muted, Title } from "@/components/Typography";
import { SOURCES } from "@/data/sources";
import { StyleSheet, View } from "react-native";
import { useApp } from "@/context/AppContext";
import Constants from "expo-constants";

export default function SourcesScreen() {
  const { colors } = useApp();
  const privacy =
    Constants.expoConfig?.extra?.privacyPolicyUrl ?? "https://example.com/privacy";

  return (
    <Screen scroll>
      <Title>Sources</Title>
      <Body>
        Scripture, prayers, and attributions used in this app. Nothing here
        implies clergy review or denominational endorsement.
      </Body>
      {SOURCES.map((s) => (
        <View
          key={s.id}
          style={[styles.block, { borderColor: colors.border }]}
        >
          <Body style={styles.label}>{s.label}</Body>
          <Muted>{s.detail}</Muted>
          {s.licenseNote ? <Muted>{s.licenseNote}</Muted> : null}
        </View>
      ))}
      <View style={[styles.block, { borderColor: colors.border }]}>
        <Body style={styles.label}>Privacy</Body>
        <Muted>
          No analytics, accounts, or cloud sync. Notes and settings stay on your
          phone. Policy: {privacy}
        </Muted>
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
  label: { fontWeight: "600" },
});
