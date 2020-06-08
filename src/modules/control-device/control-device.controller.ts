/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { MqttService } from 'src/shared/modules/mqtt/mqtt.service';
import { AppGateway } from 'src/app.gateway';
import {
  ControlDeviceDto,
  ControlDeviceCreateDto,
} from './dtos/control-device.dto';
import { ControlDeviceService } from './control-devices.service';

@Controller('control')
export class ControlDeviceController {
  constructor(
    private readonly mqttService: MqttService,
    private readonly controlDeviceService: ControlDeviceService,
  ) {}

  @Get()
  async list() {
    return this.controlDeviceService.list();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.controlDeviceService.get(id);
  }

  @Post()
  async create(@Body() args: ControlDeviceCreateDto) {
    return this.controlDeviceService.create(args);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() args: ControlDeviceDto) {
    return this.controlDeviceService.update(id, args);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.controlDeviceService.delete(id);
  }
}
