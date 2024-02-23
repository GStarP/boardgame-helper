import { showBottomModal } from '@/components/BottomSheet'

import BottomMenuComp from './BottomMenuComp'
import { BottomMenuItemProps } from './BottomMenuItem'

export function showBottomMenu(items: BottomMenuItemProps[]) {
  if (items.length === 0) return
  showBottomModal(BottomMenuComp({ items }))
}
