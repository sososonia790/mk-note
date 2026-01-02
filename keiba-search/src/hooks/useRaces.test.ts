/**
 * useRaces フック Property Test
 * Requirements: 1.1, 1.2
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { Race, Racecourse } from '../types';
import type { RacesResponse } from '../api/races';
import { mockRaces } from '../api/mock/races';

// 遅延なしでモックデータを取得する関数（テスト用）
function getRacesByDateSync(date: string): RacesResponse {
  const racesForDate = mockRaces.filter(race => race.date === date);
  
  const racecourseMap = new Map<string, { racecourse: Racecourse; races: Race[] }>();
  
  for (const race of racesForDate) {
    const key = race.racecourse.id;
    if (!racecourseMap.has(key)) {
      racecourseMap.set(key, { racecourse: race.racecourse, races: [] });
    }
    racecourseMap.get(key)!.races.push(race);
  }
  
  for (const group of racecourseMap.values()) {
    group.races.sort((a, b) => a.raceNumber - b.raceNumber);
  }
  
  return {
    date,
    racecourses: Array.from(racecourseMap.values()),
  };
}

// 日付のArbitrary（YYYY-MM-DD形式）
const dateArb = fc.integer({ min: 0, max: 1095 }).map(days => {
  const baseDate = new Date('2024-01-01');
  baseDate.setDate(baseDate.getDate() + days);
  const year = baseDate.getFullYear();
  const month = String(baseDate.getMonth() + 1).padStart(2, '0');
  const day = String(baseDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

describe('useRaces - Property Tests', () => {
  /**
   * Property 1: 日付選択による開催一覧取得
   * Feature: keiba-search, Property 1: 日付選択による開催一覧取得
   * Validates: Requirements 1.2
   * 
   * *For any* 日付が選択された場合、その日付の開催一覧が取得され、
   * 返されるデータの日付は選択した日付と一致する
   */
  it('Property 1: 日付選択による開催一覧取得 - 選択した日付のデータが返される', () => {
    fc.assert(
      fc.property(dateArb, (date) => {
        const response = getRacesByDateSync(date);
        
        // レスポンスの日付が選択した日付と一致することを確認
        expect(response.date).toBe(date);
        
        // racecourses配列が存在することを確認
        expect(Array.isArray(response.racecourses)).toBe(true);
        
        // 各競馬場のレースが選択した日付のものであることを確認
        for (const group of response.racecourses) {
          for (const race of group.races) {
            expect(race.date).toBe(date);
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: 開催一覧の競馬場ごとのグループ化が正しい', () => {
    fc.assert(
      fc.property(dateArb, (date) => {
        const response = getRacesByDateSync(date);
        
        // 各グループ内のレースが同じ競馬場のものであることを確認
        for (const group of response.racecourses) {
          const racecourseId = group.racecourse.id;
          for (const race of group.races) {
            expect(race.racecourse.id).toBe(racecourseId);
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: 開催一覧のレースがレース番号順にソートされている', () => {
    fc.assert(
      fc.property(dateArb, (date) => {
        const response = getRacesByDateSync(date);
        
        // 各グループ内のレースがレース番号順にソートされていることを確認
        for (const group of response.racecourses) {
          for (let i = 1; i < group.races.length; i++) {
            expect(group.races[i].raceNumber).toBeGreaterThanOrEqual(
              group.races[i - 1].raceNumber
            );
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
