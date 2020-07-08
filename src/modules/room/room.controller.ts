/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() args) {
    return this.roomService.create(args);
  }
}