import { EventEmitter } from 'events';
/**
 * Fan device
 */
class Fan extends EventEmitter {
  id;
  level;
  status;
  constructor(id: number) {
    super();
    this.id = id;
    this.level = 0;
    this.status = 0;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setValue(level, status = 1) {
    this.level = level;
    this.status = status;
    this.emit('change', this.toJSON());
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toJSON() {
    return {
      device_id: 'id2_' + String(this.id),
      value: this.status
        ? [String(this.status), String(this.level)]
        : [String(this.status)],
    };
  }
}

export { Fan };
