import { StyleSheet, View, Text } from 'react-native'
import PluginItem from '@/components/home/PluginItem'
import { j_plugins, setPlugins } from '@/store/plugin/index'
import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { getAllPlugins } from '@/api/plugin/db'
import { ATOM_STYLE, COLOR_FONT_THIRD } from '@/modules/common/style'
import { recoverSavedTask } from '@/modules/plugin/task/savable'
import { installPlugin } from '@/modules/plugin'
import { useTranslation } from 'react-i18next'
import { i18nKeys } from '@/i18n/keys'

export default function HomeScreen() {
  const { t } = useTranslation()
  // plugins
  const plugins = useAtomValue(j_plugins)
  useEffect(() => {
    getAllPlugins().then((res) => setPlugins(res))
  }, [])

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
        <View
          style={[ATOM_STYLE.wFull, ATOM_STYLE.flex, ATOM_STYLE.itemsCenter]}
        >
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
    paddingHorizontal: '6%',
    paddingVertical: '8%',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  btn: {
    marginRight: 12,
  },
  none: {
    fontSize: 16,
    color: COLOR_FONT_THIRD,
  },
})
