import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name không được đế trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được đế trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được đế trống' })
  password: string;

  @IsNotEmpty({ message: 'Age không được đế trống' })
  age: number;

  @IsNotEmpty({ message: 'Gender không được đế trống' })
  gender: string;

  @IsNotEmpty({ message: 'Address không được đế trống' })
  address: string;

  @IsNotEmpty({ message: 'role không được để trống' })
  @IsMongoId({ message: 'role có định dạng là objectId' })
  role: mongoose.Schema.Types.ObjectId;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company!: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name không được đế trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được đế trống' })
  email: string;

  @IsNotEmpty({ message: 'Password không được đế trống' })
  password: string;

  @IsNotEmpty({ message: 'Age không được đế trống' })
  age: string;

  @IsNotEmpty({ message: 'Gender không được đế trống' })
  gender: string;

  @IsNotEmpty({ message: 'Address không được đế trống' })
  address: string;
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'hoanganh', description: '123456' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'hoanganh@gmail.com',
    description: '123456',
  })
  readonly password: string;
}
