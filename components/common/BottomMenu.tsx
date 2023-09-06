import { StyleSheet } from 'react-native'
import { hideBottomModal, showBottomModal } from './BottomSheet'
import { View, Text } from 'react-native'
import { ATOM_STYLE } from '@/modules/common/style'
import { EMPTY_FUNC } from '@/modules/common/const'
import { TouchableRipple } from 'react-native-paper'

export interface BottomMenuItemProps {
  label: string
  onPress?: () => void
  color?: string
  closeMenuAfterPress?: boolean
}

function BottomMenuItem(props: BottomMenuItemProps) {
  const {
    label,
    onPress = EMPTY_FUNC,
    color = '#000',
    closeMenuAfterPress = true,
  } = props

  const pressHandler = () => {
    onPress()
    if (closeMenuAfterPress) {
      hideBottomModal()
    }
  }

  return (
    <TouchableRipple
      style={[
        styles.item,
        ATOM_STYLE.flex,
        ATOM_STYLE.flexRow,
        ATOM_STYLE.itemsCenter,
        ATOM_STYLE.justifyCenter,
      ]}
      onPress={pressHandler}
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
    <View style={[ATOM_STYLE.flex, styles.menu]}>
      {items.map((item) => (
        <BottomMenuItem key={`btm-menu:${item.label}`} {...item} />
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
