import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import PluginIcon from '@/components/PluginIcon'
import i18n from '@/i18n'
import { i18nKeys } from '@/i18n/keys'
import { InstallTask } from '@/modules/common/plugin/install-task'
import { InstallTaskState } from '@/modules/common/plugin/install-task.type'

import { InstallStats } from '../store'

interface Props {
  task: InstallTask
  stats?: InstallStats
}

export default function InstallTaskItem({ task, stats }: Props) {
  const { t } = useTranslation()

  const { state, size, totalSize } = {
    state: InstallTaskState.WAITING,
    size: 0,
    totalSize: 0,
    ...stats,
  }
  const text = useStateText(state, size, totalSize)
  const icon = useStateIcon(state)

  const toggleTaskRun = () => {
    if (InstallTask.canRun(task.state)) {
      task.run()
    } else if (InstallTask.canPause(task.state)) {
      task.pause()
    }
  }

  const cancelTask = () => {
    task.cancel()
  }

  return (
    <View style={styles.container}>
      <PluginIcon style={styles.icon} source={task.plugin.pluginIcon ?? ''} />
      <View style={styles.info}>
        <View style={styles.line1}>
          <Text style={styles.name}>
            {task.plugin.pluginName ?? t(i18nKeys.TEXT_MISSING_PLUGIN_NAME)}
          </Text>
          <TouchableOpacity style={styles.close} onPress={cancelTask}>
            <MaterialCommunityIcons
              name="close"
              size={16}
              color={'rgba(0, 0, 0, 0.6)'}
            />
          </TouchableOpacity>
        </View>
        <Text className="text-text2" style={styles.state}>
          {text}
        </Text>
        <View style={styles.progressContainer} className="bg-text4" />
      </View>
      <TouchableOpacity style={styles.pause} onPress={toggleTaskRun}>
        <MaterialCommunityIcons name={icon} size={32} />
      </TouchableOpacity>
    </View>
  )
}

function useStateText(
  state: InstallTask['state'],
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

function useStateIcon(state: InstallTask['state']) {
  if (InstallTask.canRun(state)) return 'play-circle-outline'
  else if (InstallTask.canPause(state)) return 'pause-circle-outline'
  return 'blank'
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
  state: { fontSize: 12, marginBottom: 4 },
  progressContainer: {
    width: '100%',
    height: 4,
    borderRadius: 4,
  },
  pause: {
    width: 32,
    height: 32,
    marginLeft: 8,
  },
})
