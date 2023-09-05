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
import { TEXT_MISSING_PLUGIN_NAME } from '@/i18n'

interface Props {
  pluginId: string
}

export default function InstallTaskItem(props: Props) {
  const { pluginId } = props

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
              TEXT_MISSING_PLUGIN_NAME}
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
      <View style={styles.hr} />
    </View>
  )
}

function stateText(
  state: InstallTaskState,
  size: number,
  totalSize: number
): string {
  if (state === InstallTaskState.WAITING) return '等待中'
  else if (state === InstallTaskState.UNZIPPING) return '解压中'
  else if (state === InstallTaskState.REGISTERING) return '安装中'
  else if (state === InstallTaskState.DOWNLOADING)
    return `${size} / ${totalSize}`
  else if (state === InstallTaskState.PAUSED) return '已暂停'
  else if (state === InstallTaskState.ERROR) return '发生错误'
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 96,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  icon: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: 4,
  },
  line1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  close: {
    marginRight: 12,
  },
  info: { display: 'flex', marginLeft: 8, flex: 1, height: '100%' },
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
  hr: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    height: 0.5,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
})
