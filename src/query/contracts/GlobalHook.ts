import HookableClosure from './HookableClosure'

export interface GlobalHook {
  id: number
  once: boolean
  callback: HookableClosure
}

export default GlobalHook
