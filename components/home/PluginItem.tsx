import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { View, Text, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import type { PluginInfo } from '@/store/plugin/types'
import { uninstallPlugin } from '@/modules/plugin'
import { showBottomMenu } from '@/components/common/BottomMenu'
import { COLOR_RED } from '@/modules/common/style'
import { useTranslation } from 'react-i18next'
import { i18nKeys } from '@/i18n/keys'

export default function PluginItem(props: PluginInfo) {
  const { pluginId, pluginName, pluginIcon } = props

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
        <Image source={pluginIcon} style={styles.pluginIcon} />
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
  pluginIcon: {
    borderRadius: 4,
    overflow: 'hidden',
    width: '90%',
    aspectRatio: 1,
    backgroundColor: '#FFF',
  },
  pluginName: {
    width: '100%',
    textAlign: 'center',
    lineHeight: 20,
    height: 56,
    marginTop: 8,
  },
})
