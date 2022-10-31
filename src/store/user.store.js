// 用户模块
import {makeAutoObservable, runInAction} from 'mobx'
import { http } from '@/utils'

class UserStore {
  // 用户信息
  userInfo={}
  constructor(){
    // 响应式的
    makeAutoObservable(this)
  }
  // 获取用户信息
  async getUserInfo(){
    const {data:res}= await http.get('/user/profile')
    // mobx在严格模式下，不允许在 action 外更改任何状态,所以在runInAction中执行
    runInAction(() => {
      this.userInfo=res.data
    })
    //console.log(this.userInfo.name);
  }
}

export default UserStore