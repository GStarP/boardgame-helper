import AvaPluginItem from '@/components/registry/AvaPluginItem'
import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  COLOR_BG_LIGHT,
  COLOR_FONT_THIRD,
  COLOR_PRIMARY,
} from '@/modules/common/style'
import { useTranslation } from 'react-i18next'
import { i18nKeys } from '@/i18n/keys'
import { useAtomValue } from 'jotai'
import { j_ava_loading, j_ava_plugins, j_builtin_plugins } from '@/store/plugin'
import { batchUpdateAvaPlugins } from '@/modules/registry'
import { TextInput } from 'react-native-paper'
import { addBuiltinPlugins } from '@/modules/plugin'

const MemoAvaPluginItem = React.memo(AvaPluginItem)

export default function Registry() {
  const { t } = useTranslation()

  const plugins = useAtomValue(j_ava_plugins)
  const loading = useAtomValue(j_ava_loading)

  const builtinPlugins = useAtomValue(j_builtin_plugins)
  useEffect(() => {
    batchUpdateAvaPlugins(builtinPlugins)
  }, [builtinPlugins])

  if (loading)
    return (
      <Text className="w-full text-center mt-4 text-base" style={[styles.hint]}>
        {t(i18nKeys.TEXT_LOADING)}
      </Text>
    )

  if (plugins === undefined || plugins.length === 0)
    return (
      <Text className="w-full text-center mt-4 text-base" style={[styles.hint]}>
        {t(i18nKeys.TEXT_NO_DATA)}
      </Text>
    )

  return (
    <View className="flex flex-1">
      {plugins.map((plugin) => (
        <MemoAvaPluginItem key={'ap@' + plugin.pluginId} {...plugin} />
      ))}
      <BuiltinPluginInput />
    </View>
  )
}

function BuiltinPluginInput() {
  const { t } = useTranslation()

  // for convenience, auto input prefix
  const [value, setValue] = useState('@board-game-toolbox/plugin-')

  return (
    <View className="mt-auto">
      <TextInput
        placeholder={t(i18nKeys.TEXT_ADD_BUILTIN_PLUGIN)}
        value={value}
        onChangeText={(text) => setValue(text)}
        right={
          <TextInput.Icon
            icon="plus"
            disabled={value === '' || !/[a-zA-Z0-9]$/.test(value)}
            onPress={() => addBuiltinPlugins(value)}
          />
        }
        selectionColor={COLOR_PRIMARY}
        cursorColor={COLOR_PRIMARY}
        style={{ backgroundColor: COLOR_BG_LIGHT }}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  hint: {
    color: COLOR_FONT_THIRD,
  },
})
