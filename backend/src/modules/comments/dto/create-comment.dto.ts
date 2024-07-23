import { PickType } from '@nestjs/swagger'
import { Comments } from '../comments.schema'

export class CreateCommentDto extends PickType(Comments, ['comment', 'content', 'image']) { }