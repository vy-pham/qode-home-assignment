import { IsMongoId, IsOptional } from 'class-validator'

export class GetCommentDto {
  @IsMongoId()
  @IsOptional()
  image?: string

  @IsMongoId()
  @IsOptional()
  comment?: string
}