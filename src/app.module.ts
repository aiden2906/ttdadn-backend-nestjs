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

@Module({
  imports: [MqttModule, ConfigModule, ControlDeviceModule, SensorDeviceModule],
  controllers: [AppController],
  providers: [AppService, AppGateway, ControlDeviceService, SensorDeviceService],
})
export class AppModule {}
