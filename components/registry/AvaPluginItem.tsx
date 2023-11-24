import type { PluginDetail } from '@/store/plugin/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet, Text, View, ToastAndroid } from 'react-native'
import { COLOR_FONT_SECONDARY } from '@/modules/common/style'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useAtomValue } from 'jotai'
import { j_task_progress_family } from '@/store/progress'
import { installPlugin } from '@/modules/plugin'
import { downloadPercentageText } from '@/modules/plugin/task/progress'
import { useTranslation } from 'react-i18next'
import { i18nKeys } from '@/i18n/keys'
import PluginIcon from '@/components/common/PluginIcon'

export default function AvaPluginItem(props: PluginDetail) {
  const { pluginId, pluginName, pluginIcon, pluginDesc } = props

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

  return (
    <View style={styles.container}>
      <PluginIcon className="h-full" source={pluginIcon} />
      <View style={styles.info}>
        <Text style={styles.name}>{pluginName}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {pluginDesc}
        </Text>
      </View>
      <View style={styles.box}>
        {downloading ? (
          <Text style={styles.text}>
            {downloadPercentageText(size, targetSize)}
          </Text>
        ) : (
          <TouchableOpacity onPress={install}>
            <MaterialCommunityIcons name="download" size={32} />
          </TouchableOpacity>
        )}
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
  info: { marginLeft: 16, flex: 1, height: '100%' },
  name: {
    fontSize: 16,
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: COLOR_FONT_SECONDARY,
  },
  box: {
    width: 48,
    alignItems: 'center',
  },
  icon: {
    height: '100%',
    aspectRatio: 1,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  text: { width: '100%', fontSize: 12, textAlign: 'center' },
})
