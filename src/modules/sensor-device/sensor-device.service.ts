/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, BadRequestException } from '@nestjs/common';
import { firebase } from 'src/firebase';
import { uuid } from 'uuidv4';
import {
  SensorDeviceCreateDto,
  SensorDeviceUpdateDto,
} from './dtos/sensor-device.dto';
import { StatusSensor } from './sensor.constant';

@Injectable()
export class SensorDeviceService {
  private async genId(): Promise<number> {
    const users = await this.list();
    return users.length + 1;
  }

  async get(id: string) {
    const devices = await this.list();
    const device = devices.find((item) => item.id === id);
    if (!device) {
      throw new BadRequestException('not found device');
    }
    return device;
  }

  async list() {
    const ref = firebase.app().database().ref();
    const device_ref = ref.child('device').child('sensor');
    let devices = null;
    await device_ref.once('value', (snap) => {
      devices = Object.entries(snap.val()).map((item) => item[1]);
    });

    return devices;
  }

  async create(args: SensorDeviceCreateDto) {
    const { id, temp, humi } = args;
    const ref = firebase.app().database().ref();
    const device_ref = ref.child('device').child('sensor');
    const path = uuid();
    device_ref.child(path).set({
      id,
      temp,
      humi,
      status_device: StatusSensor.FREE,
    });
  }

  async toggleStatusSensor(id: string) {
    const sensor = await this.get(id);
    if (sensor.status_device === StatusSensor.FREE) {
      this.update(sensor.id, { status_device: StatusSensor.USED });
    } else {
      this.update(sensor.id, { status_device: StatusSensor.FREE });
    }
  }

  async update(id: string, args: SensorDeviceUpdateDto | any) {
    const { temp, humi, status_device } = args;
    const ref = firebase.app().database().ref();
    const device_ref = ref.child('device').child('sensor');
    const x = await this.getByIdWithUUID(id);
    if (!x) {
      await this.create({ id, temp, humi });
    }
    const [path, device] = await this.getByIdWithUUID(id);
    device.humi = humi ? humi : device.humi;
    device.temp = temp ? temp : device.temp;
    device.status_device = status_device ? status_device : device.status_device;
    if (!device.history) {
      device.history = {};
    }
    device.history[`${Date.now()}`] = { temp, humi };
    const key_history = Object.keys(device.history);
    if (key_history.length > 100) {
      delete device.history[key_history[0]];
    }
    device_ref.child(path).set(device);
    return args;
  }

  async delete(id: string) {
    const ref = firebase.app().database().ref();
    const device_ref = ref.child('device').child('sensor');
    const device = await this.getByIdWithUUID(id);
    device_ref.child(device[0]).remove();
    return device[1];
  }

  async getByIdWithUUID(id: string) {
    const ref = firebase.app().database().ref();
    const device_ref = ref.child('device').child('sensor');
    let device;
    await device_ref.once('value', (snap) => {
      device = Object.entries(snap.val()).find(
        (item: any) => item[1].id === id,
      );
    });
    return device;
  }
}
