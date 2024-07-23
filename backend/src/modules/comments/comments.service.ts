import { BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { COLLECTION } from 'enum/collection.enum'
import { Uploads } from 'modules/uploads/uploads.schema'
import { FilterQuery, Model, Types } from 'mongoose'
import { Comments } from './comments.schema'
import { CreateCommentDto } from './dto/create-comment.dto'
import { GetCommentDto } from './dto/get-comment.dto'

export class CommentsService {
  @InjectModel(Comments.collectionName) commentsModel: Model<Comments>
  @InjectModel(Uploads.collectionName) uploadsModel: Model<Uploads>

  async createComment({ content, comment, image }: CreateCommentDto) {
    if (!image && !comment) {
      throw new BadRequestException('Image or comment must be provide')
    }
    let start = 0
    let end = 0
    if (image) {
      const findImage = await this.uploadsModel.findById(image)
      if (!findImage) {
        throw new BadRequestException('Image not found')
      }
      const lastComment = await this.commentsModel.findOne({ image: findImage }).sort({ end: -1 })
      const order = lastComment?.end || findImage.start
      start = order + 1
      end = order + 2
    }
    if (comment) {
      const findComment = await this.commentsModel.findById(comment)
      if (!findComment) {
        throw new BadRequestException('Comment not found')
      }
      const lastComment = await this.commentsModel.findOne({ comment }).sort({ end: -1 })
      const order = lastComment?.end || findComment.start
      start = order + 1
      end = order + 2
    }

    await this.uploadsModel.updateMany(
      { end: { $gte: start } },
      [
        {
          $set: {
            start: {
              $cond: {
                if: {
                  $lt: ['$start', start],
                },
                then: '$start',
                else: { $sum: ['$start', 2] },
              },
            },
            end: {
              $sum: ['$end', 2],
            },
          },
        },
      ]
    )

    await this.commentsModel.updateMany(
      { end: { $gte: start } },
      [
        {
          $set: {
            start: {
              $cond: {
                if: {
                  $lt: ['$start', start],
                },
                then: '$start',
                else: { $sum: ['$start', 2] },
              },
            },
            end: {
              $sum: ['$end', 2],
            },
          },
        },
      ]
    )

    return await this.commentsModel.create({
      image,
      comment,
      start,
      end,
      content,
    })
  }

  async getComments({ comment, image }: GetCommentDto) {
    const query: FilterQuery<Comments> = {}
    if (comment) {
      query.comment = new Types.ObjectId(comment)
    }

    if (image) {
      query.image = new Types.ObjectId(image)
    }

    const rawData = await this.commentsModel.aggregate([
      {
        $match: query,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: COLLECTION.comments,
          let: { parentStart: '$start', parentEnd: '$end' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $lt: ['$end', '$$parentEnd'] },
                    { $gt: ['$start', '$$parentStart'] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                total: { $count: {} },
              },
            },
          ],
          as: 'totalComment',
        },
      },
      {
        $unwind: {
          path: '$totalComment',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          totalComment: {
            $ifNull: ['$totalComment.total', 0],
          },
        },
      },
    ])

    return rawData
  }
}