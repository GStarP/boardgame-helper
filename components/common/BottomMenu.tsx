import { StyleSheet, TouchableOpacity } from 'react-native'
import { hideBottomModal, showBottomModal } from './BottomSheet'
import { View, Text } from 'react-native'
import { ATOM_STYLE } from '@/modules/common/style'
import { EMPTY_FUNC } from '@/modules/common/const'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export interface BottomMenuItemProps {
  label: string
  icon: 'delete'
  onPress?: () => void
  color?: string
  closeMenuAfterPress?: boolean
}

function BottomMenuItem(props: BottomMenuItemProps) {
  const {
    label,
    icon,
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
    <TouchableOpacity
      style={[
        styles.item,
        ATOM_STYLE.flex,
        ATOM_STYLE.flexRow,
        ATOM_STYLE.itemsCenter,
      ]}
      onPress={pressHandler}
    >
      <MaterialCommunityIcons
        style={styles.icon}
        name={icon}
        color={color}
        size={32}
      />
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
    </TouchableOpacity>
  )
}

export function showBottomMenu(items: BottomMenuItemProps[]) {
  if (items.length === 0) return
  showBottomModal(
    <View style={[ATOM_STYLE.flex]}>
      {items.map((item) => (
        <BottomMenuItem key={`btm-menu:${item.label}`} {...item} />
      ))}
    </View>
  )
}

const ITEM_HEIGHT = 100
const styles = StyleSheet.create({
  item: {
    height: ITEM_HEIGHT,
    paddingHorizontal: 24,
  },
  icon: {
    marginRight: 24,
  },
  label: {
    fontSize: 18,
    lineHeight: ITEM_HEIGHT,
  },
})
