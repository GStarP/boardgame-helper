import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import PluginItem from '@/components/home/PluginItem'
import { i18nKeys } from '@/i18n/keys'
import { COLOR_TEXT_3 } from '@/modules/common/style'
import { installPlugin } from '@/modules/plugin'
import { recoverSavedTask } from '@/modules/plugin/task/savable'
import { j_plugins } from '@/store/plugin/index'

export default function HomeScreen() {
  const { t } = useTranslation()
  // plugins
  const plugins = useAtomValue(j_plugins)

  // recover saved task
  useEffect(() => {
    recoverSavedTask().then((tasks) => {
      tasks.forEach((savable) => installPlugin(savable.p, savable.o))
    })
  }, [])

  return (
    <View style={styles.pluginList}>
      {plugins.length > 0 ? (
        plugins.map((plugin) => (
          <PluginItem key={'plugin@' + plugin.pluginId} {...plugin} />
        ))
      ) : (
        <View className="w-full items-center">
          <Text style={styles.none}>{t(i18nKeys.TEXT_NO_PLUGIN_1)}</Text>
          <Text style={styles.none}>{t(i18nKeys.TEXT_NO_PLUGIN_2)}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  pluginList: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 24,
  },
  none: {
    fontSize: 16,
    color: COLOR_TEXT_3,
  },
})
