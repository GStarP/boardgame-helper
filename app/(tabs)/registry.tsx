import AvaPluginItem from '@/components/registry/AvaPluginItem'
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { ATOM_STYLE, COLOR_FONT_THIRD } from '@/modules/common/style'
import { useTranslation } from 'react-i18next'
import { i18nKeys } from '@/i18n/keys'
import { useAtomValue } from 'jotai'
import { j_ava_loading, j_ava_plugins } from '@/store/plugin'
import { BUILT_IN_PLUGIN_LIST, batchUpdateAvaPlugins } from '@/modules/registry'

const MemoAvaPluginItem = React.memo(AvaPluginItem)

batchUpdateAvaPlugins(BUILT_IN_PLUGIN_LIST)

export default function Registry() {
  const { t } = useTranslation()

  const plugins = useAtomValue(j_ava_plugins)
  const loading = useAtomValue(j_ava_loading)

  if (loading)
    return (
      <Text style={[ATOM_STYLE.wFull, ATOM_STYLE.textCenter, styles.hint]}>
        {t(i18nKeys.TEXT_LOADING)}
      </Text>
    )
  if (plugins === undefined || plugins.length === 0)
    return (
      <Text style={[ATOM_STYLE.wFull, ATOM_STYLE.textCenter, styles.hint]}>
        {t(i18nKeys.TEXT_NO_DATA)}
      </Text>
    )

  return (
    <View>
      {plugins.map((plugin) => (
        <MemoAvaPluginItem key={'avaPlugin@' + plugin.pluginId} {...plugin} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  hint: {
    marginTop: 16,
    fontSize: 16,
    color: COLOR_FONT_THIRD,
  },
})
