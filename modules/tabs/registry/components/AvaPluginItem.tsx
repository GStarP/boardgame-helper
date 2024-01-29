import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Button } from 'react-native-paper'

import PluginIcon from '@/components/PluginIcon'
import { i18nKeys } from '@/i18n/keys'
import { installPlugin } from '@/modules/common/plugin/biz'
import { downloadPercentageText } from '@/modules/download/biz'
import { InstallStats } from '@/modules/download/store'
import { j_plugins } from '@/modules/tabs/home/store'
import { COLOR_PRIMARY } from '@/utils/style'

import { PluginDetail } from '../store'

interface Props {
  plugin: PluginDetail
  stats?: InstallStats
}

export default function AvaPluginItem({ plugin, stats }: Props) {
  const { t } = useTranslation()

  const { version, pluginId, pluginName, pluginIcon, pluginDesc, pluginSize } =
    plugin

  const downloading = stats !== undefined
  const { size, totalSize } = { size: 0, totalSize: 0, ...stats }

  const install = () => {
    // if already downloading, don't install again
    if (downloading) return
    installPlugin(plugin)
    ToastAndroid.show(
      `${pluginName} ${t(i18nKeys.TOAST_INSTALL_START)}`,
      ToastAndroid.SHORT
    )
  }

  const installedPlugins = useAtomValue(j_plugins)
  const installedVersion = installedPlugins.find((p) => p.pluginId === pluginId)
    ?.version
  const isLatest = installedVersion === version

  return (
    <View style={styles.container}>
      <PluginIcon className="h-full" source={pluginIcon} />
      <View className="ml-4 flex-1 h-full">
        <Text className="text-[16px] font-bold" numberOfLines={1}>
          {pluginName}
        </Text>

        <Text className="text-[12px] mb-[2px] text-text3" numberOfLines={1}>
          {pluginDesc}
        </Text>

        <View className="flex-row">
          <Text className="text-[10px] tracking-wider text-text3">
            v{version}
          </Text>
          <Text className="text-[10px] mx-1 text-text3">|</Text>
          <Text className="text-[10px] text-text3">{pluginSize}</Text>
        </View>
      </View>

      <View className="mr-auto">
        {
          <Button
            className="w-full"
            onPress={install}
            textColor={COLOR_PRIMARY}
            disabled={isLatest || downloading}
          >
            {downloading
              ? downloadPercentageText(size, totalSize)
              : isLatest
              ? t(i18nKeys.TEXT_INSTALLED)
              : installedVersion
              ? t(i18nKeys.TEXT_UPDATE)
              : t(i18nKeys.TEXT_INSTALL)}
          </Button>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 96,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 0.5,
  },
  icon: {
    height: '100%',
    aspectRatio: 1,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
})
