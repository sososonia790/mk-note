/**
 * 開催・レース関連API
 * Requirements: 1.1, 1.2, 2.4
 */

import { apiClient } from './client';
import type { Race, Racecourse } from '../types';

// 開催一覧レスポンス型
export interface RacesResponse {
  date: string;
  racecourses: {
    racecourse: Racecourse;
    races: Race[];
  }[];
}

/**
 * 指定日の開催一覧を取得
 * @param date - 日付 (YYYY-MM-DD)
 */
export async function getRacesByDate(date: string): Promise<RacesResponse> {
  const response = await apiClient.get<RacesResponse>(`/races?date=${date}`);
  return response.data;
}

/**
 * レース詳細を取得
 * @param raceId - レースID
 */
export async function getRaceById(raceId: string): Promise<Race> {
  const response = await apiClient.get<Race>(`/races/${raceId}`);
  return response.data;
}
