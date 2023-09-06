import { i18nKeys } from '@/i18n/keys'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Tabs, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'
import React from 'react'
import { ATOM_STYLE } from '@/modules/common/style'

function HeaderButtons() {
  const router = useRouter()
  return (
    <View style={[ATOM_STYLE.flexRow]}>
      <IconButton
        icon="download"
        size={28}
        onPress={() => {
          router.push('/progress')
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
const MemoHeaderButtons = React.memo(HeaderButtons)

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
        headerRight: () => <MemoHeaderButtons />,
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
