import { Asset } from "expo-asset";
import { unzip } from "react-native-zip-archive";
import * as FileSystem from "expo-file-system";
import { getPluginDir } from "../util";

const TEST_PLUGIN_DIR = getPluginDir("chwazi");

export async function testUnzip(): Promise<void> {
  const asset = await Asset.fromModule(require("@/assets/plugins/chwazi.zip"));
  const fromUri = (await asset.downloadAsync()).localUri;
  if (!fromUri) {
    console.error("download asset failed", asset);
    return;
  }
  const res = await unzip(fromUri, TEST_PLUGIN_DIR);
  console.log(fromUri, TEST_PLUGIN_DIR, res);
}

export async function validateTestUnzip(): Promise<void> {
  console.log(await FileSystem.readDirectoryAsync(TEST_PLUGIN_DIR));
  console.log(await FileSystem.readDirectoryAsync(TEST_PLUGIN_DIR + "/assets"));
}
