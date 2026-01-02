import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as fc from 'fast-check';
import { usePrediction } from './usePrediction';
import type { PredictionMark } from '../types';
import { clearAllPredictions } from '../utils/localStorage';

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
const predictionMarkArb: fc.Arbitrary<Exclude<PredictionMark, null>> = fc.constantFrom(
  '◎', '○', '▲', '△', '×'
);

// レースIDのArbitrary（race_プレフィックスで予約語を回避）
const raceIdArb = fc.stringMatching(/^race_[a-zA-Z0-9]{8,12}$/);

// 馬番のArbitrary（1〜18）
const horseNumberArb = fc.integer({ min: 1, max: 18 });

describe('usePrediction Hook', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  /**
   * Property 12: 予想印の削除
   * Feature: keiba-search, Property 12: 予想印の削除
   * Validates: Requirements 5.5
   * 
   * *For any* 予想印が設定された後に削除された場合、
   * その予想印はnullとして取得される
   */
  it('Property 12: 予想印の削除 - 削除後はnullが返される', () => {
    fc.assert(
      fc.property(
        raceIdArb,
        horseNumberArb,
        predictionMarkArb,
        (raceId, horseNumber, mark) => {
          const { result, unmount } = renderHook(() => usePrediction(raceId));
          
          // 予想印を設定
          act(() => {
            result.current.setPrediction(horseNumber, mark);
          });
          
          // 設定されていることを確認
          const setMark = result.current.getPrediction(horseNumber);
          if (setMark !== mark) {
            unmount();
            return false;
          }
          
          // 予想印を削除
          act(() => {
            result.current.removePrediction(horseNumber);
          });
          
          // 削除後はnullが返されることを確認
          const deletedMark = result.current.getPrediction(horseNumber);
          
          unmount();
          
          return deletedMark === null;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 12: 削除後はpredictionsオブジェクトから除外される', () => {
    fc.assert(
      fc.property(
        raceIdArb,
        horseNumberArb,
        predictionMarkArb,
        (raceId, horseNumber, mark) => {
          const { result, unmount } = renderHook(() => usePrediction(raceId));
          
          // 予想印を設定
          act(() => {
            result.current.setPrediction(horseNumber, mark);
          });
          
          // predictionsに含まれていることを確認
          if (!(horseNumber in result.current.predictions)) {
            unmount();
            return false;
          }
          
          // 予想印を削除
          act(() => {
            result.current.removePrediction(horseNumber);
          });
          
          // predictionsから除外されていることを確認
          const isRemoved = !(horseNumber in result.current.predictions);
          
          unmount();
          
          return isRemoved;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 12: 他の馬の予想印は削除の影響を受けない', () => {
    fc.assert(
      fc.property(
        raceIdArb,
        fc.integer({ min: 1, max: 9 }),
        fc.integer({ min: 10, max: 18 }),
        predictionMarkArb,
        predictionMarkArb,
        (raceId, horseNumber1, horseNumber2, mark1, mark2) => {
          const { result, unmount } = renderHook(() => usePrediction(raceId));
          
          // 2頭分の予想印を設定
          act(() => {
            result.current.setPrediction(horseNumber1, mark1);
            result.current.setPrediction(horseNumber2, mark2);
          });
          
          // 1頭目の予想印を削除
          act(() => {
            result.current.removePrediction(horseNumber1);
          });
          
          // 2頭目の予想印は影響を受けないことを確認
          const remainingMark = result.current.getPrediction(horseNumber2);
          
          unmount();
          
          return remainingMark === mark2;
        }
      ),
      { numRuns: 100 }
    );
  });
});
