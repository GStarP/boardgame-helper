import mitt from "mitt";
import type { Emitter, EventType, Handler } from "mitt";

export class EventEmitter<Events extends Record<EventType, unknown>> {
  bus: Emitter<Events>;

  constructor() {
    this.bus = mitt();
  }

  on<Key extends keyof Events>(
    event: Key | Key[],
    callback: Handler<Events[Key]>
  ) {
    const keys = Array.isArray(event) ? event : [event];
    keys.forEach((k) => this.bus.on(k, callback));
  }

  /**
   * if callback not assign, remove all
   */
  removeListener<Key extends keyof Events>(
    event: Key | Key[],
    callback?: Handler<Events[Key]>
  ) {
    const keys = Array.isArray(event) ? event : [event];
    keys.forEach((k) => this.bus.off(k, callback));
  }

  emit<Key extends keyof Events>(event: Key, payload?: Events[Key]) {
    this.bus.emit(event, payload!);
  }
}
