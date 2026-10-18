export const palette = {
  light: {
    background: "#f7f5f0",
    card: "#ffffff",
    text: "#2c2c34",
    muted: "#6b6b76",
    accent: "#3d5a4c",
    gold: "#b8922a",
    border: "#e0ddd4",
  },
  dark: {
    background: "#1a1a2e",
    card: "#252538",
    text: "#eceae4",
    muted: "#a8a8b3",
    accent: "#7aab8f",
    gold: "#c9a227",
    border: "#3a3a50",
  },
};

export type ThemeColors = (typeof palette)["light"];
