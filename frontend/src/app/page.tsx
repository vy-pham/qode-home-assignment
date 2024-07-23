/** @format */
"use client"
import Upload from "@/components/upload"
import { Col, Pagination, Row } from "antd"
import axios from "axios"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
interface Images {
  _id: string
  name: string
  size: number
  mimetype: string
  totalComment: number
  createdAt: string
}
export default function Home() {
  const [images, setImages] = useState<Images[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const getData = useCallback(
    async function () {
      const res = await axios.get<{ data: Images[]; total: number }>(`${process.env.NEXT_PUBLIC_HOST_URL}/uploads`, { params: { skip: (page - 1) * 10 } })
      const data = res.data
      setImages(data.data)
      setTotal(data.total)
    },
    [page]
  )

  useEffect(() => {
    getData()
  }, [getData])
  return (
    <>
      <Upload getData={getData} />
      <div className="container">
        <h1>Uploaded Images</h1>

        <div className="images">
          <Pagination onChange={setPage} showSizeChanger={false} current={page} total={total} />

          <Row gutter={30}>
            {images.map((image) => (
              <Col key={image._id} span={6}>
                <Link href={`image/${image._id}`}>
                  <div className="image-info">
                    <div className="img">
                      <img src={`${process.env.NEXT_PUBLIC_HOST_URL}/${image.name}`} alt="" />
                    </div>
                    <p>{image.name}</p>
                    <p>Total comment : {image.totalComment}</p>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  )
}
