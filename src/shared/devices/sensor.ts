import { EventEmitter } from 'events';
/**
 * sensor device
 */
class Sensor extends EventEmitter {
  id;
  status;
  moisture;
  constructor(id: number) {
    super();
    this.id = id;
    this.status = 0;
    this.moisture = 0;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setValue(moisture, status = 1) {
    this.moisture = moisture;
    this.status = status;
    this.emit('change', this.toJSON());
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  toJSON() {
    return {
      device_id: 'id1_' + String(this.id),
      value: [String(this.status), String(this.moisture)],
    };
  }
}

export { Sensor };
