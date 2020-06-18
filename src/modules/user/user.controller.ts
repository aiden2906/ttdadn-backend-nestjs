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
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async list() {
    return this.userService.list();
  }

  @Post('reset-password')
  async resetPassword(@Body() args) {
    return this.userService.resetPassword(args);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.userService.get(id);
  }

  @Post('create')
  async create(@Body() args) {
    return this.userService.create(args);
  }

  @Put()
  async update(@Body() args) {
    return this.userService.update(args);
  }

  @Delete(':id')
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
  async test(@Req() req){
    return req.user;
  }
}
