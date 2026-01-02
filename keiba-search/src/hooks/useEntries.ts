/**
 * useEntries フック
 * 出馬表データ取得ロジック
 * Requirements: 2.1, 2.4
 */

import { useState, useEffect, useCallback } from 'react';
import type { EntriesResponse } from '../api/entries';
import { getMockEntriesByRaceId } from '../api/mockApi';

interface UseEntriesResult {
  data: EntriesResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useEntries(raceId: string): UseEntriesResult {
  const [data, setData] = useState<EntriesResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!raceId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // モックAPIを使用（本番環境では getEntriesByRaceId を使用）
      const response = await getMockEntriesByRaceId(raceId);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('出馬表の取得に失敗しました'));
    } finally {
      setIsLoading(false);
    }
  }, [raceId]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const refetch = useCallback(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { data, isLoading, error, refetch };
}
