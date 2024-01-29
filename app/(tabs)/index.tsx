import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { i18nKeys } from '@/i18n/keys'
import PluginItem from '@/modules/tabs/home/components/PluginItem'
import { j_plugins } from '@/modules/tabs/home/store'

export default function HomeScreen() {
  const { t } = useTranslation()
  // plugins
  const plugins = useAtomValue(j_plugins)

  return (
    <View className="w-full flex-row flex-wrap py-6">
      {plugins.length > 0 ? (
        plugins.map((plugin) => (
          <PluginItem key={plugin.pluginId} {...plugin} />
        ))
      ) : (
        <View className="w-full items-center">
          <Text className="text-base text-text3">
            {t(i18nKeys.TEXT_NO_PLUGIN_1)}
          </Text>
          <Text className="text-base text-text3">
            {t(i18nKeys.TEXT_NO_PLUGIN_2)}
          </Text>
        </View>
      )}
    </View>
  )
}
