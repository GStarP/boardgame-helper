import { Asset } from "expo-asset";
import { unzip } from "react-native-zip-archive";
import { PLUGIN_DIR } from "./const";
import * as FileSystem from "expo-file-system";

const TEST_PLUGIN_DIR = PLUGIN_DIR + "/chwazi";

export async function mockUnzip(): Promise<void> {
  const asset = await Asset.fromModule(require("@/assets/plugins/chwazi.zip"));
  const fromUri = (await asset.downloadAsync()).localUri;
  if (!fromUri) {
    console.error("download asset failed", asset);
    return;
  }
  const res = await unzip(fromUri, TEST_PLUGIN_DIR);
  console.log(fromUri, TEST_PLUGIN_DIR, res);
}

export async function testMockUnzip(): Promise<void> {
  console.log(await FileSystem.readDirectoryAsync(TEST_PLUGIN_DIR));
  console.log(await FileSystem.readDirectoryAsync(TEST_PLUGIN_DIR + "/assets"));
}
