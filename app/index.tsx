import { StyleSheet, View, Text } from 'react-native'
import PluginItem from '@/components/home/PluginItem'
import { j_plugins, setAvaPlugins, setPlugins } from '@/store/plugin/index'
import { useEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAtomValue } from 'jotai'
import { getAllPlugins } from '@/api/plugin/db'
import { fetchAvailablePlugins } from '@/api/plugin'
import ProgressPageIcon from '@/components/common/ProgressPageIcon'
import { ATOM_STYLE, COLOR_FONT_THIRD } from '@/modules/common/style'
import { recoverSavedTask } from '@/modules/plugin/task/savable'
import { installPlugin } from '@/modules/plugin'
import { useTranslation } from 'react-i18next'
import { i18nKeys } from '@/i18n/keys'
import { changeLanguage } from '@/i18n'

function HeaderButtons() {
  const router = useRouter()
  const toRegistryPage = () => {
    fetchAvailablePlugins().then((res) => setAvaPlugins(res))
    router.push({
      pathname: '/registry',
    })
  }
  return (
    <View style={styles.buttons}>
      <TouchableOpacity onPress={toRegistryPage}>
        <MaterialCommunityIcons name="toolbox" size={28} />
      </TouchableOpacity>
      <ProgressPageIcon style={styles.btn} />
      <TouchableOpacity onPress={changeLanguage} style={styles.btn}>
        <MaterialCommunityIcons name="translate" size={28} />
      </TouchableOpacity>
    </View>
  )
}

export default function HomeScreen() {
  const { t } = useTranslation()
  // plugins
  const plugins = useAtomValue(j_plugins)
  useEffect(() => {
    getAllPlugins().then((res) => setPlugins(res))
  }, [])

  // header button
  const nav = useNavigation()
  useEffect(() => {
    nav.setOptions({
      headerRight: () => <HeaderButtons />,
    })
  }, [nav])

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
