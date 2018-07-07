import Normalizer from './processors/Normalizer';
import PivotCreator from './processors/PivotCreator';
import Incrementer from './processors/Incrementer';
import Attacher from './processors/Attacher';
import IdFixer from './processors/IdFixer';
var Data = /** @class */ (function () {
    function Data() {
    }
    /**
     * Normalize the data.
     */
    Data.normalize = function (data, query) {
        data = Normalizer.process(data, query);
        data = PivotCreator.process(data, query);
        data = Incrementer.process(data, query);
        data = Attacher.process(data, query);
        data = IdFixer.process(data, query);
        return data;
    };
    return Data;
}());
export default Data;
//# sourceMappingURL=Data.js.map