/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, BadRequestException } from '@nestjs/common';
import { ControlDeviceCreateDto } from './dtos/control-device.dto';
import { MqttService } from 'src/shared/modules/mqtt/mqtt.service';
import { firebase } from '../../firebase';
import { uuid } from 'uuidv4';
import { PUBLISH_TOPIC } from 'src/environments';

@Injectable()
export class ControlDeviceService {
  constructor(private readonly mqttService: MqttService) {}

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
    const device_ref = ref.child('device').child('control');
    let devices = null;
    await device_ref.once('value', (snap) => {
      devices = Object.entries(snap.val()).map((item) => item[1]);
    });
    console.log(devices);
    return devices;
  }

  async create(args: ControlDeviceCreateDto) {
    const { id, status, level } = args;
    const ref = firebase.app().database().ref();
    const device_ref = ref.child('device').child('control');
    const path = uuid();
    device_ref.child(path).set({
      id,
      status,
      level,
    });
  }

  async update(id: string, args) {
    console.log(id);
    console.log(args);
    const { status, level } = args;
    const client = this.mqttService.client;

    //change database
    const ref = firebase.app().database().ref();
    const device_ref = ref.child('device').child('control');
    const [path, device] = await this.getByIdWithUUID(id);

    device.level = level ? level : device.level;
    device.status = status ? status : device.status;

    //change device
    const payload = {
      device_id: 'LightD',
      values: [`${device.status}`, `${device.level}`],
    };
    const payloadJSON = JSON.stringify([payload]);
    client.publish(PUBLISH_TOPIC, payloadJSON);
    if (!device.history) {
      device.history = {};
    }
    device.history[`${Date.now()}`] = {
      status: device.status,
      level: device.level,
    };
    const key_history = Object.keys(device.history);
    if (key_history.length > 100) {
      delete device.history[key_history[0]];
    }
    device_ref.child(path).set(device);
    return args;
  }

  async delete(id: string) {
    const ref = firebase.app().database().ref();
    const device_ref = ref.child('device').child('control');
    const device = await this.getByIdWithUUID(id);
    device_ref.child(device[0]).remove();
    return device[1];
  }

  async getByIdWithUUID(id: string) {
    const ref = firebase.app().database().ref();
    const device_ref = ref.child('device').child('control');
    let device = null;
    await device_ref.once('value', (snap) => {
      device = Object.entries(snap.val()).find(
        (item: any) => item[1].id === id,
      );
    });
    return device;
  }
}
