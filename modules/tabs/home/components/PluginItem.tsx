import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native'

import { showBottomMenu } from '@/components/BottomMenu'
import PluginIcon from '@/components/PluginIcon'
import { i18nKeys } from '@/i18n/keys'
import { uninstallPlugin } from '@/modules/common/plugin/biz'
import { COLOR_RED } from '@/utils/style'

import { PluginInfo } from '../store'

export default function PluginItem(props: PluginInfo) {
  const { version, pluginId, pluginName, pluginIcon } = props

  const { t } = useTranslation()

  const router = useRouter()
  const usePlugin = () => {
    router.push({
      pathname: '/webview',
      params: {
        id: pluginId,
        name: pluginName,
      },
    })
  }

  const onLongPress = () => {
    showBottomMenu([
      {
        label: `${t(i18nKeys.COMMON_VERSION)}: ${version}`,
      },
      {
        label: t(i18nKeys.TEXT_UNINSTALL),
        color: COLOR_RED,
        onPress: async (actions) => {
          await uninstallPlugin(pluginId)
          actions.close()
        },
      },
    ])
  }

  return (
    <View className="w-[16%] ml-[7.2%]">
      <TouchableOpacity
        className="items-center"
        delayLongPress={300}
        onPress={usePlugin}
        onLongPress={onLongPress}
      >
        <PluginIcon className="w-[90%]" source={pluginIcon} />
        <Text className="text-xs mt-1" numberOfLines={2}>
          {pluginName}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
