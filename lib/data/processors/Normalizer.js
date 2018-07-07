import { normalize } from 'normalizr';
import Utils from '../../support/Utils';
import Schema from './Schema';
var Normalizer = /** @class */ (function () {
    function Normalizer() {
    }
    /**
     * Normalize the data.
     */
    Normalizer.process = function (data, Query) {
        if (Utils.isEmpty(data)) {
            return {};
        }
        var schema = Array.isArray(data) ? Schema.many(Query.model) : Schema.one(Query.model);
        return normalize(data, schema).entities;
    };
    return Normalizer;
}());
export default Normalizer;
//# sourceMappingURL=Normalizer.js.map