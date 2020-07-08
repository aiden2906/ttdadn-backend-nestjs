/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SensorDeviceService } from './sensor-device.service';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';

@Controller('sensor')
export class SensorDeviceController {
  constructor(private readonly sensorDeviceService: SensorDeviceService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list() {
    return this.sensorDeviceService.list();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async get(@Param('id') id: string) {
    return this.sensorDeviceService.get(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() args) {
    return this.sensorDeviceService.create(args);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() args) {
    return this.sensorDeviceService.update(id, args);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return this.sensorDeviceService.delete(id);
  }
}
