import { Screen } from "@/components/Screen";
import { Body, Muted, Title } from "@/components/Typography";
import { SOURCES } from "@/data/sources";
import { StyleSheet, View } from "react-native";
import { useApp } from "@/context/AppContext";


export default function SourcesScreen() {
  const { colors } = useApp();

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
          No accounts, advertising, analytics, or automatic cloud sync are built into Daily Seasons. Your journal, bookmarks, and settings are stored locally. Optional backup sharing uses your phone’s share sheet and may send data to the service you select. Reminders use local notification permissions. The full privacy notice is included in the project and must be published at a public URL before Play Store submission.
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
