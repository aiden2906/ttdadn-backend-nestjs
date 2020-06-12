import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ControlDeviceModule } from '../control-device/control-device.module';
import { SensorDeviceModule } from '../sensor-device/sensor-device.module';

@Module({
  imports: [ControlDeviceModule, SensorDeviceModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
