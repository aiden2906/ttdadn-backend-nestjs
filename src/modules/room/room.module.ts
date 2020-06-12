import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { SensorDeviceModule } from '../sensor-device/sensor-device.module';
import { ControlDeviceModule } from '../control-device/control-device.module';

@Module({
  imports: [SensorDeviceModule, ControlDeviceModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
