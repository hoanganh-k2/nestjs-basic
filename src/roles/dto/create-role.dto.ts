import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'apiPath không được để trống' })
  description: string;

  @IsNotEmpty({ message: 'method không được để trống' })
  isActive: boolean;

  @IsNotEmpty({ message: 'permissions không được để trống' })
  @IsMongoId({ each: true, message: 'each permissions là mongo object id' })
  @IsArray({ message: 'permissions là array' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
