# Model: Serialization

## Serializing To Json

To convert a model to JSON – Plain Object –, you can use `$toJson` method. The `$toJson` method is recursive, so all attributes and relations are going to be converted to JSON as well.

```js
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
