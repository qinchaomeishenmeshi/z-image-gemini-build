export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export class ApiClient {
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Request failed with status ${response.status}: ${errorBody}`);
    }

    try {
      return await response.json() as T;
    } catch (error) {
      throw new Error('Failed to parse response JSON');
    }
  }

  public static async post<T>(url: string, body: any, options: RequestOptions = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API Request Failed (${url}):`, error);
      throw error;
    }
  }
}
