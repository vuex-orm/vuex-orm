# Attributes

There are several model attributes you can use to define model fields.

## Generic Type

Use `this.attr()` method to define the most generic field. The argument is the default value of the field which will be used when creating a new data if the field is not present.

```js
class User extends Model {
  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('John Doe')
    }
  }
}
```

## Auto Increment Type

`this.increment()` method will generate field type which will be auto incremented. Autoincrement field must be a number and should not have arguments. The value of this field gets incremented when you create a new record.

```js
class User extends Model {
  static fields () {
    return {
      id: this.increment(),
      name: this.attr('')
    }
  }
}
```
