import { Module } from '@nestjs/common';
import { MqttModule } from 'src/shared/modules/mqtt/mqtt.module';
import { SensorDeviceController } from './sensor-device.controller';
import { SensorDeviceService } from './sensor-device.service';

@Module({
  imports: [MqttModule],
  controllers: [SensorDeviceController],
  providers: [SensorDeviceService],
  exports: [SensorDeviceService],
})
export class SensorDeviceModule {}
