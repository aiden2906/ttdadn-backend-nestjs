import { UserService } from './../../modules/user/user.service';
import { Injectable } from '@nestjs/common';
import bcrypt = require('bcrypt');
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    console.log(`validateUser:`,username, pass)
    const user = await this.userService.getByName(username);
    const check = await bcrypt.compare(pass, user.password);
    if (user && check) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<any> {
    console.log(`login: `,user)
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
