import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, ViewStyle } from "react-native";
import { useApp } from "@/context/AppContext";

export function Screen({
  children,
  scroll,
  style,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
}) {
  const { colors } = useApp();
  const inner = scroll ? (
    <ScrollView contentContainerStyle={[styles.pad, style]}>
      {children}
    </ScrollView>
  ) : (
    children
  );
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]}>
      {inner}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pad: { padding: 20, paddingBottom: 40 },
});
