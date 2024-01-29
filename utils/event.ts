import mitt from 'mitt'
import type { Emitter, EventType, Handler } from 'mitt'

export class EventEmitter<Events extends Record<EventType, unknown>> {
  bus: Emitter<Events>

  constructor() {
    this.bus = mitt()
  }

  on<Key extends keyof Events>(
    event: Key | Key[],
    callback: Handler<Events[Key]>
  ) {
    const keys = Array.isArray(event) ? event : [event]
    keys.forEach((k) => this.bus.on(k, callback))
  }

  once<Key extends keyof Events>(
    event: Key | Key[],
    callback: Handler<Events[Key]>
  ) {
    const keys = Array.isArray(event) ? event : [event]
    keys.forEach((k) => {
      const cb = (e: Events[Key]) => {
        callback(e)
        this.bus.off(k, cb)
      }
      this.bus.on(k, cb)
    })
  }

  /**
   * if callback not specify, remove all
   */
  off<Key extends keyof Events>(
    event: Key | Key[],
    callback?: Handler<Events[Key]>
  ) {
    const keys = Array.isArray(event) ? event : [event]
    keys.forEach((k) => this.bus.off(k, callback))
  }

  emit<Key extends keyof Events>(event: Key, payload?: Events[Key]) {
    this.bus.emit(event, payload!)
  }
}
