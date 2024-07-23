import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Uploads, UploadsSchema } from 'modules/uploads/uploads.schema'
import { CommentsController } from './comments.controller'
import { Comments, CommentsSchema } from './comments.schema'
import { CommentsService } from './comments.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comments.collectionName,
        schema: CommentsSchema,
      },
      {
        name: Uploads.collectionName,
        schema: UploadsSchema,
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule { }