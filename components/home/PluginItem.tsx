import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { View, Text, StyleSheet } from 'react-native'
import type { PluginInfo } from '@/store/plugin/types'
import { uninstallPlugin } from '@/modules/plugin'
import { showBottomMenu } from '@/components/common/BottomMenu'
import { COLOR_RED } from '@/modules/common/style'
import { useTranslation } from 'react-i18next'
import { i18nKeys } from '@/i18n/keys'
import PluginIcon from '@/components/common/PluginIcon'

export default function PluginItem(props: PluginInfo) {
  const { version, pluginId, pluginName, pluginIcon } = props

  const { t } = useTranslation()

  const router = useRouter()
  const toPluginPage = () => {
    router.push({
      pathname: '/plugin',
      params: {
        id: pluginId,
        name: pluginName,
      },
    })
  }

  const uninstall = () => {
    showBottomMenu([
      {
        label: `${t(i18nKeys.COMMON_VERSION)}: ${version}`,
      },
      {
        label: t(i18nKeys.TEXT_UNINSTALL),
        color: COLOR_RED,
        onPress: () => {
          uninstallPlugin(pluginId)
        },
      },
    ])
  }

  return (
    <View style={styles.pluginItem}>
      <TouchableOpacity
        delayLongPress={300}
        style={styles.container}
        onPress={toPluginPage}
        onLongPress={uninstall}
      >
        <PluginIcon className="w-[90%]" source={pluginIcon} />
        <Text style={styles.pluginName} numberOfLines={2}>
          {pluginName}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  pluginItem: {
    width: '16%',
    marginLeft: '7.2%',
  },
  container: {
    alignItems: 'center',
  },
  pluginName: {
    width: '100%',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    height: 48,
    marginTop: 8,
  },
})
