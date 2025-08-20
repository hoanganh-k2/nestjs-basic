import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @ResponseMessage('Create a new resume')
  @Post()
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }

  @ResponseMessage('Fetch all resumes with paginate')
  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage('Fetch a resume by id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @ResponseMessage('Update status resume')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @ResponseMessage('Delete a resume by id')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }

  @ResponseMessage('Get Resumes by User')
  @Post('/by-user')
  findByUser(@User() user: IUser) {
    return this.resumesService.findByUser(user);
  }
}
