import { createApplication } from 'test/support/Helpers'
import User from 'test/fixtures/models/User'
import Profile from 'test/fixtures/models/Profile'
import Account from 'test/fixtures/models/Account'
import Post from 'test/fixtures/models/Post'
import Comment from 'test/fixtures/models/Comment'
import Review from 'test/fixtures/models/Review'
import Like from 'test/fixtures/models/Like'
import Cluster from 'test/fixtures/models/Cluster'
import Node from 'test/fixtures/models/Node'
import CustomKey from 'test/fixtures/models/CustomKey'
import Query from 'app/query/Query'

describe('Query – Retrieve – Relations', () => {
  beforeEach(() => {
    createApplication('entities', [
      { model: User },
      { model: Profile },
      { model: Account },
      { model: Post },
      { model: Comment },
      { model: Review },
      { model: Like },
      { model: Cluster },
      { model: Node },
      { model: CustomKey }
    ])
  })

  it('can resolve has one relation', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, profile: 3 }
      }},
      profiles: { data: {
        '3': { $id: 3, id: 3, user_id: 1, users: 1 }
      }}
    }

    const expected = {
      $id: 1,
      id: 1,
      profile: {
        $id: 3,
        id: 3,
        user_id: 1,
        users: 1
      }
    }

    const result = Query.query(state, 'users', false).with('profile').first()

    expect(result).toEqual(expected)
  })

  it('can resolve belongs to relation', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, name: 'John Doe' }
      }},
      posts: { data: {
        '3': { $id: 3, id: 3, user_id: 1, author: 1 }
      }}
    }

    const expected = {
      $id: 3,
      id: 3,
      user_id: 1,
      author: {
        $id: 1,
        id: 1,
        name: 'John Doe'
      }
    }

    const result = Query.query(state, 'posts', false).with('author').first()

    expect(result).toEqual(expected)
  })

  it('can resolve belongs to relation which its id is 0', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '0': { $id: 0, id: 0, name: 'John Doe' }
      }},
      posts: { data: {
        '3': { $id: 3, id: 3, user_id: 0, author: 0 }
      }}
    }

    const expected = {
      $id: 3,
      id: 3,
      user_id: 0,
      author: {
        $id: 0,
        id: 0,
        name: 'John Doe'
      }
    }

    const result = Query.query(state, 'posts', false).with('author').first()

    expect(result).toEqual(expected)
  })

  it('can resolve belongs to relation with custom foreign key', () => {
    const state = {
      $name: 'entities',
      clusters: { data: {
       '1': { $id: 1, id: 1, name: 'tokyo', nodes: [1] }
      }},
      nodes: { data: {
       '1': { $id: 1, id: 1, name: 'one', clusterId: 1 },
       '2': { $id: 2, id: 2, name: 'two', clusterId: null }
      }}
    }

    const nodes = Query.query(state, 'nodes', false).with('cluster').get()

    const expected = [
      { $id: 1, id: 1, name: 'one', clusterId: 1, cluster: { $id: 1, id: 1, name: 'tokyo', nodes: [1] } },
      { $id: 2, id: 2, name: 'two', clusterId: null, cluster: null },
    ]

    expect(nodes).toEqual(expected)
  })

  it('can resolve belongs to relation and instantiate the result record', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, name: 'John Doe' }
      }},
      posts: { data: {
        '3': { $id: 3, id: 3, user_id: 1, author: 1 }
      }}
    }

    const result = Query.query(state, 'posts').with('author').first()

    if (result === null || result.author === null) {
      return t.fail('The result is expected to be not null.')
    }

    expect(result).toBeInstanceOf(Post)
    expect(result.author).toBeInstanceOf(User)
  })

  it('can resolve has many by relation', () => {
    const state = {
      $name: 'entities',
      posts: { data: {
        '1': { id: 1, title: 'Post Title', reviews: [1, 2] }
      }},
      reviews: { data: {
        '1': { id: 1 },
        '2': { id: 2 }
      }}
    }

    const expected = {
      id: 1,
      title: 'Post Title',
      reviews: [{ id: 1 }, { id: 2 }]
    }

    const post = Query.query(state, 'posts').with('reviews').first()

    expect(post).toBeInstanceOf(Post)
    expect(post.reviews.length).toBe(2)
    expect(post.reviews[0]).toBeInstanceOf(Review)
  })

  it('can resolve relation constraint', () => {
    const state = {
      $name: 'entities',
      posts: { data: {
        '1': { id: 1, title: 'Post Title', comments: [1, 2, 3] }
      }},
      comments: { data: {
        '1': { id: 1, post_id: 1, type: 'review' },
        '2': { id: 2, post_id: 1, type: 'comment' },
        '3': { id: 3, post_id: 1, type: 'review' }
      }}
    }

    const expected = {
      id: 1,
      title: 'Post Title',
      comments: [
        { id: 1, post_id: 1, type: 'review' },
        { id: 3, post_id: 1, type: 'review' }
      ]
    }

    const post = Query.query(state, 'posts', false).with('comments', (query) => {
      query.where('type', 'review')
    }).first()

    expect(post).toEqual(expected)
  })

  it('can query all relations', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, profile: 3 }
      }},
      profiles: { data: {
        '3': { $id: 3, id: 3, user_id: 1, users: 1 }
      }},
      posts: { data: {
        '3': { $id: 3, id: 3, user_id: 1, author: 1 }
      }}
    }

    const expected = {
      $id: 1,
      id: 1,
      profile: { $id: 3, id: 3, user_id: 1, users: 1 },
      posts: [{ $id: 3, id: 3, user_id: 1, author: 1 }]
    }

    const user1 = Query.query(state, 'users', false).withAll().first()
    const user2 = Query.query(state, 'users', false).with('*').first()

    expect(user1).toEqual(expected)
    expect(user2).toEqual(expected)
  })

  it('can query all relations recursively', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, profile: 3 }
      }},
      profiles: { data: {
        '3': { $id: 3, id: 3, user_id: 1, users: 1 }
      }},
      posts: { data: {
        '1': { id: 1, user_id: 1, title: 'Post Title', reviews: [1, 2] }
      }},
      comments: { data: {
        '1': { id: 1, post_id: 1, type: 'review' }
      }},
      likes: { data: {
        '1': { id: 1, comment_id: 1 }
      }},
      reviews: { data: {
        '1': { id: 1 },
        '2': { id: 2 }
      }}
    }

    const expected = {
      '$id': 1,
      'id': 1,
      'posts': [{
        'author': {
          '$id': 1,
          'id': 1,
          'posts': [{ 'id': 1, 'reviews': [1, 2], 'title': 'Post Title', 'user_id': 1 }],
          'profile': { '$id': 3, 'id': 3, 'user_id': 1, 'users': 1 }
        },
        'comments': [{
          'id': 1,
          'likes': [{ 'comment_id': 1, 'id': 1 }],
          'post': { 'id': 1, 'reviews': [1, 2], 'title': 'Post Title', 'user_id': 1 },
          'post_id': 1,
          'type': 'review'
        }],
        'id': 1,
        'reviews': [{ 'id': 1 }, { 'id': 2 }],
        'title': 'Post Title',
        'user_id': 1
      }],
      'profile': {
        '$id': 3,
        'id': 3,
        'user': {
          '$id': 1,
          'id': 1,
          'posts': [{ 'id': 1, 'reviews': [1, 2], 'title': 'Post Title', 'user_id': 1 }],
          'profile': { '$id': 3, 'id': 3, 'user_id': 1, 'users': 1 }
        },
        'user_id': 1,
        'users': 1
      }
    };

    const user = Query.query(state, 'users', false).withAllRecursive(2).first()

    expect(user).toEqual(expected)
  })

  it('can resolve child relation', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 1 }
      }},
      posts: { data: {
        '1': { id: 1, user_id: 1, title: 'Post Title', comments: [1, 2, 3] }
      }},
      comments: { data: {
        '1': { id: 1, post_id: 1, type: 'review' },
        '2': { id: 2, post_id: 1, type: 'comment' },
        '3': { id: 3, post_id: 1, type: 'review' }
      }}
    }

    const expected = {
      id: 1,
      posts: [{
        id: 1,
        user_id: 1,
        title: 'Post Title',
        comments: [
          { id: 1, post_id: 1, type: 'review' },
          { id: 2, post_id: 1, type: 'comment' },
          { id: 3, post_id: 1, type: 'review' }
        ]
      }]
    }

    const post = Query.query(state, 'users', false).with('posts.comments').first()

    expect(post).toEqual(expected)
  })

  it('can resolve even deeper child relation', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { id: 1 }
      }},
      posts: { data: {
        '1': { id: 1, user_id: 1, title: 'Post Title', comments: [1, 2, 3] }
      }},
      comments: { data: {
        '1': { id: 1, post_id: 1, type: 'review' }
      }},
      likes: { data: {
        '1': { id: 1, comment_id: 1 }
      }}
    }

    const expected = {
      id: 1,
      posts: [{
        id: 1,
        user_id: 1,
        title: 'Post Title',
        comments: [
          { id: 1, post_id: 1, type: 'review', likes: [{ id: 1, comment_id: 1 }] }
        ]
      }]
    }

    const post = Query.query(state, 'users', false).with('posts.comments.likes').first()

    expect(post).toEqual(expected)
  })

  it('can resolve child relations with multiple sub relations', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1, profile: 3 }
      }},
      profiles: { data: {
        '3': { $id: 3, id: 3, user_id: 1, users: 1 }
      }},
      posts: { data: {
        '1': { id: 1, user_id: 1, title: 'Post Title', reviews: [1, 2] }
      }},
      comments: { data: {
        '1': { id: 1, post_id: 1, type: 'review' }
      }},
      likes: { data: {
        '1': { id: 1, comment_id: 1 }
      }},
      reviews: { data: {
        '1': { id: 1 },
        '2': { id: 2 }
      }}
    }

    const expected1 = {
      '$id': 1,
      'id': 1,
      'profile': 3,
      'posts': [{
        'id': 1,
        'user_id': 1,
        'title': 'Post Title',
        'reviews': [{'id': 1}, {'id': 2}],
        'comments': [{'id': 1, 'post_id': 1, 'type': 'review'}]
      }]
    };
    const expected2 = {
      '$id': 1,
      'id': 1,
      'profile': 3,
      'posts': [{
        'id': 1,
        'user_id': 1,
        'title': 'Post Title',
        'reviews': [{'id': 1}, {'id': 2}],
        'author': {'$id': 1, 'id': 1, 'profile': 3},
        'comments': [{'id': 1, 'post_id': 1, 'type': 'review'}]
      }]
    };

    const user1 = Query.query(state, 'users', false).with('posts.reviews|comments').first()
    const user2 = Query.query(state, 'users', false).with('posts.*').first()

    expect(user1).toEqual(expected1)
    expect(user2).toEqual(expected2)
  })

  it('can query data depending on relationship existence', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 },
        '3': { $id: 3, id: 3 }
      }},
      posts: { data: {
        '1': { $id: 1, id: 1, user_id: 1 },
        '2': { $id: 2, id: 2, user_id: 2 },
        '3': { $id: 3, id: 3, user_id: 2 }
      }}
    }

    const expected = [{ $id: 1, id: 1 }, { $id: 2, id: 2 }]

    const users = Query.query(state, 'users', false).has('posts').get()

    expect(users).toEqual(expected)
  })

  it('can query data depending on relationship absence', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 },
        '3': { $id: 3, id: 3 }
      }},
      posts: { data: {
        '1': { $id: 1, id: 1, user_id: 1 },
        '2': { $id: 2, id: 2, user_id: 2 },
        '3': { $id: 3, id: 3, user_id: 2 }
      }}
    }

    const expected = [{ $id: 3, id: 3 }]

    const users = Query.query(state, 'users', false).hasNot('posts').get()

    expect(users).toEqual(expected)
  })

  it('can query data depending on relationship existence with constraint', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 },
        '3': { $id: 3, id: 3 }
      }},
      posts: { data: {
        '1': { $id: 1, id: 1, user_id: 1, type: 'news' },
        '2': { $id: 2, id: 2, user_id: 2, type: 'event' },
        '3': { $id: 3, id: 3, user_id: 2, type: 'news' }
      }}
    }

    const expected = [{ $id: 2, id: 2 }]

    const users = Query.query(state, 'users', false)
      .whereHas('posts', query => query.where('type', 'event'))
      .get()

    expect(users).toEqual(expected)
  })

  it('can query data depending on relationship absence with constraint', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 },
        '3': { $id: 3, id: 3 }
      }},
      posts: { data: {
        '1': { $id: 1, id: 1, user_id: 1, type: 'news' },
        '2': { $id: 2, id: 2, user_id: 2, type: 'event' },
        '3': { $id: 3, id: 3, user_id: 2, type: 'news' }
      }}
    }

    const expected = [{ $id: 1, id: 1 }, { $id: 3, id: 3 }]

    const users = Query.query(state, 'users', false)
      .whereHasNot('posts', query => query.where('type', 'event'))
      .get()

    expect(users).toEqual(expected)
  })

  it('can query data depending on relationship existence with number', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 },
        '3': { $id: 3, id: 3 }
      }},
      posts: { data: {
        '1': { $id: 1, id: 1, user_id: 1, type: 'news' },
        '2': { $id: 2, id: 2, user_id: 2, type: 'event' },
        '3': { $id: 3, id: 3, user_id: 2, type: 'news' }
      }}
    }

    const expected = [{ $id: 2, id: 2 }]

    const users = Query.query(state, 'users', false).has('posts', 2).get()

    expect(users).toEqual(expected)
  })

  it('can query data depending on relationship absence with number', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 },
        '3': { $id: 3, id: 3 }
      }},
      posts: { data: {
        '1': { $id: 1, id: 1, user_id: 1, type: 'news' },
        '2': { $id: 2, id: 2, user_id: 2, type: 'event' },
        '3': { $id: 3, id: 3, user_id: 2, type: 'news' }
      }}
    }

    const expected = [{ $id: 1, id: 1 }, { $id: 3, id: 3 }]

    const users = Query.query(state, 'users', false).hasNot('posts', 2).get()

    expect(users).toEqual(expected)
  })

  it('can query data depending on relationship existence with string conditions', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 },
        '3': { $id: 3, id: 3 }
      }},
      posts: { data: {
        '1': { $id: 1, id: 1, user_id: 1, type: 'news' },
        '2': { $id: 2, id: 2, user_id: 2, type: 'event' },
        '3': { $id: 3, id: 3, user_id: 2, type: 'news' }
      }}
    }

    expect(Query.query(state, 'users', false).has('posts', '>', 1).get()).toEqual([{ $id: 2, id: 2 }])
    expect(Query.query(state, 'users', false).has('posts', '>=', 1).get()).toEqual([{ $id: 1, id: 1 }, { $id: 2, id: 2 }])
    expect(Query.query(state, 'users', false).has('posts', '<', 2).get()).toEqual([{ $id: 1, id: 1 }])
    expect(Query.query(state, 'users', false).has('posts', '<=', 2).get()).toEqual([{ $id: 1, id: 1 }, { $id: 2, id: 2 }])
  })

  it('can query data depending on relationship absence with string conditions', () => {
    const state = {
      $name: 'entities',
      users: { data: {
        '1': { $id: 1, id: 1 },
        '2': { $id: 2, id: 2 },
        '3': { $id: 3, id: 3 }
      }},
      posts: { data: {
        '1': { $id: 1, id: 1, user_id: 1, type: 'news' },
        '2': { $id: 2, id: 2, user_id: 2, type: 'event' },
        '3': { $id: 3, id: 3, user_id: 2, type: 'news' }
      }}
    }

    expect(Query.query(state, 'users', false).hasNot('posts', '>', 1).get()).toEqual([{ $id: 1, id: 1 }, { $id: 3, id: 3 }])
    expect(Query.query(state, 'users', false).hasNot('posts', '>=', 1).get()).toEqual([{ $id: 3, id: 3 }])
    expect(Query.query(state, 'users', false).hasNot('posts', '<', 2).get()).toEqual([{ $id: 2, id: 2 }, { $id: 3, id: 3 }])
    expect(Query.query(state, 'users', false).hasNot('posts', '<=', 2).get()).toEqual([{ $id: 3, id: 3 }])
  })
})
