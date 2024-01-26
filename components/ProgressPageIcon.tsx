import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import type { StyleProp, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface Props {
  size?: number
  style?: StyleProp<ViewStyle>
}

export default function ProgressPageIcon(props: Props) {
  const { size = 28, style } = props

  const router = useRouter()
  const toProgressPage = () => {
    router.push({
      pathname: '/download',
    })
  }

  return (
    <TouchableOpacity onPress={toProgressPage} style={style}>
      <MaterialCommunityIcons name="progress-download" size={size} />
    </TouchableOpacity>
  )
}
