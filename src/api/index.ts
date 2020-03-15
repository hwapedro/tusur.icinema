import axios from 'axios';

class Api {
  constructor(
    public base: string,
  ) {

  }

  async get(endpoint: string, query = {}) {
    try {
      const { data, headers } = await axios.get(`${this.base}${endpoint}`, {
        headers: this.getHeaders(),
        params: { ...query }
      });
      return { data, headers };
    } catch (error) {
      return error.response;
    }
  }

  async post(body: object, endpoint: string, extendHeaders = {}) {
    try {
      const response = await axios.post(`${this.base}${endpoint}`, body, {
        headers: this.getHeaders(extendHeaders)
      });

      const { headers, data } = response;
      return { data, headers };
    } catch (error) {
      return error.response;
    }
  }

  async put(body: object, endpoint: string) {
    try {
      const {
        headers,
        data: { data }
      } = await axios.put(`${this.base}${endpoint}`, body, {
        headers: this.getHeaders()
      });
      return { data, headers };
    } catch (error) {
      return error.response;
    }
  }

  async delete(body: object, endpoint: string) {
    try {
      const {
        headers,
        data: { data }
      } = await axios.delete(`${this.base}${endpoint}`, {
        data: body,
        headers: this.getHeaders()
      });
      return { data, headers };
    } catch (error) {
      return error.response;
    }
  }


  private getHeaders(customHeaders?: any) {
    const headers: { [key: string]: string } = {
      Accept: 'appliaction/json',
    };

    Object.keys(customHeaders).forEach(key => {
      headers[key] = customHeaders[key];
    });

    return headers;
  }
}

export default new Api('http://localhost:5300/api/v1/');