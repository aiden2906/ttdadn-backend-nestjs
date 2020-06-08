import { Controller } from '@nestjs/common';
import { MqttService } from './shared/modules/mqtt/mqtt.service';
import { AppGateway } from './app.gateway';
import {
  SUBSCRIBE_TOPIC,
  APP_ID,
  USERNAME,
  PASSWORD,
} from './environments';
import { firebase } from './firebase';
import { ControlDeviceService } from './modules/control-device/control-devices.service';
import { SensorDeviceService } from './modules/sensor-device/sensor-device.service';

@Controller()
export class AppController {
  constructor(
    private readonly mqttService: MqttService,
    private readonly gateway: AppGateway,
    private readonly controlDeviceService: ControlDeviceService,
    private readonly sensorDeviceService: SensorDeviceService,
  ) {}
  async onModuleInit(): Promise<void> {

    console.log('appControllerRunning');
    await this.mqttService.connect(APP_ID, USERNAME, PASSWORD, SUBSCRIBE_TOPIC); //topic1

    const ref = firebase.app().database().ref();
    const sensorDeviceRef = ref.child('device').child('sensor');
    const controlDeviceRef = ref.child('device').child('control');
    sensorDeviceRef.on('value', (snapshot) => {
      const devices = Object.entries(snapshot.val()).map(item=>item[1])
      this.gateway.wss.emit('sensorChange', devices)
    });
    controlDeviceRef.on('value', (snapshot) => {
      const devices = Object.entries(snapshot.val()).map(item=>item[1])
      this.gateway.wss.emit('sensorChange', devices)
    });

    this.mqttService.client.on('message', async (topic, message) => {
      //sensor id1,  fan id2
      const { id, value } = JSON.parse(message);
      const [status, level] = value;
      console.log(`${topic} : ${message}`);
      const check = String(message).match(/id1/);
      if (check) {
        const [path, sensor] = await this.sensorDeviceService.getByIdWithUUID(
          id,
        );
        sensor.status = status ? Number(status) : sensor.status;
        sensor.level = level ? Number(level) : sensor.level;
        sensorDeviceRef.child(path).set(sensor);
      } else {
        const [path, control] = await this.controlDeviceService.getByIdWithUUID(
          id,
        );
        control.status = status ? status : control.status;
        control.level = level ? level : control.level;
        controlDeviceRef.child(path).set(control);
      }
    });
  }
}
