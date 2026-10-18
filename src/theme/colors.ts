export const palette = {
  light: {
    background: "#F8F6F3",
    card: "#FFFFFF",
    text: "#24273B",
    muted: "#747588",
    accent: "#52537D",
    gold: "#C29B60",
    border: "#E8E4E4",
  },
  dark: {
    background: "#181A2B",
    card: "#25283D",
    text: "#F4F0EE",
    muted: "#B3AEC2",
    accent: "#9795CE",
    gold: "#D8B780",
    border: "#3D3D54",
  },
};
export type ThemeColors = (typeof palette)["light"];
