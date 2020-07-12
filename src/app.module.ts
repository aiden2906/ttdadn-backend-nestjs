import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './shared/modules/mqtt/mqtt.module';
import { AppGateway } from './app.gateway';
import { ConfigModule } from '@nestjs/config';
import { ControlDeviceModule } from './modules/control-device/control-device.module';
import { SensorDeviceModule } from './modules/sensor-device/sensor-device.module';
import { SensorDeviceService } from './modules/sensor-device/sensor-device.service';
import { ControlDeviceService } from './modules/control-device/control-devices.service';
import { UserModule } from './modules/user/user.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AuthModule } from './shared/auth/auth.module';
import { RoomModule } from './modules/room/room.module';

@Module({
  imports: [
    MqttModule,
    ConfigModule,
    ControlDeviceModule,
    SensorDeviceModule,
    UserModule,
    NotificationModule,
    AuthModule,
    RoomModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    ControlDeviceService,
    SensorDeviceService,
  ],
})
export class AppModule {}
