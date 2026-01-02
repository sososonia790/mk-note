/**
 * useRaces フック
 * 開催データ取得ロジック
 * Requirements: 1.1, 1.2
 */

import { useState, useEffect, useCallback } from 'react';
import type { RacesResponse } from '../api/races';
import { getMockRacesByDate } from '../api/mockApi';

interface UseRacesResult {
  data: RacesResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useRaces(date: string): UseRacesResult {
  const [data, setData] = useState<RacesResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // モックAPIを使用（本番環境では getRacesByDate を使用）
      const response = await getMockRacesByDate(date);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('開催情報の取得に失敗しました'));
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchRaces();
  }, [fetchRaces]);

  const refetch = useCallback(() => {
    fetchRaces();
  }, [fetchRaces]);

  return { data, isLoading, error, refetch };
}
