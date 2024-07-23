import { Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { COLLECTION } from 'enum/collection.enum'
import { Schema, Types } from 'mongoose'

@NestSchema({
  timestamps: true,
})
export class Comments {
  static collectionName = COLLECTION.comments

  @ApiProperty({})
  @IsOptional()
  @IsMongoId()
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.uploads })
  image?: Types.ObjectId

  @ApiProperty({})
  @IsOptional()
  @IsMongoId()
  @Prop({ type: Schema.Types.ObjectId, ref: COLLECTION.comments })
  comment?: Types.ObjectId

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  @Prop({ type: String })
  content: string

  @Prop({ type: Number })
  start: number

  @Prop({ type: Number })
  end: number

  @Prop({ type: Number })
  belongStart: number

  @Prop({ type: Number })
  belongEnd: number
}

export const CommentsSchema = SchemaFactory.createForClass(Comments)