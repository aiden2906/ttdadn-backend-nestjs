/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { firebase } from '../../firebase';
import { uuid } from 'uuidv4';
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');
import { SALTROUNDS, SECRETKEY } from '../../environments';
import { transporter } from '../../shared/modules/mail';

@Injectable()
export class UserService {
  async list() {
    const ref = firebase.app().database().ref();
    const userRef = ref.child('user');
    let users;
    await userRef.once('value', (snap) => {
      users = Object.entries(snap.val()).map((item) => item[1]);
    });
    return users;
  }

  async get(id: string) {
    const users = await this.list();
    const user = users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException('not found user');
    }
    return user;
  }
  private async getByUsername(username: string) {
    const users = await this.list();
    return users.find((item) => item.username === username);
  }

  async create(args) {
    const { fullname, username, password, email, dateOfBirth } = args;
    const existUser = await this.getByUsername(username);
    if (existUser) {
      throw new BadRequestException('user already exists');
    }
    const userId = uuid();
    const hash = bcrypt.hashSync(password, Number(SALTROUNDS));
    const user = {
      userId,
      fullname,
      username,
      password: hash,
      email,
      dateOfBirth,
      createdAt: new Date(),
    };

    const ref = firebase.app().database().ref();
    const userRef = ref.child('user');
    await userRef.child(userId).set(user);
  }

  async update(args) {
    const { username, fullname, password, email, dateOfBirth } = args;
    const user = await this.getByUsername(username);
    if (!user) {
      throw new NotFoundException('not found user');
    }

    user.fullname = fullname ? fullname : user.fullname;
    user.password = password
      ? bcrypt.hashSync(password, Number(SALTROUNDS))
      : user.password;
    user.email = email ? email : user.email;
    user.dateOfBirth = dateOfBirth ? dateOfBirth : user.dateOfBirth;
    const userId = user.userId;
    const ref = firebase.app().database().ref();
    const userRef = ref.child('user');
    await userRef.child(userId).set(user);
    return user;
  }

  async delete(id: string) {
    const ref = firebase.app().database().ref();
    const userRef = ref.child('user');
    const user = await this.get(id);
    const userId = user.id;
    await userRef.child(userId).remove();
    return user;
  }

  async login(args) {
    const { username, password } = args;
    const user = await this.getByUsername(username);
    const check = bcrypt.compareSync(password, user.password);
    if (!check) {
      throw new BadRequestException('incorrect password');
    }
    const token = jwt.sign(
      {
        username,
        password,
      },
      SECRETKEY,
      { expiresIn: '2h' },
    );
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
    const token = jwt.sign(payload, SECRETKEY, { expiresIn: '1h' });
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
    const { username, newPassword, token } = args;
    const payload = jwt.verify(token, SECRETKEY);
    const user = await this.getByUsername(username);
    if (
      user.username !== payload.username ||
      user.password !== payload.password
    ) {
      throw new BadRequestException('incorrect token');
    }
    await this.update({ username, password: newPassword });
  }
}
