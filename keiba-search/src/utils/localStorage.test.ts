import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  loadPredictions,
  savePrediction,
  getPrediction,
  deletePrediction,
  clearAllPredictions,
} from './localStorage';
import type { PredictionMark } from '../types';

// LocalStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

// 予想印のArbitrary
const predictionMarkArb: fc.Arbitrary<PredictionMark> = fc.constantFrom(
  '◎', '○', '▲', '△', '×'
);

// レースIDのArbitrary（実際のフォーマットに近い形式）
const raceIdArb = fc.stringMatching(/^[a-zA-Z0-9]{8,16}$/);

// 馬番のArbitrary（1〜18）
const horseNumberArb = fc.integer({ min: 1, max: 18 });

describe('LocalStorage Utility', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  /**
   * Property 11: 予想印のラウンドトリップ保存
   * Feature: keiba-search, Property 11: 予想印のラウンドトリップ保存
   * Validates: Requirements 5.3, 5.4
   * 
   * *For any* 予想印データが入力された場合、LocalStorageに保存し、
   * 再読み込み時に同じ予想印が復元される
   */
  it('Property 11: 予想印のラウンドトリップ保存 - 保存した予想印は再読み込み時に復元される', () => {
    fc.assert(
      fc.property(
        raceIdArb,
        horseNumberArb,
        predictionMarkArb,
        (raceId, horseNumber, mark) => {
          // 保存
          savePrediction(raceId, horseNumber, mark);
          
          // 読み込み
          const loadedMark = getPrediction(raceId, horseNumber);
          
          // 同じ値が復元されることを確認
          return loadedMark === mark;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 11: 複数の予想印を保存しても各予想印が正しく復元される', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.tuple(raceIdArb, horseNumberArb, predictionMarkArb),
          { minLength: 1, maxLength: 20 }
        ),
        (predictions) => {
          // 全ての予想印を保存
          for (const [raceId, horseNumber, mark] of predictions) {
            savePrediction(raceId, horseNumber, mark);
          }
          
          // 最後に保存された値が正しく読み込めることを確認
          // （同じraceId+horseNumberの組み合わせは上書きされる）
          const lastPredictions = new Map<string, PredictionMark>();
          for (const [raceId, horseNumber, mark] of predictions) {
            lastPredictions.set(`${raceId}-${horseNumber}`, mark);
          }
          
          for (const [key, expectedMark] of lastPredictions) {
            const [raceId, horseNumber] = key.split('-');
            const loadedMark = getPrediction(raceId, parseInt(horseNumber, 10));
            if (loadedMark !== expectedMark) {
              return false;
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('削除した予想印はnullとして読み込まれる', () => {
    fc.assert(
      fc.property(
        raceIdArb,
        horseNumberArb,
        predictionMarkArb,
        (raceId, horseNumber, mark) => {
          // 保存
          savePrediction(raceId, horseNumber, mark);
          
          // 削除
          deletePrediction(raceId, horseNumber);
          
          // 読み込み
          const loadedMark = getPrediction(raceId, horseNumber);
          
          // nullが返されることを確認
          return loadedMark === null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('clearAllPredictionsで全ての予想印が削除される', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.tuple(raceIdArb, horseNumberArb, predictionMarkArb),
          { minLength: 1, maxLength: 10 }
        ),
        (predictions) => {
          // 全ての予想印を保存
          for (const [raceId, horseNumber, mark] of predictions) {
            savePrediction(raceId, horseNumber, mark);
          }
          
          // 全削除
          clearAllPredictions();
          
          // 全ての予想印がnullになっていることを確認
          const loaded = loadPredictions();
          return Object.keys(loaded).length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});
