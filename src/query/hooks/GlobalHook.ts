export interface GlobalHook {
  callback: Function
  once?: boolean
  uid: number
}

export default GlobalHook
