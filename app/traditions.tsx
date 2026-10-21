import React from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { TRADITIONS, WEB_EDITION } from "@/data/traditions";

export default function TraditionsScreen() {
  const { colors } = useApp();
  return <Screen scroll style={{ padding: 22, paddingBottom: 60 }}>
    <Text style={{ color: colors.accent, fontSize: 11, letterSpacing: 2, fontWeight: "700" }}>FAITH & SOURCES</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 9 }}>Christian traditions</Text>
    <Text style={{ color: colors.muted, lineHeight: 22, marginTop: 10 }}>One Faith welcomes Christians from different traditions. Labels identify a prayer's common historical use, not exclusive ownership.</Text>
    {TRADITIONS.map(item => <View key={item.id} style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 18, marginTop: 13 }}>
      <Text style={{ color: colors.text, fontWeight: "700", fontSize: 18 }}>{item.label}</Text>
      <Text style={{ color: colors.muted, lineHeight: 22, marginTop: 8 }}>{item.note}</Text>
      <Pressable onPress={() => void Linking.openURL(item.source)} style={{ paddingTop: 11 }}><Text style={{ color: colors.accent, fontWeight: "600" }}>Explore source â†—</Text></Pressable>
    </View>)}
    <Text style={{ color: colors.text, fontSize: 21, fontWeight: "600", marginTop: 28 }}>Bible translation</Text>
    <Text style={{ color: colors.muted, lineHeight: 22, marginTop: 9 }}>{WEB_EDITION.name} Â· {WEB_EDITION.license}</Text>
    <Text style={{ color: colors.muted, lineHeight: 22, marginTop: 9 }}>{WEB_EDITION.note}</Text>
    <Pressable onPress={() => void Linking.openURL(WEB_EDITION.classicSource)} style={{ paddingVertical: 14 }}><Text style={{ color: colors.accent, fontWeight: "600" }}>Official WEB Classic source â†—</Text></Pressable>
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 13 }}>These summaries are introductory and are not substitutes for official guidance from each church. Orthodox jurisdictions, Anglican provinces, and Protestant denominations have internal differences.</Text>
  </Screen>;
}
