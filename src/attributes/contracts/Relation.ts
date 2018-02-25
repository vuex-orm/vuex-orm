import HasOne from '../relations/HasOne'
import BelongsTo from '../relations/BelongsTo'
import HasMany from '../relations/HasMany'
import HasManyBy from '../relations/HasManyBy'
import HasManyThrough from '../relations/HasManyThrough'
import BelongsToMany from '../relations/BelongsToMany'
import MorphTo from '../relations/MorphTo'
import MorphOne from '../relations/MorphOne'
import MorphMany from '../relations/MorphMany'
import MorphToMany from '../relations/MorphToMany'
import MorphedByMany from '../relations/MorphedByMany'

type Relations = HasOne
                 | BelongsTo
                 | HasMany
                 | HasManyBy
                 | HasManyThrough
                 | BelongsToMany
                 | MorphTo
                 | MorphOne
                 | MorphMany
                 | MorphToMany
                 | MorphedByMany

export default Relations
