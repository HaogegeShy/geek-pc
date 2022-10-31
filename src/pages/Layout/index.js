import React,{useEffect} from 'react'
import {  Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {useStore} from '@/store'
import {Layout, Popconfirm, Menu, message} from 'antd'
import {observer} from 'mobx-react-lite'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import '@/pages/Layout/index.scss'


const { Header, Sider } = Layout;
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

 function GeekLayout() {

  // 获取当前浏览器上的路径地址
  // 通过selectedKeys===路由地址来选取高亮
  const location=useLocation()
  const selectedKeys=location.pathname

  // 获取用户数据
  const {userStore, loginStore}=useStore()
  useEffect(() => {
    userStore.getUserInfo()
  },[userStore])
  
  // 选择退出的回调
  const navigate = useNavigate()
  const confirm=() => {
    loginStore.loginOut()
    navigate('/login')
    message.success('退出成功')
  }
  // 取消退出的回调
  const cancel=() => {
    message.error('取消退出')
  }



  // Menu数据
  const items = [
    getItem(<Link to='/'>数据概览</Link>, '/', <HomeOutlined />),
    getItem(<Link to='/article'>内容管理</Link>,'/article',<DiffOutlined />),
    getItem(<Link to='/publish'>发布文章</Link>,'/publish', <EditOutlined />),
  ]
  
  return (
    <Layout>
      <Header className='header'>
        <div className='logo'/>
        <div className='user-info'>
          <span className="user-name">{userStore.userInfo.name}</span>
            <span className="user-logout">
              <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={confirm} onCancel={cancel}>
                <LogoutOutlined /> 退出
              </Popconfirm>
            </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
        <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[selectedKeys]}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
          >
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 子路由展示位置 */}
          <Outlet/>
          
        </Layout>
      </Layout>
    </Layout>
  )
}
export default observer(GeekLayout)