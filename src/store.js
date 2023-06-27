import { atom } from "jotai";
import { Appearance } from "react-native";

export const store = atom({darkMode: Appearance.getColorScheme() === 'dark', difficulty: 0});