import Record from './Record'

export interface RecordWithId extends Record {
  $id: string
}

export default RecordWithId
