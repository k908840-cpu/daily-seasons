import { Text, TextProps, StyleSheet } from "react-native";
import { useApp } from "@/context/AppContext";

export function Title(props: TextProps) {
  const { colors, settings } = useApp();
  const scale = settings.textSize === "large" ? 1.2 : 1;
  return (
    <Text
      {...props}
      style={[
        styles.title,
        { color: colors.text, fontSize: 26 * scale },
        props.style,
      ]}
    />
  );
}

export function Body(props: TextProps) {
  const { colors, settings } = useApp();
  const scale = settings.textSize === "large" ? 1.25 : 1;
  return (
    <Text
      {...props}
      style={[
        styles.body,
        { color: colors.text, fontSize: 16 * scale, lineHeight: 24 * scale },
        props.style,
      ]}
    />
  );
}

export function Muted(props: TextProps) {
  const { colors, settings } = useApp();
  const scale = settings.textSize === "large" ? 1.15 : 1;
  return (
    <Text
      {...props}
      style={[
        styles.muted,
        { color: colors.muted, fontSize: 14 * scale },
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: "600", marginBottom: 8 },
  body: {},
  muted: {},
});
