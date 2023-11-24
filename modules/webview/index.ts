export type PostMessage =
  // Console
  | {
      type: 0
      data: {
        // level
        l: 'debug' | 'info' | 'warn' | 'error'
        // message
        m: string
      }
    }
  // Toast
  | {
      type: 1
      data: {
        v: string
        // duration: 0-SHORT, 1-LONG
        d: 0 | 1
        // position: 0-TOP, 1-BOTTOM, 2-CENTER
        p: 0 | 1 | 2
      }
    }
