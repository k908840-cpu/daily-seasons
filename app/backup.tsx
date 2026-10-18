import React, { useState } from "react";
import { Alert, Pressable, Share, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { exportBackup, importBackup, parseBackup } from "@/lib/backup";

export default function BackupScreen() {
  const { colors } = useApp();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const exportData = async () => {
    try {
      setBusy(true);
      const data = await exportBackup();
      await Share.share({ title: "Daily Seasons private backup", message: data });
      setMessage("The system share sheet was opened. Save the backup text in a private, secure location.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to share backup."); }
    finally { setBusy(false); }
  };
  const restore = () => {
    try { parseBackup(input); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Invalid backup."); return; }
    Alert.alert("Replace saved data?", "Restoring replaces the sections contained in this backup. This cannot be undone. Keep your existing backup first.", [
      { text: "Cancel", style: "cancel" },
      { text: "Restore", style: "destructive", onPress: () => { void (async () => {
        try { setBusy(true); await importBackup(input); Alert.alert("Restore complete", "Restart the app to reload your restored settings and personal data.", [{ text: "OK", onPress: () => router.back() }]); }
        catch (error) { setMessage(error instanceof Error ? error.message : "Restore failed."); }
        finally { setBusy(false); }
      })(); } },
    ]);
  };
  return <Screen scroll style={{ padding: 22, paddingBottom: 60 }}>
    <Text style={{ color: colors.accent, fontWeight: "700", letterSpacing: 2, fontSize: 11 }}>PRIVATE DATA</Text>
    <Text style={{ color: colors.text, fontSize: 30, fontWeight: "600", marginTop: 10 }}>Backup & restore</Text>
    <Text style={{ color: colors.muted, lineHeight: 23, marginTop: 10 }}>Your journal, prayer intentions, notes, bookmarks and progress live on this device. Create a backup before changing phones or uninstalling.</Text>
    <Pressable disabled={busy} onPress={() => void exportData()} style={{ backgroundColor: colors.accent, borderRadius: 15, padding: 17, marginTop: 24 }}>
      <Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>Share private backup text</Text>
    </Pressable>
    <Text style={{ color: colors.text, fontSize: 20, fontWeight: "600", marginTop: 30 }}>Restore a backup</Text>
    <Text style={{ color: colors.muted, lineHeight: 21, marginTop: 8 }}>Paste the entire Daily Seasons backup JSON below. Review it before restoring.</Text>
    <TextInput multiline value={input} onChangeText={setInput} placeholder="Paste backup JSON" placeholderTextColor={colors.muted} textAlignVertical="top" autoCapitalize="none" style={{ minHeight: 155, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 14, backgroundColor: colors.card, color: colors.text, marginTop: 14 }} />
    <Pressable disabled={busy || !input.trim()} onPress={restore} style={{ borderWidth: 1, borderColor: colors.accent, borderRadius: 15, padding: 16, marginTop: 13, opacity: busy || !input.trim() ? 0.5 : 1 }}>
      <Text style={{ color: colors.accent, textAlign: "center", fontWeight: "700" }}>Validate & restore</Text>
    </Pressable>
    {!!message && <Text style={{ color: colors.muted, marginTop: 14, lineHeight: 20 }}>{message}</Text>}
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 22 }}>Backups are unencrypted plain text and may contain sensitive prayer notes. Save them securely. No backup is uploaded by the app itself. Purchase entitlements are never included; restore purchases through Google Play.</Text>
  </Screen>;
}
