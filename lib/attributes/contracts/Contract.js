import Attr from '../types/Attr';
import String from '../types/String';
import Number from '../types/Number';
import Boolean from '../types/Boolean';
import Increment from '../types/Increment';
import HasOne from '../relations/HasOne';
import BelongsTo from '../relations/BelongsTo';
import HasMany from '../relations/HasMany';
import HasManyBy from '../relations/HasManyBy';
import HasManyThrough from '../relations/HasManyThrough';
import BelongsToMany from '../relations/BelongsToMany';
import MorphTo from '../relations/MorphTo';
import MorphOne from '../relations/MorphOne';
import MorphMany from '../relations/MorphMany';
import MorphToMany from '../relations/MorphToMany';
import MorphedByMany from '../relations/MorphedByMany';
var Contract = /** @class */ (function () {
    function Contract() {
    }
    /**
     * Determine if the given value is the type of fields.
     */
    Contract.isFields = function (attr) {
        return !this.isAttribute(attr);
    };
    /**
     * Determine if the given value is the type of field.
     */
    Contract.isAttribute = function (attr) {
        return attr instanceof Attr
            || attr instanceof String
            || attr instanceof Number
            || attr instanceof Boolean
            || attr instanceof Increment
            || this.isRelation(attr);
    };
    /**
     * Determine if the given value is the type of relations.
     */
    Contract.isRelation = function (attr) {
        return attr instanceof HasOne
            || attr instanceof BelongsTo
            || attr instanceof HasMany
            || attr instanceof HasManyBy
            || attr instanceof HasManyThrough
            || attr instanceof BelongsToMany
            || attr instanceof MorphTo
            || attr instanceof MorphOne
            || attr instanceof MorphMany
            || attr instanceof MorphToMany
            || attr instanceof MorphedByMany;
    };
    /**
     * Determine if the given value is the type of morph relations.
     */
    Contract.isMorphRelation = function (attr) {
        return attr instanceof MorphOne || attr instanceof MorphMany;
    };
    return Contract;
}());
export default Contract;
//# sourceMappingURL=Contract.js.map