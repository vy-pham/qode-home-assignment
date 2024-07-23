import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { CommentsModule } from './comments/comments.module'
import { UploadsModule } from './uploads/uploads.module'
console.log(join(process.cwd(), global.Config.UPLOAD_DIR))

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), global.Config.UPLOAD_DIR),
      serveRoot: `/${Config.APP_CONTEXT}`,
    }),

    MongooseModule.forRoot(global.Config.MONGODB_URI),
    UploadsModule,
    CommentsModule,
  ],
})
export class AppModule {
}