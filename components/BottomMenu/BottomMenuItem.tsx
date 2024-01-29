import { Text, ViewStyle } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { hideBottomModal } from '../BottomSheet'

type BottomMenuActions = {
  close: () => void
}

export type BottomMenuItemProps = {
  label: string
  color?: string
  onPress?: (actions: BottomMenuActions) => void

  style?: ViewStyle
}

export default function BottomMenuItem(props: BottomMenuItemProps) {
  const { label, onPress, color = '#000', style } = props

  const actions = {
    close: () => hideBottomModal(),
  }

  const pressHandler = onPress
    ? () => {
        onPress(actions)
      }
    : undefined

  return (
    <TouchableRipple
      className="items-center justify-center h-14 px-4"
      style={[style]}
      onPress={pressHandler}
      disabled={pressHandler === undefined}
    >
      <Text
        className="text-[16px]"
        style={{
          color: color,
        }}
      >
        {label}
      </Text>
    </TouchableRipple>
  )
}
