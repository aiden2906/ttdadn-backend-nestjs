import { Injectable, Logger } from '@nestjs/common';
import mqtt = require('mqtt');
import dotenv = require('dotenv');
dotenv.config();

const URL = process.env.MQTT_SERVER_URL;

@Injectable()
export class MqttService {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

  client = null;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async connect(clientId, username, password, topic) {
    this.client = mqtt.connect(URL, {
      clientId,
      username,
      password,
    });
    this.client.subscribe(topic, (err) => {
      if (err) {
        Logger.error(err.message);
      }
    });
    return this.client;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async publish(client, topic, devices, time) {
    for (const device of devices) {
      setInterval(() => {
        const message = device.toJSON();
        const payload = Buffer.from(JSON.stringify(message));
        client.publish(topic, payload);
      }, time);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async subscribe(client, devices, condition, extractor) {
    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        const id = condition(payload, topic);
        const device = devices[id];
        if (device) {
          device.setValue(...extractor(payload));
        }
      } catch (err) {
        Logger.error(err.message);
      }
    });
  }


  //temp
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async faker(devices, generate, time){
    devices = [...devices];
    return setInterval(() => {
        for (const device of devices){
            device.setValue(...generate());
        }
    }, time);
}
}
