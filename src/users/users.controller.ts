import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { genSaltSync, hashSync } from 'bcryptjs';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  hashPassword(plainPassword: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(plainPassword, salt);
    return hash;
  }
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const hashPassword = this.hashPassword(createUserDto.password);
    return this.usersService.create(
      createUserDto.email,
      hashPassword,
      createUserDto.name,
    );
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
