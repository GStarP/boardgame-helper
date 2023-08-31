import type { PluginDetail } from "@/store/plugin/types";

// @TODO mock
export async function fetchAvailablePlugins(): Promise<PluginDetail[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          pluginId: "chwazi",
          pluginName: "Chwazi",
          pluginIcon: "",
          pluginDesc: "a random startup chosing plugin",
        },
      ]);
    }, 1000);
  });
}
