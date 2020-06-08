import { Module } from '@nestjs/common';
import { MqttModule } from 'src/shared/modules/mqtt/mqtt.module';
import { SensorController } from './sensor-device.controller';
import { SensorDeviceService } from './sensor-device.service';

@Module({
  imports: [MqttModule],
  controllers: [SensorController],
  providers: [SensorDeviceService],
})
export class SensorDeviceModule {}
