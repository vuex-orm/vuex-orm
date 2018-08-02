import Records from './Records';
export interface NormalizedData {
    [entity: string]: Records;
}
export default NormalizedData;
