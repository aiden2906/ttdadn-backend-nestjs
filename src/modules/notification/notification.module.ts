import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ControlDeviceModule } from '../control-device/control-device.module';
import { SensorDeviceModule } from '../sensor-device/sensor-device.module';
import { AppGateway } from 'src/app.gateway';

@Module({
  imports: [ControlDeviceModule, SensorDeviceModule],
  controllers: [NotificationController],
  providers: [NotificationService, AppGateway],
  exports: [NotificationService],
})
export class NotificationModule {}
