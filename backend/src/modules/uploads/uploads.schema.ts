import { Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { COLLECTION } from 'enum/collection.enum'

@NestSchema({
  timestamps: true,
})
export class Uploads {
  static collectionName = COLLECTION.uploads

  @Prop({ type: String })
  name: string

  @Prop({ type: Number })
  size: number

  @Prop({ type: String })
  mimetype: string

  @Prop({ type: Number })
  start: number

  @Prop({ type: Number })
  end: number
}

export const UploadsSchema = SchemaFactory.createForClass(Uploads) 