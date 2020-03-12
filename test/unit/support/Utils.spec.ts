import Utils from '@/support/Utils'

describe('Unit - Utils', () => {
  describe('#orderBy', () => {
    it('can order collection by given key in asc order', () => {
      const collection = [
        { id: 2 },
        { id: 3 },
        { id: 10 },
        { id: 1 }
      ]

      const expected = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 10 }
      ]

      expect(Utils.orderBy(collection, ['id'], ['asc'])).toEqual(expected)
    })

    it('can order collection by given key in desc order', () => {
      const collection = [
        { id: 2 },
        { id: 3 },
        { id: 10 },
        { id: 1 }
      ]

      const expected = [
        { id: 10 },
        { id: 3 },
        { id: 2 },
        { id: 1 }
      ]

      expect(Utils.orderBy(collection, ['id'], ['desc'])).toEqual(expected)
    })

    it('can order collection of mixed value types', () => {
      const collection = [
        { id: 2 },
        { id: 'id3' },
        { name: 'John Doe' },
        { name: 'Andy Newman' },
        { id: null },
        { id: 'id1' },
        { id: 1 }
      ]

      const expected = [
        { id: 1 },
        { id: 2 },
        { id: 'id1' },
        { id: 'id3' },
        { id: null },
        { name: 'John Doe' },
        { name: 'Andy Newman' }
      ]

      expect(Utils.orderBy(collection, ['id'], ['asc'])).toEqual(expected)
    })

    it('can order collection with multiple keys', () => {
      const collection = [
        { id: 1, name: 'John Doe' },
        { id: 3, name: 'Peter Ericsson' },
        { id: 2, name: 'Andrew Black' },
        { id: 3, name: 'George Mac' },
        { id: 1, name: 'Bob Green' },
        { id: 2, name: 'Chris Brian' }
      ]

      const expected = [
        { id: 1, name: 'Bob Green' },
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Andrew Black' },
        { id: 2, name: 'Chris Brian' },
        { id: 3, name: 'George Mac' },
        { id: 3, name: 'Peter Ericsson' }
      ]

      expect(Utils.orderBy(collection, ['id', 'name'], ['asc', 'asc'])).toEqual(expected)
    })

    it('can order collection with multiple keys with mixed key types', () => {
      const collection = [
        { id: 1, name: 'John Doe' },
        { name: 'Peter Ericsson' },
        { id: 2, name: 'Andrew Black' },
        { name: 'George Mac' },
        { id: 1 },
        { id: 2, name: 'Chris Brian' }
      ]

      const expected = [
        { id: 1 },
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Chris Brian' },
        { id: 2, name: 'Andrew Black' },
        { name: 'Peter Ericsson' },
        { name: 'George Mac' }
      ]

      expect(Utils.orderBy(collection, ['id', 'name'], ['asc', 'desc'])).toEqual(expected)
    })

    it('can order collection with function', () => {
      const collection = [
        { id: 2 },
        { id: 3 },
        { id: 1 }
      ]

      const expected = [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ]

      expect(Utils.orderBy(collection, [v => v.id], ['asc'])).toEqual(expected)
    })
  })

  describe('#cloneDeep', () => {
    it('should clone arrays', async () => {
      const a = [{ a: 0 }, { b: 1 }]

      expect(Utils.cloneDeep(a)).toEqual(a)

      const b = [1, 2, 3]

      expect(b).toEqual(b)

      const c = [{ a: 0 }, { b: 1 }]
      const d = Utils.cloneDeep(c)

      expect(d).toEqual(c)
      expect(d[0]).toEqual(c[0])

      const e = [0, 'a', {}, [{}]]

      expect(Utils.cloneDeep(e)).toEqual(e)
    })

    it('should deeply clone an array', async () => {
      const a = [[{ a: 'b' }], [{ a: 'b' }]]
      const b = Utils.cloneDeep(a)

      expect(b).not.toBe(a)
      expect(b[0]).not.toBe(a[0])
      expect(b[1]).not.toBe(a[1])
      expect(b).toEqual(a)
    })

    it('should deeply clone arrays by reference', async () => {
      const a: any = { a: 'b' }
      const b = [a]
      const c = Utils.cloneDeep(b)

      a.c = 'd'

      expect(c).not.toEqual(b)
    })

    it('should clone objects', () => {
      const a = { a: 1, b: 2, c: 3 }

      expect(Utils.cloneDeep(a)).toEqual(a)
      expect(Utils.cloneDeep(a)).not.toBe(a)
    })

    it('should deeply clone objects', async () => {
      const a = {
        a: { a: 1, b: 2, c: 3 },
        b: { a: 1, b: 2, c: 3 },
        c: { a: 1, b: 2, c: 3 }
      }

      expect(Utils.cloneDeep(a)).toEqual(a)
      expect(Utils.cloneDeep(a)).not.toBe(a)
      expect(Utils.cloneDeep(a).a).toEqual(a.a)
      expect(Utils.cloneDeep(a).a).not.toBe(a.a)
      expect(Utils.cloneDeep(a).b).toEqual(a.b)
      expect(Utils.cloneDeep(a).b).not.toBe(a.b)
      expect(Utils.cloneDeep(a).c).toEqual(a.c)
      expect(Utils.cloneDeep(a).c).not.toBe(a.c)
    })

    it('should deeply clone objects by reference', async () => {
      const a: Record<string, any> = { a: 'b' }
      const b = Utils.cloneDeep(a)

      b.c = 'd'

      expect(b).not.toEqual(a)
    })

    it('should return primitives', async () => {
      expect(Utils.cloneDeep<any>('foo')).toEqual('foo')
      expect(Utils.cloneDeep<any>(0)).toEqual(0)
    })
  })
})
