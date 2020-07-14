/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { firebase } from '../../firebase';
import { uuid } from 'uuidv4';
import { SensorDeviceService } from '../sensor-device/sensor-device.service';
import { ControlDeviceService } from '../control-device/control-devices.service';
import { RoomCreateDto } from './dtos/room.dto';

// enum TypeDevice {
//   SENSOR = 'sensor',
//   CONTROL = 'control',
// }

@Injectable()
export class RoomService {
  constructor(
    private readonly sensorDeviceService: SensorDeviceService,
    private readonly controlDeviceService: ControlDeviceService,
  ) {}
  async create(args: RoomCreateDto) {
    const { name, devices } = args;
    const ref = firebase.app().database().ref();
    const room_ref = ref.child('room');
    const rooms = await this.list();
    const existRoom = rooms.find((item) => item.name === name);
    if (existRoom) {
      throw new BadRequestException('room name already exist');
    }
    const path = uuid();
    const room = {
      id: path,
      name,
      controlDeviceIds: devices || [],
      sensorDeviceIds: [],
    };
    await room_ref.child(path).set(room);
    return room;
  }

  private async getByName(name: string) {
    const rooms = await this.list();
    const existRoom = rooms.find((room) => room.name === name);
    if (!existRoom) {
      throw new NotFoundException('not found room');
    }
    existRoom.devices = existRoom.controlDeviceIds
      ? await Promise.all(
          existRoom.controlDeviceIds.map((deviceId) => {
            return this.controlDeviceService.get(deviceId);
          }),
        )
      : [];
    return existRoom;
  }

  async getById(id: string) {
    const rooms = await this.list();
    const existRoom = rooms.find((item) => item.id == id);
    if (!existRoom) {
      throw new NotFoundException('not found room');
    }
    existRoom.devices = existRoom.controlDeviceIds
      ? await Promise.all(
          existRoom.controlDeviceIds.map((deviceId) => {
            return this.controlDeviceService.get(deviceId);
          }),
        )
      : [];
    return existRoom;
  }

  async list() {
    const ref = firebase.app().database().ref();
    const room_ref = ref.child('room');
    let rooms = null;
    await room_ref.once('value', (snap) => {
      rooms = Object.entries(snap.val()).map((item) => item[1]);
    });
    return rooms;
  }

  async update(id: string, args) {
    const { device_id } = args;
    const existRoom = await this.getById(id);
    if (!existRoom.controlDeviceIds) {
      existRoom.controlDeviceIds = [device_id];
    } else {
      if (existRoom.controlDeviceIds.includes(device_id)) {
        const index = existRoom.controlDeviceIds.indexOf(device_id);
        existRoom.controlDeviceIds.splice(index, 1);
      } else {
        existRoom.controlDeviceIds.push(device_id);
      }
    }
    existRoom.devices = existRoom.controlDeviceIds
      ? await Promise.all(
          existRoom.controlDeviceIds.map((deviceId) => {
            return this.controlDeviceService.get(deviceId);
          }),
        )
      : [];
    const ref = firebase.app().database().ref();
    const room_ref = ref.child('room');
    room_ref.child(existRoom.id).set(existRoom);
  }
}
