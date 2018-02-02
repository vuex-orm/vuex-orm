import HasOne from './relations/HasOne'
import BelongsTo from './relations/BelongsTo'
import HasMany from './relations/HasMany'
import HasManyBy from './relations/HasManyBy'

type Relations = HasOne | BelongsTo | HasMany | HasManyBy

export default Relations
