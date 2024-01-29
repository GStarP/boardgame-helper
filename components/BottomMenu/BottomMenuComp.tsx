import { StyleSheet, View } from 'react-native'

import { COLOR_TEXT_4 } from '@/utils/style'

import BottomMenuItem, { BottomMenuItemProps } from './BottomMenuItem'

type Props = {
  items: BottomMenuItemProps[]
}

export default function BottomMenuComp({ items }: Props) {
  return (
    <View className="pb-2">
      {items.map((item, index) => (
        <BottomMenuItem
          key={item.label}
          {...item}
          style={index !== items.length - 1 ? styles.divider : {}}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR_TEXT_4,
  },
})
