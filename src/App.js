import React, {lazy, Suspense}from 'react'

import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {AuthRoute} from './components/AuthRoute'
// 按需导入路由组件
const Login = lazy(() => import('./pages/Login'))
const Layout = lazy(() => import('./pages/Layout'))
const Home = lazy(() => import('./pages/Home'))
const Article = lazy(() => import('./pages/Article'))
const Publish = lazy(() => import('./pages/Publish'))


export default function App() {
  return (
      <BrowserRouter>
        <div className='app'>
          <Suspense fallback={<div style={{textAlign: 'center',
              marginTop: 200}}>Loading...</div>}>
            <Routes>
              {/* 需要鉴权的路由 */}
              <Route path='/' element={<AuthRoute><Layout/></AuthRoute>}>
                <Route index element={<Home/>}></Route>
                <Route path='/article' element={<Article/>}></Route>
                <Route path='/publish' element={<Publish/>}></Route>
              </Route>
              <Route path='/login' element={<Login/>}></Route>
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
  )
}