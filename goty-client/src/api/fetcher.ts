import { baseUrlService } from './baseUrlService'

const APPLICATION_JSON = 'application/json'

enum HttpMethod {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
}

export interface FetchConfig {
  params?: URLSearchParams
  init?: RequestInit
}

class Fetcher {
  private readonly baseUrl: string
  private readonly headers: Headers

  constructor(baseUrl: string, headers: Headers) {
    this.baseUrl = baseUrl
    this.headers = headers
  }

  get<T = any>(url: string, config?: FetchConfig): Promise<T> {
    return this.fetch(HttpMethod.GET, url, config?.params, config?.init)
  }

  post<T = any, U = any>(
    url: string,
    payload: T,
    config?: FetchConfig,
  ): Promise<U> {
    return this.fetch(HttpMethod.POST, url, config?.params, {
      ...config?.init,
      body: JSON.stringify(payload),
    })
  }

  put<T = any, U = any>(
    url: string,
    payload: T,
    config?: FetchConfig,
  ): Promise<U> {
    return this.fetch(HttpMethod.PUT, url, config?.params, {
      ...config?.init,
      body: JSON.stringify(payload),
    })
  }

  private fetch<T = any>(
    method: HttpMethod,
    url: string,
    params?: URLSearchParams,
    init?: RequestInit,
  ): Promise<T> {
    return fetch(
      `${this.baseUrl}${url}${params ? `?${params.toString()}` : ''}`,
      this.buildInit(method, init),
    ).then((res) => {
      if (!res.ok) {
        throw new Error('Not 2xx response', { cause: res })
      } else {
        return res.json()
      }
    })
  }

  private buildInit(method: HttpMethod, init?: RequestInit) {
    return {
      ...init,
      headers: this.headers,
      method,
    }
  }
}

const createInstance = async (): Promise<Fetcher> => {
  const configUrl = await baseUrlService.getBaseUrl()
  const headers: Headers = new Headers({
    Accept: APPLICATION_JSON,
    'Content-Type': APPLICATION_JSON,
  })
  const baseUrl = configUrl ?? 'http://localhost:8080'

  return new Fetcher(baseUrl, headers)
}

const fetcher = await createInstance()

export default fetcher
