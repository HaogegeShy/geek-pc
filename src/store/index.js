import React from "react"
import LoginStore from "./login.store"
import UserStore from "./user.store"

class RootStore{
  // 组合模块
  constructor(){
    this.loginStore=new LoginStore()
    this.userStore= new UserStore()
  }
}
// 实例化根 导出useStore
const rootStore=new RootStore()
const context=React.createContext(rootStore)
const useStore=()=>React.useContext(context)

export {useStore}