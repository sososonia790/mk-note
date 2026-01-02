import { useState, useCallback, useEffect } from 'react';
import type { PredictionMark } from '../types';
import {
  getRacePredictions,
  savePrediction,
  deletePrediction,
} from '../utils/localStorage';

interface UsePredictionResult {
  predictions: Record<number, PredictionMark>;
  setPrediction: (horseNumber: number, mark: PredictionMark) => void;
  removePrediction: (horseNumber: number) => void;
  getPrediction: (horseNumber: number) => PredictionMark;
}

/**
 * 予想印の状態管理とLocalStorage連携を行うカスタムフック
 * @param raceId レースID
 */
export const usePrediction = (raceId: string): UsePredictionResult => {
  const [predictions, setPredictions] = useState<Record<number, PredictionMark>>({});

  // 初期読み込み
  useEffect(() => {
    const stored = getRacePredictions(raceId);
    setPredictions(stored);
  }, [raceId]);

  // 予想印を設定
  const setPrediction = useCallback(
    (horseNumber: number, mark: PredictionMark) => {
      savePrediction(raceId, horseNumber, mark);
      setPredictions((prev) => {
        if (mark === null) {
          const { [horseNumber]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [horseNumber]: mark };
      });
    },
    [raceId]
  );

  // 予想印を削除
  const removePrediction = useCallback(
    (horseNumber: number) => {
      deletePrediction(raceId, horseNumber);
      setPredictions((prev) => {
        const { [horseNumber]: _, ...rest } = prev;
        return rest;
      });
    },
    [raceId]
  );

  // 特定の馬の予想印を取得
  const getPrediction = useCallback(
    (horseNumber: number): PredictionMark => {
      return predictions[horseNumber] ?? null;
    },
    [predictions]
  );

  return {
    predictions,
    setPrediction,
    removePrediction,
    getPrediction,
  };
};
