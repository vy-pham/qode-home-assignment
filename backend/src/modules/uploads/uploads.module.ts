import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { UploadsController } from './uploads.controller'
import { Uploads, UploadsSchema } from './uploads.schema'
import { UploadsService } from './uploads.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Uploads.collectionName, schema: UploadsSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: global.Config.UPLOAD_DIR,
        filename: (_, file, cb) => {
          const filename = `${Date.now()}_${file.originalname.replace(/\s/g, '')}`
          cb(null, filename)
        },
      }),
      limits: {
        fileSize: 1000 * 1024 * 1024, //10MB
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule { }