import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate,useSearchParams } from 'react-router-dom'
import { http } from '@/utils'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const { Option } = Select

const Publish = () => {

  const [params] = useSearchParams()
  const articleId = params.get('id')

  const navigate=useNavigate()
    // 申明一个暂存仓库
    const fileListRef=useRef([])

  // 频道列表
  const [channels, setChannels] = useState([])
  useEffect(() => {
  async function fetchChannels() {
    const {data:res} = await http.get('/channels')
    setChannels(res.data.channels)
  }
  fetchChannels()
  }, [])

  const [fileList, setFileList] = useState([])
  // 上传成功回调
  const onUploadChange = info => {
    const fileList = info.fileList.map(file => {
      // console.log(file);
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      return file
    })
    setFileList(fileList)
    // 暂存列表里也存一份（暂存列表）
    fileListRef.current=fileList
  }

  // 图片切换
  const [imgCount, setImgCount] = useState(1)

  const changeType = e => {
    const count = e.target.value
    setImgCount(count)
    if (count === 1) {
      // 单图，只展示第一张
      const firstImg = fileListRef.current[0]
      setFileList(!firstImg ? [] : [firstImg])
    } else if (count === 3) {
      // 三图，展示所有图片
      setFileList(fileListRef.current)
    }
  }
  // 提交表单的回调
  const onFinish= async(value) => {
    // 数据的二次处理 重点是处理cover字段
    const { channel_id, content, title, type } = value
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map(item => item.url)
      }
    }
    if(articleId){
      // 编辑
      await http.put(`/mp/articles/${articleId}?draft=false`,params)
    }else{
      // 新增
      await http.post('/mp/articles?draft=false', params)
    }
    navigate('/article')
    message.success(`${articleId?'更新成功':'发布成功'}`)
  }

  // 数据回填
  const form=useRef(null)
  useEffect(() => {
    async function getArticle () {
      const {data:res} = await http.get(`/mp/articles/${articleId}`)
      // console.log(res.data);
      const { cover, ...formValue } = res.data
      // 动态设置表单数据
      form.current.setFieldsValue({ ...formValue, type: cover.type })
      // 格式化封面图片数据
      const imageList = cover.images.map(url => ({ url }))
      // uplade数据写入
      setFileList(imageList)
      // 单选框图片数量写入
      setImgCount(cover.type)
      // 暂存仓库写入
      fileListRef.current = imageList
    }
    if (articleId) {
      // 拉取数据回显
      getArticle()
    }
  }, [articleId])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{articleId?'编辑文章':'发布文章'}</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          onFinish={onFinish}
          ref={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channels.map(item=>(
                <Option value={item.id} key={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={changeType}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount>0&&<Upload
              name="image"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList
              action="http://geek.itheima.net/v1_0/upload"
              fileList={fileList}
              onChange={onUploadChange}
              maxCount={ imgCount }
              multiple={ imgCount > 1 }
            >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
              {articleId?'编辑文章':'发布文章'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish