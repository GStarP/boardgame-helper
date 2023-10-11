import type { ViewProps } from 'react-native'
import { View } from 'react-native'
import { Image } from 'expo-image'
import { IMG_BLUR_HASH } from '@/modules/common/const'

interface Props extends ViewProps {
  source: string
}

export default function PluginIcon(props: Props) {
  const { source, ...otherProps } = props
  return (
    <View className="p-2 rounded bg-white aspect-square" {...otherProps}>
      <Image
        className="w-full h-full"
        source={source}
        placeholder={IMG_BLUR_HASH}
      />
    </View>
  )
}
