import { Controller } from '@nestjs/common';
import { MqttService } from './shared/modules/mqtt/mqtt.service';
import { AppGateway } from './app.gateway';
import { SUBSCRIBE_TOPIC, APP_ID, USERNAME, PASSWORD } from './environments';
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
      const devices = Object.entries(snapshot.val()).map((item) => item[1]);
      this.gateway.wss.emit('sensorChange', devices);
    });
    controlDeviceRef.on('value', (snapshot) => {
      const devices = Object.entries(snapshot.val()).map((item) => item[1]);
      this.gateway.wss.emit('sensorChange', devices);
    });

    this.mqttService.client.on('message', async (topic, message) => {
      //sensor id1,  fan id2
      console.log(`${topic} : ${message}`);
      const valueMessage = JSON.parse(message.toString());
      const { device_id, values } = valueMessage[0];
      console.log(values);
      const [temp, humi] = values;
      this.sensorDeviceService.update(device_id, { temp, humi });
    });
  }
}
