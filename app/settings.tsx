import { MaterialIcons } from '@expo/vector-icons'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { Divider, List } from 'react-native-paper'

import { changeLanguage, j_lng } from '@/i18n'
import { i18nKeys } from '@/i18n/keys'

export default function SettingsScreen() {
  const { t } = useTranslation()
  const lng = useAtomValue(j_lng)

  return (
    <View>
      <List.Item
        left={(props) => (
          <MaterialIcons {...props} name="translate" size={24} />
        )}
        description={lng === 'zh' ? '中文' : 'English'}
        title={t(i18nKeys.TEXT_LANGUAGE)}
        onPress={() => changeLanguage()}
      />
      <Divider />
    </View>
  )
}
