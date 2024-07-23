import { Controller, Get, Inject, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { CONTROLLER } from 'enum/controller.enum'
import { GetUploadDto } from './dto/get-upload.dto'
import { UploadsService } from './uploads.service'

@Controller(CONTROLLER.UPLOADS)
export class UploadsController {
  @Inject() uploadsService: UploadsService

  @Get('')
  async getFile(
    @Query() query: GetUploadDto
  ) {
    const { data, total } = await this.uploadsService.get(query)
    return {
      data,
      total,
      message: 'Get images successfully',
    }
  }

  @Get(':id')
  async getById(
    @Param('id') id: string
  ) {
    const data = await this.uploadsService.getById(id)
    return {
      data,
      message: 'Get image by id successfully',
    }
  }

  @Post('')
  @UseInterceptors(FilesInterceptor(
    'images',
  ))
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    await this.uploadsService.post(files)
    return {
      message: 'Upload image successfully',
    }
  }

}