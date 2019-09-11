import RetrieveHook from './RetrieveHook'
import BeforeCreateHook from './BeforeCreateHook'
import AfterCreateHook from './AfterCreateHook'
import BeforeUpdateHook from './BeforeUpdateHook'
import AfterUpdateHook from './AfterUpdateHook'
import BeforeDeleteHook from './BeforeDeleteHook'
import AfterDeleteHook from './AfterDeleteHook'

export type HookableClosure = RetrieveHook | BeforeCreateHook | AfterCreateHook | BeforeUpdateHook | AfterUpdateHook | BeforeDeleteHook | AfterDeleteHook

export default HookableClosure
