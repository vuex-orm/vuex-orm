# Defining Inheritance

Vuex ORM supports inheritance / sub-classing through ES6 extension  
 (use of the `class ... extends ...` syntax).  
 
## Inheritance Conventions

In order to define inheritance in Vuex ORM needs, you need to follow some conventions.  
On each sub-entity of your hierarchy, you'll need to:

1. Make sure the sub-entity class extends another Vuex ORM Model class;
2. Add a reference to the base entity name along with the `static entity` reference;
3. Call `super.fields()` in the `static fields` method to make sure to merge the sub-entity fields with the base one.

```js
// Base entity
class Person extends Model {
    static entity = 'person'

    static fields() {
        return {
            id: this.attr(null),
            name: this.attr('')
        }
    }
}

// Derived entity
class Adult extends Person { // 1. Extend base entity
    static entity = 'adult'
    static baseEntity = 'person' // 2. Referece to base entity name

    static fields() {
        return {
            ...super.fields(), // 3. Call to super.fields() to merge fields
            job: this.attr('')
        }
    } 
}
```

## Interacting with the store

Once you defined a sub-class, you can create / insert / update / get / delete entities using the Model static methods or Vuex ORM actions (see [Inserting and Updating data](../store/inserting-and-updating-data.md)).  
For instance, to create or insert data:

```js

Adult.create({ 
    data: { id: 1, name: 'John Doe', job: 'Software Engineer' }
})

// Or

Adult.insert({ 
    data: { id: 2, name: 'Jane Doe', job: 'Software Engineer' }
})

```

And to fetch data: 

```js
const adults = Adult.all()

/* 
[
  Adult { $id: 1, id: 1, name: 'John Doe', job: 'Software Engineer' },
  Adult { $id: 2, id: 2, name: 'Jane Doe', job: 'Software Engineer' }
]
*/

```

You can fetch mixed results using the base entity getter:

```js

const persons = Person.all()

/* 
[
  Person { $id: 1, id: 1, name: 'John Doe' },
  Adult { $id: 2, id: 2, name: 'Jane Doe', job: 'Software Engineer' }
]
*/
```
However, using only these, you need to use the sub-entity methods (like `Adult.create` in our example) if you want to insert sub-entity.  
If you want to deal with mixed data from the same hierarchy, you may use a [discriminator field](discriminator-field.md) to dispatch entity using the base entity methods.

## Relation handling

Inheritance handles relation as any field: 
* if the relation is defined on the base entity, it be inherited by all sub-entities;
* if the relation is defined on a derived entity, only instances of this entity will be able to have related data.

Querying related data using the `with` keyword (see [this page](../relationships/retrieving-relationships.md)) will fill the blank only when needed, particularly if you call the base entity getter with relation names specific to a subclass.

```js
// Base entity
class Person extends Model {
    static entity = 'person'

    static fields() {
        return {
            id: this.attr(null),
            name: this.attr(''),
            home_address: this.belongsTo(Address, 'home_address_id'),
            home_address_id: this.attr(null)
        }
    }
}

// Derived entity
class Adult extends Person {
    static entity = 'adult'
    static baseEntity = 'person'

    static fields() {
        return {
            ...super.fields(), 
            job: this.attr(''),
            work_address: this.belongsTo(Address, 'work_address_id'),
            work_address_id: this.attr(null)
        }
    } 
}

class Address extends Model {
    static entity = 'address'

    static fields() {
        id: this.attr(null),
        city: this.string()
    }
}

// Inserting data
Address.create({
    data: [
        { id: 1, city: 'TOKYO' },
        { id: 2, city: 'PARIS' },
        { id: 3, city: 'BERLIN' },
    ]
})

Person.create({
    data: { id: 1, name: 'John Doe', home_address_id: 1 }
})

Adult.create({
    data: { id: 2, name: 'Jane Doe', job: 'Software Engineer', home_address_id: 2, work_address_id: 3}
})

// Retrieving
const persons = Person.query().with(['home_address', 'work_address']).all()

/*
[
  Person { $id: 1, id: 1, name: 'John Doe', home_address_id: 1, home_address: { $id: 1, id: 1, city: 'TOKYO' } },
  Adult { $id: 2, id: 2, name: 'Jane Doe', job: 'Software Engineer', 
          home_address_id: 2, home_address: { $id: 2, id: 2, city: 'PARIS' }, 
          work_address_id: 3, work_address: { $id: 3, id: 3, city: 'BERLIN' } 
        }
]
*/

```