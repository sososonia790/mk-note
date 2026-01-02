import type { PredictionMark, StoredPredictions } from '../types';

const PREDICTION_KEY = 'keiba_predictions';

/**
 * LocalStorageから全ての予想印データを読み込む
 */
export const loadPredictions = (): StoredPredictions => {
  try {
    const data = localStorage.getItem(PREDICTION_KEY);
    if (!data) {
      return {};
    }
    return JSON.parse(data) as StoredPredictions;
  } catch {
    return {};
  }
};

/**
 * 特定のレースの予想印を取得する
 */
export const getPrediction = (
  raceId: string,
  horseNumber: number
): PredictionMark => {
  const predictions = loadPredictions();
  return predictions[raceId]?.[horseNumber] ?? null;
};

/**
 * 特定のレースの全予想印を取得する
 */
export const getRacePredictions = (
  raceId: string
): Record<number, PredictionMark> => {
  const predictions = loadPredictions();
  return predictions[raceId] ?? {};
};

/**
 * 予想印を保存する
 */
export const savePrediction = (
  raceId: string,
  horseNumber: number,
  mark: PredictionMark
): void => {
  const predictions = loadPredictions();
  
  if (!predictions[raceId]) {
    predictions[raceId] = {};
  }
  
  if (mark === null) {
    delete predictions[raceId][horseNumber];
    // レースに予想印がなくなったら、レースエントリも削除
    if (Object.keys(predictions[raceId]).length === 0) {
      delete predictions[raceId];
    }
  } else {
    predictions[raceId][horseNumber] = mark;
  }
  
  localStorage.setItem(PREDICTION_KEY, JSON.stringify(predictions));
};

/**
 * 特定の馬の予想印を削除する
 */
export const deletePrediction = (
  raceId: string,
  horseNumber: number
): void => {
  savePrediction(raceId, horseNumber, null);
};

/**
 * 特定のレースの全予想印を削除する
 */
export const deleteRacePredictions = (raceId: string): void => {
  const predictions = loadPredictions();
  delete predictions[raceId];
  localStorage.setItem(PREDICTION_KEY, JSON.stringify(predictions));
};

/**
 * 全ての予想印を削除する
 */
export const clearAllPredictions = (): void => {
  localStorage.removeItem(PREDICTION_KEY);
};
