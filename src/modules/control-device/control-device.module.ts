import { Module } from '@nestjs/common';
import { ControlDeviceService } from './control-devices.service';
import { ControlDeviceController } from './control-device.controller';
import { MqttModule } from 'src/shared/modules/mqtt/mqtt.module';

@Module({
  imports: [MqttModule],
  controllers: [ControlDeviceController],
  providers: [ControlDeviceService],
})
export class ControlDeviceModule {}
