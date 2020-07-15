/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { firebase } from '../../firebase';
import { Status_Notification } from './notification.constant';
import { AppGateway } from 'src/app.gateway';
import { NotificationCreateDto } from './dtos/notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly gateway: AppGateway) {}

  async create(args: NotificationCreateDto, type: string) {
    const { device_id, content } = args;
    const ref = firebase.app().database().ref();
    const notification_ref = ref.child('notification');
    const id = await this.genId();
    const new_notification = {
      id,
      content,
      device_id,
      status: Status_Notification.NEW,
      created_at: new Date().getTime(),
      type,
    };
    this.gateway.wss.emit('notification', new_notification);
    notification_ref.child(String(id)).set(new_notification);
    return new_notification;
  }

  async get(id: number) {
    const notifications = await this.list();
    const exist_notification = notifications.find((item) => item.id === id);
    if (!exist_notification) {
      throw new NotFoundException('not found notification');
    }
    if (exist_notification.status === Status_Notification.NEW) {
      const ref = firebase.app().database().ref();
      const notification_ref = ref.child('notification');
      exist_notification.status = Status_Notification.SEEN;
      notification_ref
        .child(String(exist_notification.id))
        .set(exist_notification);
    }
    return exist_notification;
  }

  async list() {
    const ref = firebase.app().database().ref();
    const notification_ref = ref.child('notification');
    let notifications;
    await notification_ref.once('value', (snap) => {
      notifications = Object.entries(snap.val()).map((item) => item[1]);
    });
    return notifications;
  }

  async delete(id: number) {
    const ref = firebase.app().database().ref();
    const notification_ref = ref.child('notification');
    notification_ref.child(String(id)).remove();
  }

  private async genId(): Promise<number> {
    const notifications = await this.list();
    const notification = notifications.pop();
    return parseInt(notification.id) + 1;
  }
}
