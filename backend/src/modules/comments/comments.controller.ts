import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common'
import { CONTROLLER } from 'enum/controller.enum'
import { CommentsService } from './comments.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { GetCommentDto } from './dto/get-comment.dto'

@Controller(CONTROLLER.COMMENT)
export class CommentsController {
  @Inject() commentsService: CommentsService
  @Post('')
  async createComment(
    @Body() body: CreateCommentDto
  ) {
    const data = await this.commentsService.createComment(body)
    return {
      data,
      message: 'Create comment successfully',
    }
  }

  @Get()
  async getComment(
    @Query() query: GetCommentDto
  ) {
    const data = await this.commentsService.getComments(query)
    return {
      data,
      message: 'Get comment successfully',
    }
  }
}