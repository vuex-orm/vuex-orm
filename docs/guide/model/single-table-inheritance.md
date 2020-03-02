# Single Table Inheritance

Vuex ORM supports Single Table Inheritance (STI) or Sub-classing through ES6 extension (use of the `class ... extends ...` syntax). STI is a way to emulate object-oriented inheritance in a relational database. If you're coming from Ruby on Rails land, you might be familier with it.

Basically, it will allow you to get different Model instance based on types of records in the same entity. For example, you might have `users` entity, and you could have a field called `type` and it could be `Person`, `Adult`, or `Child`. Now, when you fetch these records, sometime it's useful if we can get each type in its own Model instance. Here is where STI comes in to play nicely.

## Inheritance Conventions

In order to define inheritance in Vuex ORM, you need to follow some conventions. On each sub-entity of your hierarchy, you'll need to:

1. Make sure the sub-entity class extends another Vuex ORM Model class.
2. Add a reference to the base entity name along with the `static entity` reference.
3. Call `super.fields()` in the `static fields` method to make sure to merge the sub-entity fields with the base one.

```js
// Base entity.
class Person extends Model {
  static entity = 'person'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }
}

// Derived entity. You should extend the base entity.
class Adult extends Person {
  static entity = 'adult'

  // Reference to base entity name.
  static baseEntity = 'person' 

  // Call `super.fields()`` to merge fields.
  static fields () {
    return {
      ...super.fields(),
      job: this.attr('')
    }
  } 
}
```

## Interacting with Data

Once you defined a sub-class, you can `insert` / `create` / `update` / `get` / `delete` entities using the Model static methods. For instance, to create or insert data:

```js
Adult.insert({ 
  data: { id: 1, name: 'John Doe', job: 'Software Engineer' }
})
```

And to fetch data: 

```js
const adults = Adult.all()

/* 
[
  Adult { id: 1, name: 'John Doe', job: 'Software Engineer' },
  Adult { id: 2, name: 'Jane Doe', job: 'Software Engineer' }
]
*/
```

You can also fetch mixed results using the base entity getter:

```js
const people = Person.all()

/* 
[
  Person { id: 1, name: 'John Doe' },
  Adult  { id: 2, name: 'Jane Doe', job: 'Software Engineer' }
]
*/
```

However, using only these, you need to use the sub-entity methods (like `Adult.insert` in our example) if you want to insert sub-entity. If you want to deal with mixed data from the same hierarchy, you may use a "Discriminator Field" to dispatch entity using the base entity methods.

## Discriminator Field

When defining an inheritance model, one can use a discriminator field to dispatch entities based on this field value when inserting data using the base entity `insert` or `create` method.  

By default, the entity field used as a discriminator field is the `type` field. A `static types` method also needs to be defined on the base entity. This method should return the mapping between discriminator field value and Model reference.

```js
// Base entity.
class Person extends Model {
  static entity = 'person'

  static types () {
    return {
      PERSON: Person,
      ADULT: Adult
    }
  }

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }
}

// Derived entity.
class Adult extends Person { 
  static entity = 'adult'

  static baseEntity = 'person'

  static fields () {
    return {
      ...super.fields(),
      job: this.attr('')
    }
  } 
}
```

> **NOTE:** If you import Models from other files, you might get circular reference error. Please take a look at [this section](#notes-on-circular-imports) for more detail and how to avoid it.

Now, you can create mixed types of records at once.

```js
// Creating mixed data.
Person.insert([
  { type: 'PERSON', id: 1, name: 'John Doe' },
  { type: 'ADULT',  id: 2, name: 'Jane Doe', job: 'Software Engineer' }
])

const people = Person.all()

/* 
[
  Person { id: 1, name: 'John Doe' },
  Adult  { id: 2, name: 'Jane Doe', job: 'Software Engineer' }
]
*/
```

### Discriminator Field Override

You may define a `static typeKey` on the base entity of your hierarchy if you want to change the default discriminator field name.

```js 
// Base entity.
class Person extends Model {
  static entity = 'person'

  static typeKey = 'person_type'

  static types () {
    return {
      PERSON: Person,
      ADULT: Adult
    }
  }

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }
}

// Derived entity.
class Adult extends Person { 
  static entity = 'adult'

  static baseEntity = 'person'

  static fields () {
    return {
      ...super.fields(),
      job: this.attr('')
    }
  } 
}
```

And now you may use custome type field when inserting data.

```js
Person.insert([
  { person_type: 'PERSON', id: 1, name: 'John Doe' },
  { person_type: 'ADULT',  id: 2, name: 'Jane Doe', job: 'Software Engineer' }
])

const people = Person.all()

/* 
[
  Person { id: 1, name: 'John Doe' },
  Adult  { id: 2, name: 'Jane Doe', job: 'Software Engineer' }
]
*/
```

### Exposing the Discriminator Field

Note that if the `static fields` method doesn't expose the discriminator field (default or custom one), it will not be exposed in the results when fetching data. If you want to be able to read the discriminator field, you'll need to add it to the `fields` method **on the base entity**:

```js
// Base entity.
class Person extends Model {
  static entity = 'person'

  static types () {
    return {
      PERSON: Person,
      ADULT: Adult
    }
  }

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      type: this.attr('PERSON') // Exposing the discriminator field.
    }
  }
}

// Derived entity.
class Adult extends Person { 
  static entity = 'adult'
  static baseEntity = 'person'

  static fields () {
    return {
      ...super.fields(),
      job: this.attr('')
    }
  } 
}
```
Then you can fetch the key with its results.

```js
// Creating mixed data
Person.insert([
  { type: 'PERSON', id: 1, name: 'John Doe' },
  { type: 'ADULT',  id: 2, name: 'Jane Doe', job: 'Software Engineer' }
])

const people = Person.all()

/* 
[
  Person { id: 1, name: 'John Doe', type: 'PERSON' },
  Adult  { id: 2, name: 'Jane Doe', job: 'Software Engineer', type: 'ADULT' }
]
*/
```

## Relationship Handling

Inheritance handles relation as any field:

- If the relation is defined on the base entity, it will be inherited by all sub-entities.
- If the relation is defined on a derived entity, only instances of this entity will be able to have related data.

Querying related data using the `with` keyword (see [this page](/guide/data/retrieving.html#relationships)) will fill the blank only when needed, particularly if you call the base entity getter with relation names specific to a sub-class.

```js
class Person extends Model {
  static entity = 'person'

  static fields () {
    return {
      id: this.attr(null),
      home_address_id: this.attr(null),
      name: this.attr(''),
      home_address: this.belongsTo(Address, 'home_address_id'),
    }
  }
}

class Adult extends Person {
  static entity = 'adult'

  static baseEntity = 'person'

  static fields() {
    return {
      ...super.fields(), 
      work_address_id: this.attr(null),
      job: this.attr(''),
      work_address: this.belongsTo(Address, 'work_address_id'),
    }
  } 
}

class Address extends Model {
  static entity = 'address'

  static fields () {
    id: this.attr(null),
    city: this.string()
  }
}
```

And let's see what would happen in this case.

```js
Address.insert([
  { id: 1, city: 'TOKYO' },
  { id: 2, city: 'PARIS' },
  { id: 3, city: 'BERLIN' }
])

Person.insert({
  id: 1,
  home_address_id: 1,
  name: 'John Doe'
})

Adult.insert({
  id: 2,
  home_address_id: 2,
  work_address_id: 3,
  name: 'Jane Doe',
  job: 'Software Engineer'
})

const people = Person.query().with(['home_address', 'work_address']).get()

/*
[
  Person {
    id: 1,
    home_address_id: 1,
    name: 'John Doe',
    home_address: Address { id: 1, city: 'TOKYO' },
  },

  Adult {
    id: 2,
    home_address_id: 2,
    work_address_id: 3,
    name: 'Jane Doe',
    job: 'Software Engineer', 
    home_address: Address { id: 2, city: 'PARIS' },
    work_address: Address { id: 3, city: 'BERLIN' }
  }
]
*/
```

## Notes on Circular Imports

If you decide to declare each entity model in a separate file, and use `import` calls to cross-reference entity models between your file, you may get an error at runtime saying:

```bash
TypeError: Super expression must either be null or a function, not undefined.
```

If so, it means that you have cycles in your dependency tree and that your bundler doesn't handle them (usually they don't). We describe here a solution, inspired by [Michel Weststrate's article](https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de).

### Initial setup

Here is an example of the initial setup you might have:

`Person.js` references its child `Adult.js` because it needs it for type definition.

```js
// File 1: Person.js

import { Model } from '@vuex-orm/core'
import Adult from './Adult'

export default class Person extends Model {
  static entity = 'person'

  static types () {
    return {
      PERSON: Person,
      ADULT: Adult
    }
  }

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      type: this.attr('PERSON')
    }
  }
}
```

`Adult.js` references its parent model, through `Person.js`.

```js
// File 2: Adult.js

import Person from './Person'

export default class Adult extends Person {
  static entity = 'adult'

  static baseEntity = 'person'

  static fields() {
    return {
      ...super.fields(),
      job: this.attr('')
    }
  }
}
```

The store initialization imports all models.

```js
// File 3: file where you initialize your store

...
import Person from '@/Models/Person'
import Adult from '@/Models/Adult'
...

const database = new VuexORM.Database()

database.register(Person)
database.register(Adult)

...

export default new Vuex.Store({
    plugins: [VuexORM.install(database)]
})
```

So even if we import Person first, it tries to import Adult which references Person which hasn't be fully imported yet.

### Solution: How to Break Cycles

The solution, as presented in [this article](https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de), is to use an intermediate file which imports and exports all entities used in the hierarchy.

```js
// New file: PersonHierarchy.js

export * from './Person'
export * from './Adult'
```

You'll need to change the involved entities files to take into account the changes:

```js
// File 1: Person.js

import { Model } from '@vuex-orm/core'
import { Adult } from './PersonHierarchy' // Here, we change the import.

// We export directly the named class.
export class Person extends Model {
  static entity = 'person'

  static types () {
    return {
      PERSON: Person,
      ADULT: Adult
    }
  }

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      type: this.attr('PERSON')
    }
  }
}

// We also export a default.
export default Person
```

```js
// File 2: Adult.js

import { Person } from './PersonHierarchy' // Here, we change the import.

// We export directly the named class.
export class Adult extends Person {
  static entity = 'adult'

  static baseEntity = 'person'

  static fields() {
    return {
      ...super.fields(),
      job: this.attr('')
    }
  }
}

// We also export a default.
export default Adult;
```

And in the store initialization:

```js
// File 3: File where you initialize your store.

...
import { Person, Adult } from '@/models/PersonHierarchy'
...

const database = new VuexORM.Database();

database.register(Person);
database.register(Adult);

...

export default new Vuex.Store({
    plugins: [VuexORM.install(database)]
})
```

### Default Export

In our solution, we also expose a `default` export in the different file, which can be used in subsequent files. Indeed, what is important in our case (in comparison with the generic case described in [Michel Weststrate's article](https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de)) is that the classes of a hierarchy **and** the store initialization file reference the intermediate file. But since all classes are "setup" when declaring the database, there is no risk in referencing the classes directly afterward (without going through the intermediate file).

For instance, you may directly import your _Adult_ model like this in a Vue Component:

```js
import Adult from '@/models/Adult';

export default {
  created () {
    Adult.insert({ id: 1, name: 'John Doe', job: 'Software Engineer' })
  }
}
```
