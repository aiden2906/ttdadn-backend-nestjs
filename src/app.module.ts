import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './shared/modules/mqtt/mqtt.module';
import { AppGateway } from './app.gateway';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [MqttModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
