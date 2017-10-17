# Store: Creating and Updating the Store

To create new data within Vuex Store, you can use `create` or `insert` mutation method.

## Create

The `create` method is going to replace all existing data in store and create fresh new data.

```js
store.commit('entities/users/create', {
  data: {
    id: 1,
    name: 'John'
  }
})
```

`data` is a plane data you wish to create in store. It could be either `Object` (single data) or `Array` (list of data).

## Insert

The `insert` method is going to insert data to the store while keeping exisiting data. If the insering data has same id as exisiting data, that data will be replaced with new one.

```js
store.commit('entities/users/insert', {
  data: {
    id: 2,
    name: 'Jane'
  }
})
```
