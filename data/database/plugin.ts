import * as FileSystem from 'expo-file-system'

import { i18nKeys } from '@/i18n/keys'
import { logger } from '@/libs/logger'
import { PluginInfo } from '@/modules/tabs/home/store'

import { DB } from '.'

const TABLE_PLUGIN = 'plugins'

// TODO: need reject handling

export async function createPluginTableIfNotExist() {
  logger.debug('createPluginTableIfNotExist')

  const db = DB()
  await db.transactionAsync(async (tx) => {
    await tx.executeSqlAsync(
      `CREATE TABLE IF NOT EXISTS ${TABLE_PLUGIN} (version TEXT, pluginId TEXT PRIMARY KEY, pluginName TEXT, pluginIcon TEXT);`
    )
  })
}

export async function getAllPlugins(): Promise<PluginInfo[]> {
  logger.debug('getAllPlugins')

  const db = DB()
  return new Promise((resolve) => {
    db.transactionAsync(async (tx) => {
      const res = await tx.executeSqlAsync(`SELECT * FROM ${TABLE_PLUGIN};`)
      const plugins = res.rows as PluginInfo[]
      resolve(plugins)
    })
  })
}

export async function insertPlugin(plugin: PluginInfo): Promise<void> {
  logger.debug('insertPlugin', plugin)

  const { version, pluginId, pluginName, pluginIcon } = plugin
  const db = DB()
  return new Promise((resolve) => {
    db.transactionAsync(async (tx) => {
      const sql = `INSERT OR REPLACE INTO ${TABLE_PLUGIN} (version, pluginId, pluginName, pluginIcon) VALUES ("${version}", "${pluginId}", "${pluginName}", "${pluginIcon}");`
      await tx.executeSqlAsync(sql)
      resolve()
    })
  })
}

export async function deletePlugin(pluginId: string): Promise<void> {
  logger.debug('deletePlugin', pluginId)

  const db = DB()
  return new Promise((resolve) => {
    db.transactionAsync(async (tx) => {
      const sql = `DELETE FROM ${TABLE_PLUGIN} WHERE pluginId = "${pluginId}";`
      await tx.executeSqlAsync(sql)
      resolve()
    })
  })
}

const BUILTIN_PLUGINS_FILE = 'builtin-plugins.txt'
const builtInPlugins = [
  '@board-game-toolbox/plugin-chwazi',
  '@board-game-toolbox/plugin-scorer',
]

export async function getBuiltinPlugins(): Promise<string[]> {
  const fp = FileSystem.documentDirectory + BUILTIN_PLUGINS_FILE
  try {
    // if no file, create it
    if (!(await FileSystem.getInfoAsync(fp)).exists) {
      FileSystem.writeAsStringAsync(fp, JSON.stringify(builtInPlugins))
      return builtInPlugins
    }
    const plugins: string[] = JSON.parse(await FileSystem.readAsStringAsync(fp))
    return plugins
  } catch (e) {
    logger.error('getBuiltinPlugins', e)
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
