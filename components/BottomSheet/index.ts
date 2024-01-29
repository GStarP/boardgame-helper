import { SheetManager, registerSheet } from 'react-native-actions-sheet'

import BottomSheet from './BottomSheetComp'

const BOTTOM_SHEET_ID = 'btm'

export function initBottomSheet() {
  registerSheet(BOTTOM_SHEET_ID, BottomSheet)
}

export function showBottomModal(content: React.JSX.Element) {
  SheetManager.show(BOTTOM_SHEET_ID, {
    payload: {
      content,
    },
  })
}

export function hideBottomModal() {
  SheetManager.hide(BOTTOM_SHEET_ID)
}
