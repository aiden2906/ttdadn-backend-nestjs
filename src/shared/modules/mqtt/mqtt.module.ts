import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';

@Module({
  controllers: [],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
