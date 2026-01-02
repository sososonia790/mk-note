/**
 * APIクライアント - fetch wrapper with error handling
 * Requirements: 2.4, 7.1, 7.2
 */

// APIエラークラス
export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
  }
}

// ネットワークエラークラス
export class NetworkError extends Error {
  constructor(message: string = 'ネットワークエラーが発生しました') {
    super(message);
    this.name = 'NetworkError';
  }
}

// APIレスポンス型
export interface ApiResponse<T> {
  data: T;
  status: number;
}

// fetch wrapper with error handling
async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `APIエラー: ${response.status} ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new NetworkError();
    }
    throw error;
  }
}

// ベースURL（環境変数から取得、デフォルトはモックAPI）
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// APIクライアント
export const apiClient = {
  get: <T>(endpoint: string) => 
    fetchWithErrorHandling<T>(`${BASE_URL}${endpoint}`),
  
  post: <T>(endpoint: string, body: unknown) =>
    fetchWithErrorHandling<T>(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
