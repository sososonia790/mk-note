/**
 * useTraining フック
 * 調教データ取得ロジック
 * Requirements: 3.1, 3.4
 */

import { useState, useEffect, useCallback } from 'react';
import type { TrainingData } from '../types';
import type { TrainingResponse } from '../api/training';
import { getMockTrainingByHorseId, getMockTrainingByRaceId } from '../api/mockApi';

interface UseTrainingByHorseResult {
  data: TrainingResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseTrainingByRaceResult {
  data: TrainingData[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * 指定馬の調教データを取得するフック
 * @param horseId - 馬ID
 */
export function useTrainingByHorse(horseId: string): UseTrainingByHorseResult {
  const [data, setData] = useState<TrainingResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTraining = useCallback(async () => {
    if (!horseId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // モックAPIを使用（本番環境では getTrainingByHorseId を使用）
      const response = await getMockTrainingByHorseId(horseId);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('調教データの取得に失敗しました'));
    } finally {
      setIsLoading(false);
    }
  }, [horseId]);

  useEffect(() => {
    fetchTraining();
  }, [fetchTraining]);

  const refetch = useCallback(() => {
    fetchTraining();
  }, [fetchTraining]);

  return { data, isLoading, error, refetch };
}

/**
 * 指定レースの全出走馬の調教データを取得するフック
 * @param raceId - レースID
 */
export function useTrainingByRace(raceId: string): UseTrainingByRaceResult {
  const [data, setData] = useState<TrainingData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTraining = useCallback(async () => {
    if (!raceId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // モックAPIを使用（本番環境では getTrainingByRaceId を使用）
      const response = await getMockTrainingByRaceId(raceId);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('調教データの取得に失敗しました'));
    } finally {
      setIsLoading(false);
    }
  }, [raceId]);

  useEffect(() => {
    fetchTraining();
  }, [fetchTraining]);

  const refetch = useCallback(() => {
    fetchTraining();
  }, [fetchTraining]);

  return { data, isLoading, error, refetch };
}
