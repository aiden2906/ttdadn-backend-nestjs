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
import { ACGuard } from 'nest-access-control';
import { AuthGuard } from '@nestjs/passport';
import { from } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(AuthGuard('local'))
  async list() {
    return this.userService.list();
  }

  @Post()
  async create(@Body() args) {
    return this.userService.create(args);
  }

  @Post('reset-password')
  async resetPassword(@Body() args) {
    return this.userService.resetPassword(args);
  }

  @Get(':id')
  @UseGuards(AuthGuard('local'))
  async get(@Param('id') id: string) {
    return this.userService.get(id);
  }

  @Put()
  @UseGuards(AuthGuard('local'))
  async update(@Body() args) {
    return this.userService.update(args);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('local'))
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @Post('login')
  async login(@Body() args) {
    console.log(args);
    return this.userService.login(args);
  }

  @Post('forget-password')
  async forgotPassword(@Body() args) {
    return this.userService.forgotPassword(args);
  }

  @Post('test')
  // @UseGuards(AuthGuard(), ACGuard)
  async test(@Req() req) {
    return req.user;
  }
}
