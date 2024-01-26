import * as FileSystem from 'expo-file-system'

export async function createDirIfNeed(path: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(path)
  if (!info.exists || !info.isDirectory) {
    // if not dir, delete first
    if (info.exists && !info.isDirectory) {
      await FileSystem.deleteAsync(path)
    }
    await FileSystem.makeDirectoryAsync(path)
  }
}
