/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { firebase } from '../../firebase';
import { uuid } from 'uuidv4';
import { ControlDeviceService } from '../control-device/control-devices.service';
import { SensorDeviceService } from '../sensor-device/sensor-device.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly controlDeviceService: ControlDeviceService,
    private readonly sensorDeviceService: SensorDeviceService,
  ) {}
  async create(args) {
    const { deviceId, content } = args;
    const ref = firebase.app().database().ref();
    const notificationRef = ref.child('notification');
    const path = uuid();
    notificationRef.child(path).set({
      id: path,
      content,
      deviceId,
    });
    return {
      id: path,
      content,
      deviceId,
    };
  }

  async get(id: string) {
    const notifications = await this.list();
    const existNotification = notifications.find((item) => item.id === id);
    if (!existNotification) {
      throw new NotFoundException('not found notification');
    }
    return existNotification;
  }

  async list() {
    const ref = firebase.app().database().ref();
    const notificationRef = ref.child('notification');
    let notifications = null;
    await notificationRef.once('value', (snap) => {
      notifications = Object.entries(snap.val()).map((item) => item[1]);
    });
    return notifications;
  }

  async delete(id: string) {
    const ref = firebase.app().database().ref();
    const notificationRef = ref.child('notification');
    notificationRef.child(id).remove();
  }
}
