import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { IMG_BLUR_HASH } from '@/modules/common/const'
import { COLOR_FONT_FOURTH, COLOR_FONT_SECONDARY } from '@/modules/common/style'
import { TouchableOpacity } from 'react-native-gesture-handler'
import React from 'react'
import { InstallTaskState } from '@/modules/plugin/types'
import { useAtomValue } from 'jotai'
import { j_task_progress_family, taskMap } from '@/store/progress'
import { useTranslation } from 'react-i18next'
import { i18nKeys } from '@/i18n/keys'
import i18n from '@/i18n'

interface Props {
  pluginId: string
}

export default function InstallTaskItem(props: Props) {
  const { pluginId } = props

  const { t } = useTranslation()

  const { state, size, targetSize } = useAtomValue(
    j_task_progress_family(pluginId)
  )

  const togglePause = () => {
    if (canTaskResume(state)) {
      taskMap.get(pluginId)?.run()
    } else if (state === InstallTaskState.DOWNLOADING) {
      taskMap.get(pluginId)?.pause()
    }
  }

  const cancel = () => {
    taskMap.get(pluginId)?.cancel()
  }

  return (
    <View style={styles.container}>
      <Image
        source={taskMap.get(pluginId)?.plugin.pluginIcon ?? ''}
        style={styles.icon}
        placeholder={IMG_BLUR_HASH}
      />
      <View style={styles.info}>
        <View style={styles.line1}>
          <Text style={styles.name}>
            {taskMap.get(pluginId)?.plugin.pluginName ??
              t(i18nKeys.TEXT_MISSING_PLUGIN_NAME)}
          </Text>
          <TouchableOpacity style={styles.close} onPress={cancel}>
            <MaterialCommunityIcons
              name="close"
              size={16}
              color={COLOR_FONT_SECONDARY}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.state}>{stateText(state, size, targetSize)}</Text>
        <View style={styles.progressContainer} />
      </View>
      <TouchableOpacity style={styles.pause} onPress={togglePause}>
        <MaterialCommunityIcons name={stateBtnIcon(state)} size={32} />
      </TouchableOpacity>
    </View>
  )
}

function stateText(
  state: InstallTaskState,
  size: number,
  totalSize: number
): string {
  if (state === InstallTaskState.WAITING) return i18n.t(i18nKeys.TEXT_WAITING)
  else if (state === InstallTaskState.UNZIPPING)
    return i18n.t(i18nKeys.TEXT_UNZIPPING)
  else if (state === InstallTaskState.REGISTERING)
    return i18n.t(i18nKeys.TEXT_REGISTERING)
  else if (state === InstallTaskState.DOWNLOADING)
    return `${size} / ${totalSize}`
  else if (state === InstallTaskState.PAUSED)
    return i18n.t(i18nKeys.TEXT_PAUSED)
  else if (state === InstallTaskState.ERROR) return i18n.t(i18nKeys.TEXT_ERROR)
  return ''
}

function stateBtnIcon(state: InstallTaskState) {
  if (canTaskResume(state)) return 'play-circle-outline'
  else if (state === InstallTaskState.DOWNLOADING) return 'pause-circle-outline'
  return 'blank'
}

/**
 * utils
 */
function canTaskResume(state: InstallTaskState): boolean {
  return (
    [
      InstallTaskState.WAITING,
      InstallTaskState.PAUSED,
      InstallTaskState.ERROR,
    ].indexOf(state) !== -1
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
    borderRadius: 4,
  },
  line1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  close: {
    marginRight: 12,
  },
  info: { marginLeft: 16, flex: 1, height: '100%' },
  name: {
    fontSize: 16,
    marginBottom: 4,
  },
  state: { color: COLOR_FONT_SECONDARY, fontSize: 12, marginBottom: 4 },
  progressContainer: {
    width: '100%',
    height: 4,
    borderRadius: 4,
    backgroundColor: COLOR_FONT_FOURTH,
  },
  pause: {
    width: 32,
    height: 32,
    marginLeft: 8,
  },
})
