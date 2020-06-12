import { Controller, Post, Body } from '@nestjs/common';
import { RoomService } from './room.service';

@Controller()
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create(@Body() args) {
    return this.roomService.create(args);
  }
}
