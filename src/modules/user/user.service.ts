/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { firebase } from '../../firebase';
import bcrypt = require('bcrypt');
import { SALTROUNDS } from '../../environments';
import { transporter } from '../../shared/modules/mail';
import { JwtService } from '@nestjs/jwt';
import { UserCreateDto, UserUpdateDto } from './dtos/user.dto';
import {
  LoginDto,
  ForgotPasswordDtp,
  ResetPasswordDto,
} from './dtos/login.dto';

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}
  async list() {
    const ref = firebase.app().database().ref();
    const user_ref = ref.child('user');
    let users;
    await user_ref.once('value', (snap) => {
      users = Object.entries(snap.val()).map((item) => item[1]);
    });
    return users;
  }

  async get(id: number) {
    const users = await this.list();
    const user = users.find((item) => item.id == id);
    if (!user) {
      throw new NotFoundException('not found user1');
    }
    return user;
  }
  private async getByUsername(username: string) {
    const users = await this.list();
    return users.find((item) => item.username === username);
  }

  private async genId(): Promise<number> {
    const users = await this.list();
    const user = users.pop();
    return parseInt(user.id);
  }

  async create(args: UserCreateDto) {
    const { fullname, username, password, email } = args;
    const exist_user = await this.getByUsername(username);
    if (exist_user) {
      throw new BadRequestException('username already exists');
    }
    const hash = bcrypt.hashSync(password, Number(SALTROUNDS));
    const id = await this.genId();
    const user = {
      id,
      fullname,
      username,
      password: hash,
      email,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
      is_active: true,
    };

    const ref = firebase.app().database().ref();
    const user_ref = ref.child('user');
    await user_ref.child(String(id)).set(user);
  }

  async update(user_id: number, args: UserUpdateDto | any) {
    const { fullname, about, email, password, is_active } = args;
    const user = await this.get(user_id);
    if (!user) {
      throw new NotFoundException('not found user2');
    }

    user.fullname = fullname !== undefined ? fullname : user.fullname;
    user.password = password
      ? bcrypt.hashSync(password, Number(SALTROUNDS))
      : user.password;
    user.email = email !== undefined ? email : user.email;
    user.about = about !== undefined ? about : user.about;
    user.updated_at = new Date().getTime();
    user.is_active = is_active !== undefined ? is_active : user.is_active;
    const ref = firebase.app().database().ref();
    const user_ref = ref.child('user');
    await user_ref.child(String(user_id)).set(user);
    return user;
  }

  async delete(id: number) {
    const ref = firebase.app().database().ref();
    const user_ref = ref.child('user');
    const user = await this.get(id);
    const user_id = user.id;
    await user_ref.child(String(user_id)).remove();
    return user;
  }

  async login(args: LoginDto) {
    const { username, password } = args;
    const user = await this.getByUsername(username);
    console.log(user);
    if (user.is_active === false) {
      throw new ForbiddenException('user not active yet');
    }
    const check = bcrypt.compareSync(String(password), String(user.password));
    if (!check) {
      throw new BadRequestException('incorrect password');
    }
    const token = this.jwtService.sign({
      id: user.id,
      username,
    });
    return token;
  }

  async forgotPassword(args: ForgotPasswordDtp) {
    const { username } = args;
    const user = await this.getByUsername(username);
    const { email } = user;
    const payload = {
      username: user.username,
      password: user.password,
    };
    const token = this.jwtService.sign(payload);
    const info = await transporter.sendMail({
      from: '"👻👻👻👻" <dthuctap@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'You forgot your password', // Subject line
      text: `reset password`, // plain text body
      html: `<b>Copy this token and paste into form to reset password: ${token}</b>`, // html body
    });

    return info;
  }

  async resetPassword(args: ResetPasswordDto) {
    const { new_password, token } = args;
    const payload = this.jwtService.verify(token);
    const { username, password } = payload;
    const user = await this.getByUsername(username);

    if (user.username !== username || user.password !== password) {
      throw new BadRequestException('incorrect token');
    }
    user.password = bcrypt.hashSync(new_password, Number(SALTROUNDS));
    const ref = firebase.app().database().ref();
    const user_ref = ref.child('user');
    user_ref.child(user.id).set(user);
  }

  async getByName(username: string) {
    const users = await this.list();
    const user = users.find((item) => item.username === username);
    if (!user) {
      throw new NotFoundException('not found user3');
    }
    return user;
  }

  async getMe(user_id: number) {
    const user = await this.get(user_id);
    const { password, ...publicInfo } = user;
    return publicInfo;
  }

  async active(id: number) {
    const user = await this.get(id);
    await this.update(id, { is_active: true });
  }

  async disable(id: number) {
    const user = await this.get(id);
    await this.update(id, { is_active: false });
  }
}
