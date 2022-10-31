const key='pc-key'

const getToken=() => localStorage.getItem(key)
const setToken=token => localStorage.setItem(key,token)
const clearToken=() => localStorage.removeItem(key)

export {getToken, setToken, clearToken}