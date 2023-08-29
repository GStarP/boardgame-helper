import type { PluginInfo } from "@/store/plugin/types";
import * as FileSystem from "expo-file-system";
import { logger } from "@/modules/logger";

// @FIX not allow info includes `|` and `,`
// ${id}|${name},${icon}
// chwazi|Chwazi,file://user/i.png\n
const DB_FILE = FileSystem.documentDirectory + "plugins.txt";

const ID_BREAK = "|";
const INFO_BREAK = ",";
const LINE_BREAK = "\n";

export async function getAllPlugins(): Promise<PluginInfo[]> {
  const info = await FileSystem.getInfoAsync(DB_FILE);
  if (info.exists && !info.isDirectory) {
    const content = await FileSystem.readAsStringAsync(DB_FILE);
    const plugins: PluginInfo[] = [];

    const pluginLines = content.split(LINE_BREAK);
    for (const pluginLine of pluginLines) {
      if (pluginLine === "") continue;
      const [pluginId, pluginInfoLine] = pluginLine.split(ID_BREAK);
      const [pluginName, pluginIcon] = pluginInfoLine.split(INFO_BREAK);
      plugins.push({
        pluginId,
        pluginName,
        pluginIcon,
      });
    }

    return plugins;
  } else {
    return [];
  }
}

// @FIX concurrent issue
export async function insertPlugin(plugin: PluginInfo): Promise<void> {
  logger.debug("insertPlugin:", plugin);
  const info = await FileSystem.getInfoAsync(DB_FILE);
  let rawContent = "";
  if (info.exists && !info.isDirectory) {
    rawContent = await FileSystem.readAsStringAsync(DB_FILE);
  }
  // if same id exists, return
  const pluginLines = rawContent.split(LINE_BREAK);
  if (
    pluginLines.find((line) => line.startsWith(plugin.pluginId + ID_BREAK)) !==
    void 0
  ) {
    return;
  }
  const content =
    rawContent +
    plugin.pluginId +
    ID_BREAK +
    plugin.pluginName +
    INFO_BREAK +
    plugin.pluginIcon +
    LINE_BREAK;
  FileSystem.writeAsStringAsync(DB_FILE, content);
}

export async function deletePlugin(pluginId: string): Promise<void> {
  logger.debug(`deletePlugin: ${pluginId}`);
  const content = await FileSystem.readAsStringAsync(DB_FILE);

  const pluginLines = content.split(LINE_BREAK);
  let index = -1;
  for (let i = 0; i < pluginLines.length; i++) {
    if (pluginLines[i].startsWith(pluginId + ID_BREAK)) {
      index = i;
      break;
    }
  }

  if (index !== -1) {
    pluginLines.splice(index, 1);
    FileSystem.writeAsStringAsync(
      DB_FILE,
      pluginLines.join(LINE_BREAK) + LINE_BREAK
    );
  }
}
