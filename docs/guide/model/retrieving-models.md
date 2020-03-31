# Retrieve Models

There're 2 ways to retrieve a model object in Vue Component. The first one is to import directly with the `import` statement, and another way is to fetch it from the database instance, which is injected into the Vuex Store instance.

The rule of thumb is if you want to do [SSR](https://vuejs.org/v2/guide/ssr.html), for example, with [Nuxt.js](https://nuxtjs.org/), always fetch model from injected database instance. We'll explain it in more detail later on this page.

## Import Statement

Use the ES6 static `import` statement to fetch models. If you're not doing SSR, this is probably the simplest way to access a model object.

```js
import User from '@/models/User'

export default {
  computed: {
    users () {
      return User.all()
    }
  }
}
```

## Fetch from Database

You can fetch models through database instance, which Vuex ORM injects into the Vuex Store instance. When you're doing SSR, you should be using this approach.

After installing Vuex ORM, you can access `$db` method in the store instance. `$db` will fetch the database instance, and from there, you can use the `model` method to retrieve the model object. You should pass the model's entity name as the argument.

```js
export default {
  computed: {
    users () {
      return this.$store.$db().model('users').all()
    }
  }
}
```

If you need to use the model object in many places, you can always define it separately.

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

You can also pass the model object as an argument. This is good, especially for TypeScript users, because now you'll get correct typings.

```ts
import Vue from 'vue'
import User from '@/models/User'

export default Vue.extend({
  computed: {
    User (): typeof User {
      return this.$store.$db().model(User)
    },

    users (): User[] {
      return this.User.all()
    }
  }
})
```

## Which to Use?

As the rule of thumb, if you want to do SSR, always fetch model from injected database instance.

When importing models via `import` statement, you're using the global singleton. Well, having a singleton object is not always bad. As long as you are using it in a single app, everything will work fine. However, it's a bad practice when doing SSR, as stated here at Vue SSR doc.

By importing models from the database instance, you can avoid having any stateful singleton. It's up to you which method you'll be using, but **we strongly recommend not to mix 2 methods in your app**. Decide one way to do it, and stick to it.
