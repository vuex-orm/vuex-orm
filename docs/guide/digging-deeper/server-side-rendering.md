# Server Side Rendering

If you want to do [SSR](https://vuejs.org/v2/guide/ssr.html), for example, with [Nuxt.js](https://nuxtjs.org/), always [fetch model from injected database instance](../model/retrieving-models.md#fetch-from-database).

```js
export default {
  computed: {
    User () {
      return this.$store.$db().model('users')
    },

    users () {
      return this.User.all()
    }
  }
}
```

Other than that, Vuex ORM is just an Vuex wrapper. If you're able to do SSR with Vuex, you can do it with Vuex ORM as well.
