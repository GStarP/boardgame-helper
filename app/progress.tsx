import InstallTaskItem from '@/components/progress/InstallTaskItem'
import { TEXT_NO_INSTALL_TASK } from '@/i18n'
import { COLOR_FONT_THIRD, ATOM_STYLE } from '@/modules/common/style'
import { j_tasks } from '@/store/progress'
import { useAtomValue } from 'jotai'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const MemoInstallTaskItem = React.memo(InstallTaskItem)

export default function ProgressScreen() {
  const pluginIds = useAtomValue(j_tasks)
  return (
    <View>
      {pluginIds.length > 0 ? (
        pluginIds.map((pluginId) => (
          <MemoInstallTaskItem key={'task@' + pluginId} pluginId={pluginId} />
        ))
      ) : (
        <View
          style={[ATOM_STYLE.wFull, ATOM_STYLE.flex, ATOM_STYLE.itemsCenter]}
        >
          <Text style={styles.text}>{TEXT_NO_INSTALL_TASK}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: COLOR_FONT_THIRD,
    marginTop: '8%',
  },
})
