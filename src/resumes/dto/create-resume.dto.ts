import { IsNotEmpty } from 'class-validator';

export class CreateResumeDto {
  //   @IsNotEmpty({ message: 'Email không được để trống' })
  //   email: string;
  //   @IsNotEmpty({ message: 'userId không được để trống' })
  //   userId: string;

  @IsNotEmpty({ message: 'url không được để trống' })
  url: string;

  //   @IsNotEmpty({ message: 'status không được để trống' })
  //   status: string;

  @IsNotEmpty({ message: 'status không được để trống' })
  jobId: string;

  @IsNotEmpty({ message: 'status không được để trống' })
  companyId: string;
}
