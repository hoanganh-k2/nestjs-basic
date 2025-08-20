import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateResumeDto {
  @IsNotEmpty({ message: 'Status không được để trống' })
  status: string;
}
