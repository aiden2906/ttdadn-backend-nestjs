import { UserService } from './../../modules/user/user.service';
import { Injectable } from '@nestjs/common';
import bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getByName(username);
    const check = await bcrypt.compare(pass, user.password);
    if (user && check) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
