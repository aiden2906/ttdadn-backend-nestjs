import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { firebase } from '../../firebase';
import { uuid } from 'uuidv4';
import { SensorDeviceService } from '../sensor-device/sensor-device.service';
import { ControlDeviceService } from '../control-device/control-devices.service';

enum TypeDevice {
  SENSOR = 'sensor',
  CONTROL = 'control',
}

@Injectable()
export class RoomService {
  constructor(
    private readonly sensorDeviceService: SensorDeviceService,
    private readonly controlDeviceService: ControlDeviceService,
  ) {}
  async create(args) {
    const { name } = args;
    const ref = firebase.app().database().ref();
    const roomRef = ref.child('room');
    const rooms = await this.list();
    const existRoom = rooms.find((item) => item.name === name);
    if (existRoom) {
      throw new BadRequestException('room name already exist');
    }
    const path = uuid();
    const room = {
      id: path,
      name,
      controlDeviceIds: [],
      sensorDeviceIds: [],
    };
    await roomRef.child(path).set(room);
    return room;
  }

  async getById(id: string) {
    const rooms = await this.list();
    const existRoom = rooms.find((item) => item.id === id);
    if (!existRoom) {
      throw new NotFoundException('not found room');
    }
    return existRoom;
  }

  async list() {
    const ref = firebase.app().database().ref();
    const roomRef = ref.child('room');
    let rooms = null;
    await roomRef.once('value', (snap) => {
      rooms = Object.entries(snap.val()).map((item) => item[1]);
    });
    return rooms;
  }

  async addDevice(roomId: string, deviceId: string, typeDevice: TypeDevice) {
    if (typeDevice === TypeDevice.SENSOR) {
      await this.sensorDeviceService.get(deviceId);
      const room = await this.getById(roomId);
      room.sensorDeviceIds.push(deviceId);
    } else {
      await this.controlDeviceService.get(deviceId);
      const room = await this.getById(roomId);
      room.controlDeviceIds.push(deviceId);
    }
  }
}
