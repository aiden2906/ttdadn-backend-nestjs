import { Controller } from '@nestjs/common';
import { MqttService } from './shared/modules/mqtt/mqtt.service';
import { AppGateway } from './app.gateway';
import { SUBSCRIBE_TOPIC, APP_ID, USERNAME, PASSWORD } from './environments';
import { firebase } from './firebase';
import { ControlDeviceService } from './modules/control-device/control-devices.service';
import { SensorDeviceService } from './modules/sensor-device/sensor-device.service';
import { NotificationService } from './modules/notification/notification.service';

@Controller()
export class AppController {
  constructor(
    private readonly mqttService: MqttService,
    private readonly gateway: AppGateway,
    private readonly controlDeviceService: ControlDeviceService,
    private readonly sensorDeviceService: SensorDeviceService,
    private readonly notificationService: NotificationService,
  ) {}
  async onModuleInit(): Promise<void> {
    console.log('appControllerRunning');
    await this.mqttService.connect(APP_ID, USERNAME, PASSWORD, SUBSCRIBE_TOPIC); //topic1
    const ref = firebase.app().database().ref();
    const sensor_device_ref = ref.child('device').child('sensor');
    const control_device_ref = ref.child('device').child('control');
    const notification_ref = ref.child('notification');
    const setting_ref = ref.child('setting');
    let setting;
    setting_ref.once('value', (snap) => {
      setting = Object.entries(snap.val()).map((item) => item[1]);
    });
    setting_ref.on('value', (snapshot) => {
      setting = Object.entries(snapshot.val()).map((item) => item[1]);
    });
    sensor_device_ref.on('value', (snapshot) => {
      const devices = Object.entries(snapshot.val()).map((item) => item[1]);
      this.gateway.wss.emit('sensorChange', devices);
    });
    control_device_ref.on('value', (snapshot) => {
      const devices = Object.entries(snapshot.val()).map((item) => item[1]);
      this.gateway.wss.emit('controlChange', devices);
    });
    notification_ref.on('value', (snapshot) => {
      const notifications = Object.entries(snapshot.val()).map(
        (item) => item[1],
      );
      this.gateway.wss.emit('count_notifications', notifications);
    });
    this.mqttService.client.on('message', async (topic, message) => {
      console.log(`${topic} : ${message}`);
      const value_message = JSON.parse(message.toString());
      const { device_id, values } = value_message[0];
      const [temp, humi] = values;
      const [large, medium, small] = setting;
      if (small < temp) {
        this.notificationService.create({
          device_id,
          content: `Độ ẩm trên ${small}%, nhiệt độ hiện tại ${temp}`,
        });
      } else if (medium < temp) {
        this.notificationService.create({
          device_id,
          content: `Độ ẩm trên ${medium}%, nhiệt độ hiện tại ${temp}`,
        });
      } else if (large < temp) {
        this.notificationService.create({
          device_id,
          content: `Độ ẩm trên ${large}%, nhiệt độ hiện tại ${temp}`,
        });
      }
      this.sensorDeviceService.update(device_id, { temp, humi });
    });
  }
}
