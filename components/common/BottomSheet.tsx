import React from 'react'
import ActionSheet, {
  SheetManager,
  SheetProps,
  registerSheet,
} from 'react-native-actions-sheet'

function BottomSheet(
  props: SheetProps<{
    content: React.JSX.Element
  }>
) {
  return (
    <ActionSheet
      id={props.sheetId}
      openAnimationConfig={{
        bounciness: 0,
      }}
    >
      {props.payload?.content ?? null}
    </ActionSheet>
  )
}

const BOTTOM_SHEET_ID = 'btm'
registerSheet(BOTTOM_SHEET_ID, BottomSheet)

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
