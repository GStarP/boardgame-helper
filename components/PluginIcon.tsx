import { Image } from 'expo-image'
import type { ViewProps } from 'react-native'
import { View } from 'react-native'

import { IMG_BLUR_HASH } from '@/utils/const'

type Props = ViewProps & {
  source: string
}

export default function PluginIcon(props: Props) {
  const { source, className, ...otherProps } = props
  return (
    <View
      className={'rounded aspect-square overflow-hidden ' + className}
      {...otherProps}
    >
      <Image
        className="w-full h-full"
        source={source}
        placeholder={IMG_BLUR_HASH}
        cachePolicy="none"
      />
    </View>
  )
}
