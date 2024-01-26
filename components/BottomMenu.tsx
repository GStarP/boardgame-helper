import { StyleSheet, ViewStyle } from 'react-native'
import { Text, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { COLOR_TEXT_4 } from '@/utils/style'

import { hideBottomModal, showBottomModal } from './BottomSheet'

export interface BottomMenuItemProps {
  label: string
  onPress?: () => void
  color?: string
  closeMenuAfterPress?: boolean

  showDivider?: boolean
}

function BottomMenuItem(props: BottomMenuItemProps) {
  const {
    label,
    onPress,
    color = '#000',
    closeMenuAfterPress = true,
    showDivider,
  } = props

  const dividerStyle: ViewStyle | undefined = showDivider
    ? {
        borderBottomWidth: 1,
        borderBottomColor: COLOR_TEXT_4,
      }
    : undefined

  const pressHandler = onPress
    ? () => {
        onPress()
        if (closeMenuAfterPress) {
          hideBottomModal()
        }
      }
    : undefined

  return (
    <TouchableRipple
      className="items-center justify-center"
      style={[styles.item, dividerStyle]}
      onPress={pressHandler}
      disabled={pressHandler === undefined}
    >
      <Text
        style={[
          {
            color: color,
          },
          styles.label,
        ]}
      >
        {label}
      </Text>
    </TouchableRipple>
  )
}

export function showBottomMenu(items: BottomMenuItemProps[]) {
  if (items.length === 0) return
  showBottomModal(
    <View style={[styles.menu]}>
      {items.map((item, index) => (
        <BottomMenuItem
          key={`btm-menu:${item.label}`}
          {...item}
          showDivider={index !== items.length - 1}
        />
      ))}
    </View>
  )
}

const MD_SCALE = 1
const styles = StyleSheet.create({
  menu: {
    paddingBottom: 8,
  },
  item: {
    height: 56 * MD_SCALE,
    paddingHorizontal: 16 * MD_SCALE,
  },
  label: {
    fontSize: 18,
  },
})
