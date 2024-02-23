import { useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { TextInput } from 'react-native-paper'

import { i18nKeys } from '@/i18n/keys'
import { addBuiltinPlugins } from '@/modules/common/plugin/biz'
import { fixPluginId } from '@/modules/common/plugin/fs-utils'
import { DownloadStore } from '@/modules/download/store'
import { batchUpdateAvaPlugins } from '@/modules/tabs/registry'
import RegistryPluginItem from '@/modules/tabs/registry/components/RegistryPluginItem'
import { RegistryStore } from '@/modules/tabs/registry/store'

const MemoRegistryPluginItem = React.memo(RegistryPluginItem)

export default function Registry() {
  const { t } = useTranslation()

  const rawPlugins = useAtomValue(RegistryStore.plugins)
  const plugins = rawPlugins.map((plugin) => ({
    ...plugin,
    // ! pluginId must be fixed to suit filesystem
    pluginId: fixPluginId(plugin.pluginId),
  }))

  const loading = useAtomValue(RegistryStore.loading)
  const installTaskStatusMap = useAtomValue(DownloadStore.installTaskStatusMap)

  const builtinPlugins = useAtomValue(RegistryStore.builtinPlugins)
  useEffect(() => {
    batchUpdateAvaPlugins(builtinPlugins)
  }, [builtinPlugins])

  if (loading) {
    return (
      <Text className="w-full text-center mt-4 text-base text-text3">
        {t(i18nKeys.TEXT_LOADING)}
      </Text>
    )
  }

  if (plugins === undefined || plugins.length === 0) {
    return (
      <Text className="w-full text-center mt-4 text-base text-text3">
        {t(i18nKeys.TEXT_NO_DATA)}
      </Text>
    )
  }

  return (
    <View className="flex flex-1">
      {/* TODO: should use FlashList  */}
      <View className="px-2 py-4">
        {plugins.map((plugin) => (
          <MemoRegistryPluginItem
            key={plugin.pluginId}
            plugin={plugin}
            installStatus={installTaskStatusMap.get(plugin.pluginId)}
          />
        ))}
      </View>
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
        className="bg-[#EEE]"
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
        cursorColor="#000"
        underlineColor="transparent"
        activeUnderlineColor="transparent"
      />
    </View>
  )
}
