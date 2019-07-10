# Serialization

You can convert a model instance to a plain object by calling `$toJson` method. `$toJson` method is recursive, so all attributes and relations are going to be converted to JSON as well.

```js
const user = User.query().with('profile').first()

const json = user.$toJson()

/*
  {
    id: 1,
    name: 'John Doe',
    profile: {
      id: 1,
      user_id: 1,
      age: 24,
      sex: 'male'
    }
  }
*/
```
