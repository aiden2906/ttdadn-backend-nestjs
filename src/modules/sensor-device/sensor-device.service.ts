/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, BadRequestException } from '@nestjs/common';
import { firebase } from 'src/firebase';
import { uuid } from 'uuidv4';

@Injectable()
export class SensorDeviceService {
  private async genId(): Promise<number> {
    const users = await this.list();
    return users.length + 1;
  }

  async get(id: string) {
    console.log(id);
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

  async create(args) {
    const { id, temp, humi } = args;
    const ref = firebase.app().database().ref();
    const device_ref = ref.child('device').child('sensor');
    const path = uuid();
    device_ref.child(path).set({
      id,
      temp,
      humi,
    });
  }

  async update(id: string, args) {
    const { temp, humi } = args;
    const ref = firebase.app().database().ref();
    const device_ref = ref.child('device').child('sensor');
    const x = await this.getByIdWithUUID(id);
    if (!x) {
      await this.create({ id, temp, humi });
    }
    const [path, device] = await this.getByIdWithUUID(id);
    device.humi = humi;
    device.temp = temp;
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
    let device = null;
    await device_ref.once('value', (snap) => {
      device = Object.entries(snap.val()).find(
        (item: any) => item[1].id === id,
      );
    });
    return device;
  }
}
