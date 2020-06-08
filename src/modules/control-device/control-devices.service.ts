/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ControlDeviceDto,
  ControlDeviceCreateDto,
} from './dtos/control-device.dto';
import { MqttService } from 'src/shared/modules/mqtt/mqtt.service';
import { firebase } from '../../firebase';
import { uuid } from 'uuidv4';

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
    const deviceRef = ref.child('device').child('control');
    let devices = null;
    await deviceRef.once('value', (snap) => {
      devices = Object.entries(snap.val()).map((item) => item[1]);
    });

    return devices;
  }

  async create(args: ControlDeviceCreateDto) {
    const { id, status, level } = args;
    const ref = firebase.app().database().ref();
    const deviceRef = ref.child('device').child('control');
    const path = uuid();
    deviceRef.child(path).set({
      id,
      status,
      level,
    });
  }

  async update(id: string, args: ControlDeviceDto) {
    const { status, level } = args;

    //TODO: publish data to T_1 

    const ref = firebase.app().database().ref();
    const deviceRef = ref.child('device').child('control');
    const device = await this.getByIdWithUUID(id);
    deviceRef.child(device[0]).set({
      id,
      status,
      level,
    });
    return args;
  }

  async delete(id: string) {
    const ref = firebase.app().database().ref();
    const deviceRef = ref.child('device').child('control');
    const device = await this.getByIdWithUUID(id);
    deviceRef.child(device[0]).remove();
    return device[1];
  }

  async getByIdWithUUID(id: string) {
    const ref = firebase.app().database().ref();
    const deviceRef = ref.child('device').child('control');
    let device = null;
    await deviceRef.once('value', (snap) => {
      device = Object.entries(snap.val()).find(
        (item: any) => item[1].id === id,
      );
    });
    return device;
  }
}
