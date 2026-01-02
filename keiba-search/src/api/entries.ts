/**
 * 出馬表関連API
 * Requirements: 2.1, 2.4
 */

import { apiClient } from './client';
import type { Entry } from '../types';

// 出馬表レスポンス型
export interface EntriesResponse {
  raceId: string;
  entries: Entry[];
}

/**
 * 指定レースの出馬表を取得
 * @param raceId - レースID
 */
export async function getEntriesByRaceId(raceId: string): Promise<EntriesResponse> {
  const response = await apiClient.get<EntriesResponse>(`/races/${raceId}/entries`);
  return response.data;
}
