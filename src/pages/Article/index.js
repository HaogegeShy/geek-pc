import React, { useEffect, useState } from 'react'
import { Card, Breadcrumb, Form, Button, Radio, 
DatePicker, Select, Table, Tag, Space, ConfigProvider,Popconfirm} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import zhCN from 'antd/es/locale/zh_CN';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { http } from '@/utils';

const { Option } = Select;
const { RangePicker } = DatePicker;
export default function Article() {

  // 获取频道列表数据
  const [channels,setChannels]=useState([])
  useEffect(() => { 
    async function fetchChannels(){
      const {data:res}=await http.get('/channels')
      //console.log(res.data.channels);
      setChannels(res.data.channels)
    }
    fetchChannels()
  },[])

  // 文章列表数据管理
  const [article, setArticleList] = useState({
    list: [],
    count: 0
  })

  // 参数管理
  const [params, setParams] = useState({
    // 第几页
    page: 1,
    // 每页条数
    per_page: 10
  })

  // 发送获取列表数据接口请求
  useEffect(() => {
    async function fetchArticleList() {
      //console.log(params);
    const {data:res}= await http.get('/mp/articles', {params})
    //console.log(res.data);
    const {total_count, results}=res.data
      setArticleList({
      list: results,
      count: total_count
    })
    }
    fetchArticleList()
  }, [params])

  // 点击筛选的回调
  const onSearch=value => {
    //console.log(value);
    const {status, channel_id, date}=value
    // 格式化表单数据
    const _params = {}
    // 格式化status
    _params.status = status
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    // 修改params参数 触发接口再次发起
    setParams({
       ...params,
       ..._params
    })
  }
  // 页码和分页改变的配置
  const pageChange=(page,per_page) => {
    setParams({
      per_page,
      page
    })
  }
  // 删除功能
  const confirm= async (data)=>{
    // console.log('data',data);
    await http.delete(`/mp/articles/${data.id}`)
    // 更新列表
    setParams({
      ...params
    })
  }
  // 编辑跳转
  const navigate=useNavigate()
  const goPublish=(data) => {
    navigate(`/publish?id=${data.id}`)
  }

  // table列表头
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width:120,
      render: cover => {
        return <img src={cover || img404} width={80} height={60} alt=""/>
       
        
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} 
            onClick={()=>goPublish(data)}/>
            <Popconfirm
              title="你确定要删除这条信息吗?"
              onConfirm={()=>confirm(data)}
              okText="Yes"
              cancelText="No"
            >
              <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined/>}/>
            </Popconfirm>
            
          </Space>
        )
      }
    }
  ]
 
  return (
    <div>
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}>
        <Form initialValues={{ status: null }} onFinish={onSearch}>
          <Form.Item label='状态' name='status'>
            <Radio.Group>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label='频道' name='channel_id'>
            <Select
              placeholder="请选择频道"
              //defaultValue="lucy"
              style={{
                width: 120,
              }}
            > 
              {channels.map(item =>
                (<Option value={item.id} key={item.id} >{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="日期" name="date">
            <RangePicker locale={locale}/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 列表区域 */}
      <Card title={`根据筛选条件共查询到 count 条结果：${article.count}`}>
        <ConfigProvider locale={zhCN}>
          <Table 
          rowKey="id" 
          columns={columns} 
          dataSource={article.list}
          pagination={{
            locale:locale,
            pageSize:params.per_page,
            total:article.count,
            onChange:pageChange,
            pageSizeOptions:[10,20,50],
            showQuickJumper:true
          }} 
          />
        </ConfigProvider>
      </Card>

    </div>
  )
}
