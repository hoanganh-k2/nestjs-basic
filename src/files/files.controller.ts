import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('fileUpload')) // tên field sử dụng trong form-data
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            /(jpg|jpeg|png|gif|txt|text\/plain|pdf|application\/pdf|doc|application\/msword|docx|xls|xlsx)$/,
        })
        .addMaxSizeValidator({
          maxSize: 5 * 1024 * 1024, // 5MB (thay vì 1000 bytes)
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    return {
      statusCode: 200,
      message: 'File uploaded successfully',
      data: {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      },
    };
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
