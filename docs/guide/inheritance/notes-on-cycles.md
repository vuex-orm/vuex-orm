# Notes on import cycles

If you decide to declare each entity model in a separate file, and use `import` calls to cross-reference entity models between your file, you may get an error at runtime saying:

```
TypeError: Super expression must either be null or a function, not undefined.
```

If so, it means that you have cycles in your dependency tree and that your bundler doesn't handle them (as much don't).  
We describe here a solution, inspired by [Michel Weststrate's article](https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de).

## Initial setup

Here is an example of the initial setup you might have:

`Person.js` references its child `Adult.js` because it needs it for type definition.

```js
// File 1: Person.js

import { Model } from '@vuex-orm/core';
import Adult from '@/model/entities/adult';

export default class Person extends Model {
    static entity = 'person';

    static fields() {
        return {
            id: this.attr(null),
            name: this.attr(''),
            type: this.attr('PERSON')
        };
    }

    static types() {
        return {
            PERSON: Person,
            ADULT: Adult
        };
    }
}
```

`Adult.js` references its parent model, through `Person.js`.

```js
// File 2: Adult.js

import Person from '@/model/entities/person';

export default class Adult extends Person {
    static entity = 'adult';
    static baseEntity = 'person';

    static fields() {
        return {
            ...super.fields(),
            job: this.attr('')
        };
    }
}
```

The store initialization imports all models.

```js
// File 3: file where you initialize your store

...
import Person from '@/model/entities/person';
import Adult from '@/model/entities/adult';
...

const database = new VuexORM.Database();
database.register(Person, {});
database.register(Adult, {});

...

export default new Vuex.Store({
    plugins: [VuexORM.install(database)]
});

```

So even if we import Person first, it tries to import Adult which references Person which hasn't be fully imported yet.

## Solution : how to break cycles

The solution, as presented in [this article](https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de), is to use an intermediate file which imports and exports all entities used in the hierarchy.

```js
// New file: person-hierarchy.js

export * from '@/models/entities/Person';
export * from '@/models/entities/Adult';
```

You'll need to change the involved entities files to take into account the changes:

```js
// File 1: Person.js

import { Model } from '@vuex-orm/core';
import { Adult } from '@/model/entities/person-hierarchy'; // Here, we change the import

// we export directly the named class
export class Person extends Model {
    static entity = 'person';

    static fields() {
        return {
            id: this.attr(null),
            name: this.attr(''),
            type: this.attr('PERSON')
        };
    }

    static types() {
        return {
            PERSON: Person,
            ADULT: Adult
        };
    }
}

// We also export a default
export default Person;
```

```js
// File 2: Adult.js

import { Person } from '@/model/entities/person-hierarchy'; // Here, we change the import

// we export directly the named class
export class Adult extends Person {
    static entity = 'adult';
    static baseEntity = 'person';

    static fields() {
        return {
            ...super.fields(),
            job: this.attr('')
        };
    }
}

// We also export a default
export default Adult;
```

And in the store initialization:

```js
// File 3: file where you initialize your store

...
import { Person, Adult } from '@/model/entities/person-hierarchy';
...

const database = new VuexORM.Database();
database.register(Person, {});
database.register(Adult, {});

...

export default new Vuex.Store({
    plugins: [VuexORM.install(database)]
});

```

### Default export

In our solution, we also expose a `default` export in the different file, which can be used in subsequent files.  
Indeed, what is important in our case (in comparison with the generic case described in [Michel Weststrate's article](https://medium.com/visual-development/how-to-fix-nasty-circular-dependency-issues-once-and-for-all-in-javascript-typescript-a04c987cf0de)) is that the classes of a hierarchy **and** the store initialization file reference the intermediate file. But since all classes are "setup" when declaring the database, there is no risk in referencing the classes directly afterward (without going through the intermediate file).

For instance, you may directly import your _Adult_ model like this in a Vue Component:

```js
import Adult from '@/models/entities/Adult';

export default {
    mounted() {
        Adult.insert({
            data: { id: 1, name: 'John Doe', job: 'Software Engineer' }
        });
    }
};
```
