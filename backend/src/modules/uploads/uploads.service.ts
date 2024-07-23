import { InjectModel } from '@nestjs/mongoose'
import { COLLECTION } from 'enum/collection.enum'
import { Model, Types } from 'mongoose'
import { GetUploadDto } from './dto/get-upload.dto'
import { Uploads } from './uploads.schema'

export class UploadsService {
  @InjectModel(Uploads.collectionName) private uploadsModel: Model<Uploads>

  async get({ skip }: GetUploadDto) {
    const [rawData] = await this.uploadsModel.aggregate([
      {
        $facet: {
          data: [
            {
              $match: {},
            },
            {
              $sort: { createdAt: -1 },
            },
            {
              $skip: Number(skip) || 0,
            },
            {
              $limit: 10,
            },
            {
              $lookup: {
                from: COLLECTION.comments,
                let: { orStart: '$start', orEnd: '$end' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $gt: ['$start', '$$orStart'] },
                          { $lt: ['$end', '$$orEnd'] },
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
          ],
          total: [
            {
              $group: {
                _id: null,
                total: { $count: {} },
              },
            },
          ],
        },
      },
    ])
    return {
      data: rawData.data,
      total: rawData.total[0]?.total || 0,
    }
  }

  async getById(id: string) {
    const [data] = await this.uploadsModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: COLLECTION.comments,
          localField: '_id',
          foreignField: 'image',
          pipeline: [
            {
              $sort: { createdAt: -1 },
            },
            {
              $limit: 10,
            },
          ],
          as: 'comments',
        },
      },
    ])
    return data

  }

  async post(files: Express.Multer.File[]) {
    const total = await this.uploadsModel.countDocuments({})
    const data = files.map((file, index) => {
      const order = total + index
      return {
        name: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        start: order * 2,
        end: order * 2 + 1,
      }
    })

    await this.uploadsModel.insertMany(data)
  }
}