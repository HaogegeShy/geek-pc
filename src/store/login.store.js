// 登录模块
import { makeAutoObservable  } from "mobx"
import { http, setToken, getToken, clearToken } from '@/utils'


class LoginStore {
  token = getToken()||''
  constructor() {
    // 响应式的
    makeAutoObservable(this)
  }
  // 登录
  login = async ({ mobile, code }) => {
    const {data:res} = await http.post('authorizations', {
      mobile,
      code
    })
      this.token=res.data.token
    setToken(this.token)
  }
  // 退出登录
  loginOut = () => { 
      this.token=''
    clearToken()
  }
}
export default LoginStore