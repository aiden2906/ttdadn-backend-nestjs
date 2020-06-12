/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { SensorDeviceService } from './sensor-device.service';

@Controller('sensor')
export class SensorDeviceController {
  constructor(private readonly sensorDeviceService: SensorDeviceService) {}

  @Get()
  async list() {
    return this.sensorDeviceService.list();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.sensorDeviceService.get(id);
  }

  @Post()
  async create(@Body() args) {
    return this.sensorDeviceService.create(args);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() args) {
    return this.sensorDeviceService.update(id, args);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.sensorDeviceService.delete(id);
  }
}
