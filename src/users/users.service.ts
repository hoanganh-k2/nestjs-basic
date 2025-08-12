import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  hashPassword(plainPassword: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(plainPassword, salt);
    return hash;
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async create(email: string, password: string, name: string) {
    const hashPassword = this.hashPassword(password);
    let user = await this.userModel.create({
      email,
      hashPassword,
      name,
    });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid MongoDB ObjectId format');
    }
    return this.userModel.findOne({ _id: id });
  }

  findByUsername(username: string) {
    return this.userModel.findOne({ email: username });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid MongoDB ObjectId format');
    }
    let user = await this.userModel.deleteOne({ _id: id });
    return user;
  }
}
