import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import 'config'
import { json, urlencoded } from 'express'
import { AppModule } from './modules/app.module'
console.log(global.Config)

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(global.Config.APP_CONTEXT)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableCors()
  app.use(json({ limit: '10mb' }))
  app.use(urlencoded({ limit: '10mb', extended: true }))

  const config = new DocumentBuilder()
    .setTitle('Qode Assignment')
    .setDescription('Qode Assignment API ')
    .setVersion('1.0')
    .build()

  const appDocument = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(`${global.Config.APP_CONTEXT}/api-docs`, app, appDocument)
  await app.listen(global.Config.PORT)
  return app
}
const server = bootstrap()
export default server
