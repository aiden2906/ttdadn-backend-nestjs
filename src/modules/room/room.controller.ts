/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  Req,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';
import { RoomCreateDto } from './dtos/room.dto';

@Controller('api.room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() args: RoomCreateDto, @Req() req) {
    return this.roomService.create(args, req.user.username);
  }
  @Get('all-rest-device')
  async getAllRestDevice() {
    return this.roomService.getAllRestDevice();
  }
  @Get(':id/all-visible-device')
  async getVisibleDevice(@Param('id') id: string) {
    return this.roomService.getVisibleDevice(id);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.roomService.getById(id);
  }
  @Get()
  async list() {
    return this.roomService.list();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() args) {
    return this.roomService.update(id, args);
  }
}
