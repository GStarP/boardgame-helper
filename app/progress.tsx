import InstallTaskItem from '@/components/progress/InstallTaskItem'
import { i18nKeys } from '@/i18n/keys'
import { COLOR_FONT_THIRD, ATOM_STYLE } from '@/modules/common/style'
import { j_tasks } from '@/store/progress'
import { useAtomValue } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet } from 'react-native'

const MemoInstallTaskItem = React.memo(InstallTaskItem)

export default function ProgressScreen() {
  const { t } = useTranslation()
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
          <Text style={styles.text}>{t(i18nKeys.TEXT_NO_INSTALL_TASK)}</Text>
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
