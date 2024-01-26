export enum WebviewMessageType {
  CONSOLE,
  TOAST,
}

export enum ToastDuration {
  SHORT,
  LONG,
}

export enum ToastPosition {
  TOP,
  BOTTOM,
  CENTER,
}

export type WebviewMessage =
  // Console
  | {
      type: WebviewMessageType.CONSOLE
      data: {
        // level
        l: 'debug' | 'info' | 'warn' | 'error'
        // message
        m: string
      }
    }
  // Toast
  | {
      type: WebviewMessageType.TOAST
      data: {
        v: string
        // duration: 0-SHORT, 1-LONG
        d: ToastDuration
        // position: 0-TOP, 1-BOTTOM, 2-CENTER
        p: ToastPosition
      }
    }
