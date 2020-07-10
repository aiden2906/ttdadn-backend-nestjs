/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/shared/auth/jwt-auth.guard';

@Controller('api.notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list() {
    return this.notificationService.list();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() args) {
    return this.notificationService.create(args);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async get(@Param('id', new ParseIntPipe()) id: number) {
    return this.notificationService.get(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    return this.notificationService.delete(id);
  }
}
