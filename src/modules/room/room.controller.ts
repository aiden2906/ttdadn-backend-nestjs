/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Get,
  Param,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';

@Controller('api.room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() args) {
    return this.roomService.create(args);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.roomService.getById(id);
  }
  @Get()
  async list() {
    return this.roomService.list();
  }


  // @Put()
  // async update(@Body() args) {
  //   return this.roomService.update();
  // }
}
