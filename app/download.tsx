import { useAtomValue } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { i18nKeys } from '@/i18n/keys'
import InstallTaskItem from '@/modules/download/components/InstallTaskItem'
import { DownloadStore } from '@/modules/download/store'

const MemoInstallTaskItem = React.memo(InstallTaskItem)

export default function DownloadScreen() {
  const installTaskMap = useAtomValue(DownloadStore.installTaskMap)
  const tasks = [...installTaskMap.values()]

  const installTaskStatusMap = useAtomValue(DownloadStore.installTaskStatusMap)

  return (
    <View>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <MemoInstallTaskItem
            key={task.plugin.pluginId}
            task={task}
            installStatus={installTaskStatusMap.get(task.plugin.pluginId)}
          />
        ))
      ) : (
        <View className="w-full items-center">
          <EmptyText />
        </View>
      )}
    </View>
  )
}

function EmptyText() {
  const { t } = useTranslation()
  return (
    <Text className="text-base text-text3 mt-4">
      {t(i18nKeys.TEXT_NO_INSTALL_TASK)}
    </Text>
  )
}
