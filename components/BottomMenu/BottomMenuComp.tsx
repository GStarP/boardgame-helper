import { StyleSheet, View } from 'react-native'

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
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  },
})
