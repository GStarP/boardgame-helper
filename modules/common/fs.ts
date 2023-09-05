import * as FileSystem from 'expo-file-system'
import { logger } from '@/modules/logger'

export async function createDirIfNeed(path: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(path)
  if (!info.exists || !info.isDirectory) {
    logger.info(`no dir so create: ${path}`)
    // if not dir, delete first
    if (info.exists && !info.isDirectory) {
      await FileSystem.deleteAsync(path)
    }
    await FileSystem.makeDirectoryAsync(path)
  }
}
