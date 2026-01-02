/**
 * 競走馬検索関連API
 * Requirements: 4.1, 4.2
 */

import { apiClient } from './client';
import type { Horse } from '../types';

// 馬検索レスポンス型
export interface HorseSearchResponse {
  horses: Horse[];
  total: number;
}

/**
 * 馬名で検索（部分一致）
 * @param query - 検索クエリ
 */
export async function searchHorses(query: string): Promise<HorseSearchResponse> {
  const response = await apiClient.get<HorseSearchResponse>(
    `/horses/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
}

/**
 * 馬詳細を取得
 * @param horseId - 馬ID
 */
export async function getHorseById(horseId: string): Promise<Horse> {
  const response = await apiClient.get<Horse>(`/horses/${horseId}`);
  return response.data;
}
