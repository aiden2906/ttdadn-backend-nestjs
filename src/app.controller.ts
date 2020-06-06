import { Controller } from '@nestjs/common';
import { MqttService } from './shared/modules/mqtt/mqtt.service';
import { Fan, Sensor } from './shared/devices';
import {
  generateValueSensor,
  conditionFan,
  extractorFan,
} from './shared/utils/utils';
import dotenv = require('dotenv');
import { AppGateway } from './app.gateway';
dotenv.config();
const SUBSCRIBE_TOPIC = process.env.SUBSCRIBE_TOPIC;
const PUBLISH_TOPIC = process.env.PUBLISH_TOPIC;
const APP_ID = process.env.APP_ID;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const TIME_CHANGE = process.env.TIME_CHANGE;
const TIME_SEND = process.env.TIME_SEND;

@Controller()
export class AppController {
  constructor(
    private readonly mqttService: MqttService,
    private readonly gateway: AppGateway,
  ) {}
  async onModuleInit(): Promise<void> {
    // connect to broker
    await this.mqttService.connect(APP_ID, USERNAME, PASSWORD, SUBSCRIBE_TOPIC);

    //initial sensor
    const sensor = new Sensor(1);
    sensor.on('change', (data) => {
      this.gateway.wss.emit('sensorChange', data);
    });
    await this.mqttService.faker([sensor], generateValueSensor, TIME_CHANGE);
    await this.mqttService.publish(
      this.mqttService.broker,
      PUBLISH_TOPIC,
      [sensor],
      TIME_SEND,
    );

    //initial fan
    const fan = new Fan(1);
    fan.on('change', (data) => {
      this.gateway.wss.emit('fanChange', data);
    });
    await this.mqttService.publish(
      this.mqttService.broker,
      PUBLISH_TOPIC,
      [fan],
      TIME_SEND,
    );
    await this.mqttService.subscribe(
      this.mqttService.broker,
      [fan],
      conditionFan,
      extractorFan,
    );
  }
}
