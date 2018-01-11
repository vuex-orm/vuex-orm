import Model from '../Model'
import Repo from '../Repo'

export interface Components {
  Model: typeof Model
  Repo: typeof Repo
}

export interface Plugin {
  install: (components: Components, options: { [key: string]: any }) => void
  [key: string]: any
}

export type Use = (plugin: Plugin) => void

export default function (plugin: Plugin, options: { [key: string]: any } = {}): void {
  plugin.install({ Model, Repo }, options)
}
