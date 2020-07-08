/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../shared/auth/jwt-auth.guard';

@Controller('api.user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async list() {
    return this.userService.list();
  }

  @Post()
  async create(@Body() args) {
    console.log(args);
    return this.userService.create(args);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    const userId = req.user.id;
    return this.userService.getMe(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async get(@Param('id') id: number) {
    return this.userService.get(id);
  }

  @Put(':id/active')
  @UseGuards(JwtAuthGuard)
  async active(@Req() req, @Param('id') id: number) {
    const userId = req.user && req.user.id;
    return this.userService.active(id);
  }

  @Put(':id/disable')
  @UseGuards(JwtAuthGuard)
  async disable(@Req() req, @Param('id') id: number) {
    const userId = req.user && req.user.id;
    return this.userService.disable(id);
  }

  @Put('reset-password')
  async resetPassword(@Body() args) {
    return this.userService.resetPassword(args);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(@Body() args, @Req() req) {
    const userId = req.user.id;
    console.log(userId);
    console.log(args);
    return this.userService.update(userId, args);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }

  @Put('login')
  async login(@Body() args) {
    console.log(args);
    return this.userService.login(args);
  }

  @Put('forget-password')
  async forgotPassword(@Body() args) {
    return this.userService.forgotPassword(args);
  }
}
