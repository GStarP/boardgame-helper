import { StyleSheet } from "react-native";

/**
 * consts
 */
export const COLOR_FONT_SECONDARY = "rgba(0, 0, 0, 0.6)";
export const COLOR_FONT_THIRD = "rgba(0, 0, 0, 0.4)";
export const COLOR_FONT_FOURTH = "rgba(0, 0, 0, 0.2)";

/**
 * style object
 */
export const ATOM_STYLE = StyleSheet.create({
  wFull: {
    width: "100%",
  },
  hFull: {
    height: "100%",
  },
  flex: { display: "flex" },
  justifyCenter: { justifyContent: "center" },
  itemsCenter: { alignItems: "center" },
});
