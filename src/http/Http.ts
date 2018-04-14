export default class Http {
  // Default options are marked with *
  public static defaultOptions = {
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // *manual, follow, error
    referrer: 'no-referrer' // *client, no-referrer
  }

  public static request (url: string, _query: {}, _method: string, _body = null, _headers = {}, options = {}) {
    const _options = { ...this.defaultOptions, ...options }
    return fetch(url, _options as RequestInit)
    .then(response => response.json()) // parses response to JSON
  }

  public static get (url: string, params = {}, headers = {}, options = {}) {
    return this.request(url, params, 'GET', null, headers, options)
  }

  public static post (url: string, payload = null, headers = {}, options = {}) {
    return this.request(url, {}, 'POST', payload, headers, options)
  }
}
