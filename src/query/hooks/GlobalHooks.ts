import GlobalHook from './GlobalHook'

export interface GlobalHooks {
  [on: string]: GlobalHook[]
}

export default GlobalHooks
