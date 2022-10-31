import { getToken } from "@/utils"
import { Navigate } from "react-router-dom"

function AuthRoute({children}) {
  const isToken=getToken()
  if(isToken){
    return <>{children}</>
  }else{
    console.log(11);
    return <Navigate to='/login' replace/>
  }
}
export {AuthRoute}