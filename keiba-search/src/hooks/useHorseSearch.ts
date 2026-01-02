/**
 * useHorseSearch フック
 * 馬名検索ロジック（部分一致）
 * Requirements: 4.1, 4.5
 */

import { useState, useCallback } from 'react';
import type { Horse } from '../types';
import { getMockSearchHorses, getMockHorseById } from '../api/mockApi';

interface UseHorseSearchResult {
  /** 検索結果の馬リスト */
  horses: Horse[];
  /** 選択された馬の詳細 */
  selectedHorse: Horse | null;
  /** 検索中かどうか */
  isLoading: boolean;
  /** 詳細取得中かどうか */
  isLoadingDetail: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 検索実行 */
  search: (query: string) => Promise<void>;
  /** 馬詳細を取得 */
  selectHorse: (horseId: string) => Promise<void>;
  /** 選択をクリア */
  clearSelection: () => void;
  /** 検索結果をクリア */
  clearSearch: () => void;
}

export function useHorseSearch(): UseHorseSearchResult {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [selectedHorse, setSelectedHorse] = useState<Horse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 馬名で検索（部分一致）
   * Requirements: 4.1, 4.5
   */
  const search = useCallback(async (query: string): Promise<void> => {
    // 空検索を防止 (Requirements: 4.5)
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError('検索キーワードを入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedHorse(null);

    try {
      // モックAPIを使用（本番環境では searchHorses を使用）
      const response = await getMockSearchHorses(trimmedQuery);
      setHorses(response.horses);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '検索に失敗しました'
      );
      setHorses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 馬詳細を取得
   * Requirements: 4.2
   */
  const selectHorse = useCallback(async (horseId: string): Promise<void> => {
    setIsLoadingDetail(true);
    setError(null);

    try {
      // モックAPIを使用（本番環境では getHorseById を使用）
      const horse = await getMockHorseById(horseId);
      if (horse) {
        setSelectedHorse(horse);
      } else {
        setError('馬の情報が見つかりませんでした');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '馬の情報の取得に失敗しました'
      );
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  /**
   * 選択をクリア
   */
  const clearSelection = useCallback(() => {
    setSelectedHorse(null);
  }, []);

  /**
   * 検索結果をクリア
   */
  const clearSearch = useCallback(() => {
    setHorses([]);
    setSelectedHorse(null);
    setError(null);
  }, []);

  return {
    horses,
    selectedHorse,
    isLoading,
    isLoadingDetail,
    error,
    search,
    selectHorse,
    clearSelection,
    clearSearch,
  };
}
