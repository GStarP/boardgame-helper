import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { Text, ToastAndroid, View } from 'react-native'
import { Button, Card, Chip } from 'react-native-paper'

import PluginIcon from '@/components/PluginIcon'
import { i18nKeys } from '@/i18n/keys'
import { installPlugin } from '@/modules/common/plugin/biz'
import { downloadPercentageText } from '@/modules/download/biz'
import { InstallStatus } from '@/modules/download/store'
import { j_plugins } from '@/modules/tabs/home/store'
import { formatFileSize } from '@/utils/format'

import { PluginDetail } from '../store'

type Props = {
  plugin: PluginDetail
  installStatus?: InstallStatus
}

export default function RegistryPluginItem({ plugin, installStatus }: Props) {
  const { t } = useTranslation()

  const { version, pluginId, pluginName, pluginIcon, pluginDesc, pluginSize } =
    plugin

  const downloading = installStatus !== undefined
  const { size, totalSize } = { size: 0, totalSize: 0, ...installStatus }

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
    <Card className="mb-4">
      <View className="flex-row p-4">
        <View>
          <PluginIcon className="h-12" source={pluginIcon} />
        </View>

        <View className="ml-3 mr-1 flex-1">
          <Text className="text-[18px] leading-[24px]">{pluginName}</Text>
          <Text
            className="text-[14px] leading-[24px] text-text2"
            numberOfLines={1}
          >
            {pluginDesc}
          </Text>
          <View className="flex-row space-x-2 mt-2">
            <Chip compact={true}>v{version}</Chip>
            <Chip>{formatFileSize(pluginSize)}</Chip>
          </View>
        </View>

        <View className="ml-auto justify-center">
          <Button onPress={install} disabled={isLatest || downloading}>
            {downloading
              ? downloadPercentageText(size, totalSize)
              : isLatest
              ? t(i18nKeys.TEXT_INSTALLED)
              : installedVersion
              ? t(i18nKeys.TEXT_UPDATE)
              : t(i18nKeys.TEXT_INSTALL)}
          </Button>
        </View>
      </View>
    </Card>
  )
}
