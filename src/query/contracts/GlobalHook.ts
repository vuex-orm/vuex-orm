import HookableClosure from './HookableClosure'

export interface GlobalHook {
  id: number
  callback: HookableClosure
}

export default GlobalHook
