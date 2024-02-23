import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Tabs, useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { IconButton } from 'react-native-paper'

import { i18nKeys } from '@/i18n/keys'

function HeaderButtons() {
  const router = useRouter()
  return (
    <View className="flex-row space-x-[-4px] pr-2">
      <IconButton
        icon="progress-download"
        size={28}
        onPress={() => {
          router.push('/download')
        }}
      />
    </View>
  )
}

export default function TabsLayoutView() {
  const { t } = useTranslation()

  return (
    <Tabs
      screenOptions={{
        tabBarIconStyle: {
          marginBottom: -4,
        },
        tabBarLabelStyle: {
          marginBottom: 4,
        },
        headerRight: () => <HeaderButtons />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t(i18nKeys.TITLE_HOME),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons {...props} name="toolbox" />
          ),
        }}
      />
      <Tabs.Screen
        name="registry"
        options={{
          title: t(i18nKeys.TITLE_REGISTRY),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons {...props} name="plus-box" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t(i18nKeys.TITLE_SETTINGS),
          tabBarIcon: (props) => <MaterialIcons {...props} name="settings" />,
        }}
      />
    </Tabs>
  )
}
