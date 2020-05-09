import axios from 'axios';

class Api {
  constructor(
    public base: string,
  ) {

  }

  async query<T = any>(endpoint: string, conditions: any, limit?: number, skip?: number): Promise<{ data: T, headers: any }> {
    try {
      const body: any = {
        conditions,
      };
      if (limit) body.limit = limit;
      if (skip) body.skip = skip;
      const { data, headers } = await axios.post<T>(
        `${this.base}${endpoint}${endpoint.slice(-1, 1) === '/' ? 'query' : '/query'}`,
        body,
        { headers: this.getHeaders() });
      return { data, headers };
    } catch (error) {
      return error.response;
    }
  }

  async get<T = any>(endpoint: string, query = {}): Promise<{ data: T, headers: any }> {
    try {
      const { data, headers } = await axios.get<T>(`${this.base}${endpoint}`, {
        headers: this.getHeaders(),
        params: { ...query }
      });
      return { data, headers };
    } catch (error) {
      return error.response;
    }
  }

  async post<T = any>(endpoint: string, body: object, extendHeaders = {}) {
    try {
      const response = await axios.post<T>(`${this.base}${endpoint}`, body, {
        headers: this.getHeaders(extendHeaders)
      });

      const { headers, data } = response;
      return { data, headers };
    } catch (error) {
      return error.response;
    }
  }

  async put<T = any>(endpoint: string, body: object, ) {
    try {
      const {
        headers,
        data
      } = await axios.put<T>(`${this.base}${endpoint}`, body, {
        headers: this.getHeaders()
      });
      return { data, headers };
    } catch (error) {
      return error.response;
    }
  }

  async delete<T = any>(body: object, endpoint: string) {
    try {
      const {
        headers,
        data
      } = await axios.delete<T>(`${this.base}${endpoint}`, {
        data: body,
        headers: this.getHeaders()
      });
      return { data, headers };
    } catch (error) {
      return error.response;
    }
  }


  private getHeaders(customHeaders: any = {}) {
    const headers: { [key: string]: string } = {
      Accept: 'appliaction/json',
    };

    Object.keys(customHeaders).forEach(key => {
      headers[key] = customHeaders[key];
    });

    return headers;
  }
}

export default new Api(process.env.NODE_ENV === 'production'
  ? 'http://germangorodnev.com:5300/client/api/v1/'
  : 'http://localhost:5300/client/api/v1/');