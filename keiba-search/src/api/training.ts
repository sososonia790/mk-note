/**
 * 調教データ関連API
 * Requirements: 3.1, 3.4
 */

import { apiClient } from './client';
import type { TrainingData } from '../types';

// 調教データレスポンス型
export interface TrainingResponse {
  horseId: string;
  trainings: TrainingData[];
}

/**
 * 指定馬の調教データを取得
 * @param horseId - 馬ID
 */
export async function getTrainingByHorseId(horseId: string): Promise<TrainingResponse> {
  const response = await apiClient.get<TrainingResponse>(`/horses/${horseId}/training`);
  return response.data;
}

/**
 * 指定レースの全出走馬の調教データを取得
 * @param raceId - レースID
 */
export async function getTrainingByRaceId(raceId: string): Promise<TrainingData[]> {
  const response = await apiClient.get<TrainingData[]>(`/races/${raceId}/training`);
  return response.data;
}
