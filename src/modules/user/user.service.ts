/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { firebase } from '../../firebase';
import bcrypt = require('bcrypt');
import { SALTROUNDS } from '../../environments';
import { transporter } from '../../shared/modules/mail';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}
  async list() {
    const ref = firebase.app().database().ref();
    const userRef = ref.child('user');
    let users;
    await userRef.once('value', (snap) => {
      users = Object.entries(snap.val()).map((item) => item[1]);
    });
    return users;
  }

  async get(id: number) {
    console.log('getById');
    console.log(id);
    const users = await this.list();
    console.log(users);
    const user = users.find((item) => item.id == id);
    console.log(user);
    if (!user) {
      throw new NotFoundException('not found user1');
    }
    return user;
  }
  private async getByUsername(username: string) {
    console.log('getByUsername');
    const users = await this.list();
    return users.find((item) => item.username === username);
  }

  private async genId(): Promise<number> {
    const users = await this.list();
    return users.length + 1;
  }

  async create(args) {
    const { fullname, username, password, email } = args;
    const existUser = await this.getByUsername(username);
    if (existUser) {
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
      createdAt: new Date().getTime(),
      isActive: true,
    };

    const ref = firebase.app().database().ref();
    const userRef = ref.child('user');
    await userRef.child(String(id)).set(user);
  }

  async update(userId: number, args) {
    console.log('update');
    const { fullname, about, email, password, isActive } = args;
    const user = await this.get(userId);
    if (!user) {
      throw new NotFoundException('not found user2');
    }

    user.fullname = fullname !== undefined ? fullname : user.fullname;
    user.password = password
      ? bcrypt.hashSync(password, Number(SALTROUNDS))
      : user.password;
    user.email = email !== undefined ? email : user.email;
    user.about = about !== undefined ? about : user.about;
    user.updatedAt = new Date().getTime();
    user.isActive = isActive !== undefined ? isActive : user.isActive;
    const ref = firebase.app().database().ref();
    const userRef = ref.child('user');
    await userRef.child(String(userId)).set(user);
    return user;
  }

  async delete(id: number) {
    const ref = firebase.app().database().ref();
    const userRef = ref.child('user');
    const user = await this.get(id);
    const userId = user.id;
    await userRef.child(String(userId)).remove();
    return user;
  }

  async login(args) {
    const { username, password } = args;
    const user = await this.getByUsername(username);
    const check = bcrypt.compareSync(String(password), String(user.password));
    if (!check) {
      throw new BadRequestException('incorrect password');
    }
    const token = this.jwtService.sign({
      id: user.id,
      username,
      password,
    });
    return token;
  }

  async forgotPassword(args) {
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

  async resetPassword(args) {
    const { newPassword, token } = args;
    const payload = this.jwtService.verify(token);
    const { username, password } = payload;
    const user = await this.getByUsername(username);

    if (user.username !== username || user.password !== password) {
      throw new BadRequestException('incorrect token');
    }
    user.password = bcrypt.hashSync(newPassword, Number(SALTROUNDS));
    console.log(user);
    const ref = firebase.app().database().ref();
    const userRef = ref.child('user');
    userRef.child(user.id).set(user);
  }

  async getByName(username: string) {
    console.log('getByName');
    const users = await this.list();
    const user = users.find((item) => item.username === username);
    if (!user) {
      throw new NotFoundException('not found user3');
    }
    return user;
  }

  async getMe(userId: number) {
    const user = await this.get(userId);
    const { password, ...publicInfo } = user;
    return publicInfo;
  }

  async active(id: number) {
    const user = await this.get(id);
    await this.update(id, { isActive: true });
  }

  async disable(id: number) {
    const user = await this.get(id);
    await this.update(id, { isActive: false });
  }
}
