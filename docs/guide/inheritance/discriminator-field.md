# Discriminator Field

## Type Mapping

When defining an inheritance model, one can use a discriminator field to dispatch entities based on this field value when inserting / creating data using the base entity `create` or `insert` method.  

By default, the entity field used as a discriminator field is the `type` field.  
A `static types` method also needs to be defined on the base entity. This method should return the mapping between discriminator field value and Model reference.

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

    static types() {
        return {
            'PERSON': Person,
            'ADULT': Adult
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
            job: this.attr('')
        }
    } 
}

// Creating mixed data
Person.create({ 
    data: [
        { type:'PERSON', id: 1, name: 'John Doe' },
        { type:'ADULT', id: 2, name: 'Jane Doe', job: 'Software Engineer' }
    ]
})

const persons = Person.all()

/* 
[
  Person { $id: 1, id: 1, name: 'John Doe' },
  Adult { $id: 2, id: 2, name: 'Jane Doe', job: 'Software Engineer' }
]
*/
```

## Discriminator Field override

You may define a `static typeKey` on the base entity of your hierarchy if you want to change the default discriminator field name.

```js 
// Base entity
class Person extends Model {
    static entity = 'person'
    static typeKey = 'person_type' // override

    static fields() {
        return {
            id: this.attr(null),
            name: this.attr('')
        }
    }

    static types() {
        return {
            'PERSON': Person,
            'ADULT': Adult
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
            job: this.attr('')
        }
    } 
}

// Creating mixed data
Person.create({ 
    data: [
        { person_type: 'PERSON', id: 1, name: 'John Doe' },
        { person_type: 'ADULT', id: 2, name: 'Jane Doe', job: 'Software Engineer' }
    ]
})

const persons = Person.all()

/* 
[
  Person { $id: 1, id: 1, name: 'John Doe' },
  Adult { $id: 2, id: 2, name: 'Jane Doe', job: 'Software Engineer' }
]
*/
```

## Exposing the discriminator field

Note that if the `static fields` method doesn't expose the discriminator field (default or custom one), it will not be exposed in the results when fetching data.  
If you want to be able to read the discriminator field, you'll need to add it to the `fields` method **on the base entity**:

```js
// Base entity
class Person extends Model {
    static entity = 'person'

    static fields() {
        return {
            id: this.attr(null),
            name: this.attr(''),
            type: this.attr('PERSON') // exposing the discriminator field
        }
    }

    static types() {
        return {
            'PERSON': Person,
            'ADULT': Adult
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
            job: this.attr('')
        }
    } 
}

// Creating mixed data
Person.create({ 
    data: [
        { type:'PERSON', id: 1, name: 'John Doe' },
        { type:'ADULT', id: 2, name: 'Jane Doe', job: 'Software Engineer' }
    ]
})

const persons = Person.all()

/* 
[
  Person { $id: 1, id: 1, name: 'John Doe', type: 'PERSON' },
  Adult { $id: 2, id: 2, name: 'Jane Doe', job: 'Software Engineer', type: 'ADULT' }
]
*/

```
