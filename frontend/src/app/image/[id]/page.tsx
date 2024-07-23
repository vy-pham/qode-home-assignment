/** @format */
"use client"
import convertDateAgo from "@/utils"
import { Button, Col, Input, notification, Row } from "antd"
import axios from "axios"
import Link from "next/link"
import { ChangeEvent, CSSProperties, useEffect, useState } from "react"
import "./style.css"

interface ImageDetail {
  _id: string
  name: string
  size: number
  mimetype: string
  createdAt: "2024-07-23T18:40:26.490Z"
}

interface Comment {
  _id: string
  content: string
  totalComment: number
  createdAt: "2024-07-23T18:40:51.393Z"
  reply: Comment[]
  tempReply?: string
}
export default function ImageDetail({ params }: { params: { id: string } }) {
  const [api, contextHolder] = notification.useNotification()
  const [comment, setComment] = useState("")
  const [imageDetail, setImageDetail] = useState<ImageDetail | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_HOST_URL}/api/uploads/${params.id}`).then((res) => {
      setImageDetail(res.data.data)
    })

    axios.get(`${process.env.NEXT_PUBLIC_HOST_URL}/api/comments`, { params: { image: params.id } }).then((res) => {
      setComments(res.data.data)
    })
  }, [params.id])

  const handleSubmitComment = async function (item?: Comment) {
    const body: { comment?: string; image?: string; content: string } = { content: comment }
    if (item) {
      body.comment = item._id
      body.content = item.tempReply || ""
    } else {
      body.image = params.id
    }
    const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST_URL}/api/comments`, body)

    api.open({
      message: res.data.message,
    })

    if (item) {
      item.tempReply = ""
      if (item.reply) {
        item.reply.unshift(res.data.data)
      } else {
        item.reply = [res.data.data]
      }
    } else {
      setComment("")
      comments.unshift(res.data.data)
    }
    setComments([...comments])
  }

  const handleChangeTempReply = function (event: ChangeEvent<HTMLInputElement>, item: Comment) {
    item.tempReply = event.target.value
    setComments([...comments])
  }

  const handleLoadReply = async function (item: Comment) {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_HOST_URL}/comments`, { params: { comment: item._id } })
    if (item.reply) {
      item.reply.unshift(...res.data.data)
    } else {
      item.reply = res.data.data
    }
    setComments([...comments])
  }

  const renderComments = function (comments: Comment[], level: number) {
    return (
      <div style={{ "--level": level } as CSSProperties} className="comments">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p className="name">
              {level > 0 ? "Reply Id" : "Comment ID"} {comment._id} added {convertDateAgo(comment.createdAt)}
            </p>
            <p className="content">{comment.content}</p>
            {comment.totalComment > 0 && !comment.reply?.length && <Button onClick={() => handleLoadReply(comment)}>Show more {comment.totalComment} reply</Button>}
            <Row>
              <Col span={20}>
                <Input onChange={(event) => handleChangeTempReply(event, comment)} value={comment.tempReply} placeholder="Enter your reply" />
              </Col>
              <Col span={4}>
                <Button onClick={() => handleSubmitComment(comment)} type="primary">
                  Reply
                </Button>
              </Col>
            </Row>
            {comment.reply && renderComments(comment.reply, level + 1)}
          </div>
        ))}
      </div>
    )
  }
  return (
    <>
      {contextHolder}
      {imageDetail && (
        <div className="container">
          <Button type="dashed">
            <Link href="/">Back</Link>
          </Button>
          <div className="img">
            <img src={`${process.env.NEXT_PUBLIC_HOST_URL}/${imageDetail?.name}`} alt="" />
          </div>
          <h2>Comments</h2>
          <Row gutter={30}>
            <Col span={20}>
              <Input onChange={(e) => setComment(e.target.value)} value={comment} placeholder="Add your comment for this image" />
            </Col>
            <Col span={4}>
              <Button onClick={() => handleSubmitComment()} disabled={!comment} type="primary">
                Submit
              </Button>
            </Col>
          </Row>
          {renderComments(comments, 0)}
        </div>
      )}
    </>
  )
}
