import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  //   @IsNotEmpty({ message: 'Email không được để trống' })
  //   email: string;
  //   @IsNotEmpty({ message: 'userId không được để trống' })
  //   userId: string;

  @IsNotEmpty({ message: 'url không được để trống' })
  url: string;

  //   @IsNotEmpty({ message: 'status không được để trống' })
  //   status: string;

  @IsNotEmpty({ message: 'jobId không được để trống' })
  @IsMongoId({ message: 'jobId có định dạng là objectId' })
  jobId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'companyId không được để trống' })
  @IsMongoId({ message: 'companyId có định dạng là objectId' })
  companyId: mongoose.Schema.Types.ObjectId;
}
