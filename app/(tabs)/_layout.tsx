import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Tabs, useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'

import { i18nKeys } from '@/i18n/keys'

function HeaderButtons() {
  const router = useRouter()
  return (
    <View className="flex-row">
      <IconButton
        icon="progress-download"
        size={28}
        onPress={() => {
          router.push('/download')
        }}
        style={styles.btn}
      />
      <IconButton
        icon={(props) => <MaterialIcons {...props} name="settings" />}
        size={28}
        onPress={() => {
          router.push('/settings')
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
            <MaterialCommunityIcons {...props} name="hammer-wrench" />
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
    </Tabs>
  )
}

const styles = StyleSheet.create({
  btn: {
    marginRight: -2,
  },
})
