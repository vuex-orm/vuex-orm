export default class Http {
    static defaultOptions: RequestInit;
    static request<T>(url: string, _query: {}, _method: string, _body?: {}, _headers?: {}, options?: {}): Promise<T>;
    static get<T>(url: string, params?: {}, headers?: {}, options?: {}): Promise<T>;
    static post<T>(url: string, payload?: {}, headers?: {}, options?: {}): Promise<T>;
    static put<T>(url: string, payload?: {}, headers?: {}, options?: {}): Promise<T>;
    static delete<T>(url: string, payload?: {}, headers?: {}, options?: {}): Promise<T>;
}
