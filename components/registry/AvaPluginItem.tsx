import type { PluginDetail } from '@/store/plugin/types'
import { StyleSheet, Text, View, ToastAndroid } from 'react-native'
import { COLOR_FONT_THIRD, COLOR_PRIMARY } from '@/modules/common/style'
import { useAtomValue } from 'jotai'
import { j_task_progress_family } from '@/store/progress'
import { installPlugin } from '@/modules/plugin'
import { downloadPercentageText } from '@/modules/plugin/task/progress'
import { useTranslation } from 'react-i18next'
import { i18nKeys } from '@/i18n/keys'
import PluginIcon from '@/components/common/PluginIcon'
import { Button } from 'react-native-paper'
import { j_plugins } from '@/store/plugin'

export default function AvaPluginItem(props: PluginDetail) {
  const { version, pluginId, pluginName, pluginIcon, pluginDesc, pluginSize } =
    props

  const { t } = useTranslation()

  const { size, targetSize } = useAtomValue(j_task_progress_family(pluginId))
  const downloading = targetSize > 0

  const install = () => {
    // if already downloading, don't install again
    if (downloading) return
    installPlugin(props)
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

        <Text
          style={styles.font3}
          className="text-[12px] mb-[2px]"
          numberOfLines={1}
        >
          {pluginDesc}
        </Text>

        <View className="flex-row">
          <Text style={styles.font3} className="text-[10px] tracking-wider">
            v{version}
          </Text>
          <Text style={styles.font3} className="text-[10px] mx-1">
            |
          </Text>
          <Text style={styles.font3} className="text-[10px] ">
            {pluginSize}
          </Text>
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
              ? downloadPercentageText(size, targetSize)
              : isLatest
              ? t(i18nKeys.TEXT_INSTALLED)
              : installedVersion
              ? t(i18nKeys.TEXT_INSTALL)
              : t(i18nKeys.TEXT_UPDATE)}
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
  font3: {
    color: COLOR_FONT_THIRD,
  },
  icon: {
    height: '100%',
    aspectRatio: 1,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
})
