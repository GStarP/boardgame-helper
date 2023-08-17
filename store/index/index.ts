import { atom } from "jotai";
import { PluginInfo } from "./types";

export const j_plugins = atom<PluginInfo[]>([]);
