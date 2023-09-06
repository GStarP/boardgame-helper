import AvaPluginItem from '@/components/registry/AvaPluginItem'
import { j_ava_plugins, setAvaPlugins } from '@/store/plugin'
import { View } from 'react-native'
import { useAtomValue } from 'jotai'
import React from 'react'
import { useFocusEffect } from 'expo-router'
import { fetchAvailablePlugins } from '@/api/plugin'

const MemoAvaPluginItem = React.memo(AvaPluginItem)

export default function Registry() {
  // @TODO useRequest
  const plugins = useAtomValue(j_ava_plugins)
  useFocusEffect(() => {
    fetchAvailablePlugins().then((res) => {
      setAvaPlugins(res)
    })
  })

  return (
    <View>
      {plugins.map((plugin) => (
        <MemoAvaPluginItem key={'avaPlugin@' + plugin.pluginId} {...plugin} />
      ))}
    </View>
  )
}
