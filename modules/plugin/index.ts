import * as FileSystem from "expo-file-system";

export function getPluginUri(pluginId: string): string {
  return FileSystem.documentDirectory + `plugins/${pluginId}/index.html`;
}

export * from "./const";
