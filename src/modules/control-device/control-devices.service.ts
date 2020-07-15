/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ControlDeviceCreateDto,
  ControlDeviceUpdateDto,
} from './dtos/control-device.dto';
import { MqttService } from 'src/shared/modules/mqtt/mqtt.service';
import { firebase } from '../../firebase';
import { uuid } from 'uuidv4';
import { PUBLISH_TOPIC } from 'src/environments';
import { SettingDto, Setting } from './dtos/setting.dto';
import { StatusControl } from './control.constant';

@Injectable()
export class ControlDeviceService {
  constructor(private readonly mqttService: MqttService) {}

  async get(id: string) {
    const devices = await this.list();
    const device = devices.find((item) => item.id == id);
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
      status_device: StatusControl.FREE,
    });
  }

  async toggleStatusControl(id: string) {
    const control = await this.get(id);
    if (control.status_device === StatusControl.FREE) {
      this.update(control.id, { status_device: StatusControl.USED });
    } else {
      this.update(control.id, { status_device: StatusControl.FREE });
    }
  }

  async update(id: string, args: ControlDeviceUpdateDto | any) {
    const { status, level, status_device } = args;
    const client = this.mqttService.client;
    const ref = firebase.app().database().ref();
    const device_ref = ref.child('device').child('control');
    const [path, device] = await this.getByIdWithUUID(id);
    device.level = level ? level : device.level;
    device.status = status ? status : device.status;
    device.status_device = status_device ? status_device : device.status_device;
    const payload = {
      device_id: id,
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
  private async getSetting() {
    const ref = firebase.app().database().ref();
    const setting_ref = ref.child('setting');
    let setting;
    await setting_ref.once('value', (snap) => {
      setting = Object.entries(snap.val()).map((item) => item[1]);
    });
    return setting;
  }

  private async updateSetting(setting: Setting) {
    const ref = firebase.app().database().ref();
    const setting_ref = ref.child('setting');
    const { small, medium, large } = setting;
    setting_ref.child('small').set(small);
    setting_ref.child('medium').set(medium);
    setting_ref.child('large').set(large);
    return setting;
  }

  async setting(args: SettingDto) {
    let setting = await this.getSetting();
    if (args.setting) {
      setting = await this.updateSetting(args.setting);
    }
    return setting;
  }
}
