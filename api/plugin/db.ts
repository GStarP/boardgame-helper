import type { PluginInfo } from '@/store/plugin/types'
import * as FileSystem from 'expo-file-system'
import { logger } from '@/modules/logger'
import { i18nKeys } from '@/i18n/keys'
import { getDB } from '@/api/db'
import type { SQLiteDatabase } from 'expo-sqlite'

const TABLE_PLUGIN = 'plugins'

export async function createPluginTableIfNotExist(db: SQLiteDatabase) {
  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(
      `CREATE TABLE IF NOT EXISTS ${TABLE_PLUGIN} (version TEXT, pluginId TEXT PRIMARY KEY, pluginName TEXT, pluginIcon TEXT);`
    )
  })
}

export async function getAllPlugins(): Promise<PluginInfo[]> {
  const db = getDB()
  return new Promise((resolve) => {
    db.transactionAsync(async (tx) => {
      const res = await tx.executeSqlAsync(`SELECT * FROM ${TABLE_PLUGIN};`)
      const plugins = res.rows as PluginInfo[]
      resolve(plugins)
    })
  })
}

export async function insertPlugin(plugin: PluginInfo): Promise<void> {
  logger.debug('[insertPlugin]', plugin)
  const { version, pluginId, pluginName, pluginIcon } = plugin
  const db = getDB()
  return new Promise((resolve) => {
    db.transactionAsync(async (tx) => {
      const sql = `INSERT OR REPLACE INTO ${TABLE_PLUGIN} (version, pluginId, pluginName, pluginIcon) VALUES ("${version}", "${pluginId}", "${pluginName}", "${pluginIcon}");`
      logger.debug('[SQL]', sql)
      await tx.executeSqlAsync(sql)
      resolve()
    })
  })
}

export async function deletePlugin(pluginId: string): Promise<void> {
  logger.debug(`deletePlugin: ${pluginId}`)
  const db = getDB()
  return new Promise((resolve) => {
    db.transactionAsync(async (tx) => {
      const sql = `DELETE FROM ${TABLE_PLUGIN} WHERE pluginId = "${pluginId}";`
      logger.debug('[SQL]', sql)
      await tx.executeSqlAsync(sql)
      resolve()
    })
  })
}

const BUILTIN_PLUGINS_FILE =
  FileSystem.documentDirectory + 'builtin-plugins.txt'

export async function getBuiltinPlugins(): Promise<string[]> {
  // init
  if (!(await FileSystem.getInfoAsync(BUILTIN_PLUGINS_FILE)).exists) {
    FileSystem.writeAsStringAsync(
      BUILTIN_PLUGINS_FILE,
      JSON.stringify([
        '@board-game-toolbox/plugin-chwazi',
        '@board-game-toolbox/plugin-scorer',
      ])
    )
  }
  try {
    const plugins: string[] = JSON.parse(
      await FileSystem.readAsStringAsync(BUILTIN_PLUGINS_FILE)
    )
    return plugins
  } catch (e) {
    logger.error('[getBuiltinPlugins]', e)
    return []
  }
}

export async function insertBuiltinPlugins(
  pluginPackageName: string
): Promise<string[]> {
  if (!(await FileSystem.getInfoAsync(BUILTIN_PLUGINS_FILE)).exists) {
    throw new Error(`file not exists: ${BUILTIN_PLUGINS_FILE}`)
  }
  const plugins: string[] = JSON.parse(
    await FileSystem.readAsStringAsync(BUILTIN_PLUGINS_FILE)
  )
  if (plugins.indexOf(pluginPackageName) !== -1) {
    throw new Error(i18nKeys.COMMON_ALREADY_EXISTS)
  }
  const finalPlugins = [...plugins, pluginPackageName]
  await FileSystem.writeAsStringAsync(
    BUILTIN_PLUGINS_FILE,
    JSON.stringify(finalPlugins)
  )
  return finalPlugins
}
