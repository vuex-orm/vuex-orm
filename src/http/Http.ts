export default class Http {
  // Default options are marked with *
  public static defaultOptions: RequestInit = {
    method: '',
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

  public static request <T> (
    url: string,
    _query: {},
    _method: string,
    _body = {},
    _headers = {},
    options = {}
  ): Promise<T> {

    const _options = { ...this.defaultOptions, ...options }
    _options.method = _method
    if (Object.keys(_body).length) {
      _options.body = JSON.stringify(_body)
    }
    return fetch(url, _options as RequestInit)
      .then(response => {
        if (!response.ok) {
          return Promise.reject(new Error('http request failed'))
        } else {
          return Promise.resolve(response.json())
        }
      }) // parses response to JSON
  }

  public static get <T> (url: string, params = {}, headers = {}, options = {}): Promise<T> {
    return this.request<T>(url, params, 'GET', {}, headers, options)
  }

  public static post <T> (url: string, payload = {}, headers = {}, options = {}): Promise<T> {
    return this.request<T>(url, {}, 'POST', payload, headers, options)
  }

  public static put <T> (url: string, payload = {}, headers = {}, options = {}): Promise<T> {
    return this.request<T>(url, {}, 'PUT', payload, headers, options)
  }

  public static delete <T> (url: string, payload = {}, headers = {}, options = {}): Promise<T> {
    return this.request<T>(url, {}, 'DELETE', payload, headers, options)
  }
}
