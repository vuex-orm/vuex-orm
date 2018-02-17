import HasOne from './relations/HasOne'
import BelongsTo from './relations/BelongsTo'
import HasMany from './relations/HasMany'
import HasManyBy from './relations/HasManyBy'
import BelongsToMany from './relations/BelongsToMany'
import MorphOne from './relations/MorphOne'
import MorphMany from './relations/MorphMany'

type Relations = HasOne
                 | BelongsTo
                 | HasMany
                 | HasManyBy
                 | BelongsToMany
                 | MorphOne
                 | MorphMany

export default Relations
