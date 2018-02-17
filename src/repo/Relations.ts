import HasOne from './relations/HasOne'
import BelongsTo from './relations/BelongsTo'
import HasMany from './relations/HasMany'
import HasManyBy from './relations/HasManyBy'
import BelongsToMany from './relations/BelongsToMany'
import MorphTo from './relations/MorphTo'
import MorphOne from './relations/MorphOne'
import MorphMany from './relations/MorphMany'
import MorphToMany from './relations/MorphToMany'

type Relations = HasOne
                 | BelongsTo
                 | HasMany
                 | HasManyBy
                 | BelongsToMany
                 | MorphTo
                 | MorphOne
                 | MorphMany
                 | MorphToMany

export default Relations
