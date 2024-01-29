import ActionSheet, { SheetProps } from 'react-native-actions-sheet'

export default function BottomSheet(
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
