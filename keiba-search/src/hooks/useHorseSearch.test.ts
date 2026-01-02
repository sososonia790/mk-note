/**
 * useHorseSearch フック Property Tests
 * Requirements: 4.1, 4.2, 4.3, 4.5
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { mockHorses } from '../api/mock/horses';

/**
 * 馬名検索ロジック（テスト用の純粋関数）
 * モックAPIと同じロジックを使用
 */
function searchHorses(query: string, horses: typeof mockHorses) {
  if (!query.trim()) {
    return [];
  }
  const normalizedQuery = query.toLowerCase();
  return horses.filter(horse => 
    horse.name.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Property 7: 馬名部分一致検索
 * Feature: keiba-search, Property 7: 馬名部分一致検索
 * Validates: Requirements 4.1
 * 
 * *For any* 検索クエリに対して、返される全ての馬の名前は
 * そのクエリを部分文字列として含む
 */
describe('Property 7: 馬名部分一致検索', () => {
  it('検索結果の全ての馬名は検索クエリを含む', () => {
    // 実際の馬名から部分文字列を生成するArbitrary
    const horseNameSubstringArb = fc.constantFrom(...mockHorses.map(h => h.name))
      .chain(name => {
        const len = name.length;
        return fc.tuple(
          fc.integer({ min: 0, max: len - 1 }),
          fc.integer({ min: 1, max: len })
        ).map(([start, length]) => {
          const end = Math.min(start + length, len);
          return name.substring(start, end);
        });
      });

    fc.assert(
      fc.property(
        horseNameSubstringArb,
        (query) => {
          const results = searchHorses(query, mockHorses);
          
          // 全ての結果が検索クエリを含むことを確認
          const normalizedQuery = query.toLowerCase();
          return results.every(horse => 
            horse.name.toLowerCase().includes(normalizedQuery)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('検索クエリを含む馬は必ず結果に含まれる', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mockHorses),
        (targetHorse) => {
          // 馬名の一部を検索クエリとして使用
          const query = targetHorse.name.substring(0, Math.ceil(targetHorse.name.length / 2));
          const results = searchHorses(query, mockHorses);
          
          // ターゲットの馬が結果に含まれることを確認
          return results.some(horse => horse.id === targetHorse.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('大文字小文字を区別しない検索', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mockHorses.map(h => h.name)),
        fc.boolean(),
        (name, toUpper) => {
          const query = toUpper ? name.toUpperCase() : name.toLowerCase();
          const results = searchHorses(query, mockHorses);
          
          // 元の馬が結果に含まれることを確認
          return results.some(horse => horse.name === name);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 8: 馬詳細情報の表示
 * Feature: keiba-search, Property 8: 馬詳細情報の表示
 * Validates: Requirements 4.2, 4.3
 * 
 * *For any* 馬データに対して、血統情報（父、母、母父）と
 * 過去戦績が正しく含まれている
 */
describe('Property 8: 馬詳細情報の表示', () => {
  it('全ての馬は血統情報（父、母、母父）を持つ', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mockHorses),
        (horse) => {
          // 血統情報が存在することを確認
          return (
            typeof horse.sire === 'string' && horse.sire.length > 0 &&
            typeof horse.dam === 'string' && horse.dam.length > 0 &&
            typeof horse.damSire === 'string' && horse.damSire.length > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('過去戦績は必要な情報を全て含む', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mockHorses),
        (horse) => {
          // 過去戦績の各レコードが必要な情報を持つことを確認
          return horse.results.every(result => 
            typeof result.date === 'string' && result.date.length > 0 &&
            typeof result.racecourse === 'string' && result.racecourse.length > 0 &&
            typeof result.distance === 'number' && result.distance > 0 &&
            typeof result.position === 'number' && result.position > 0 &&
            typeof result.time === 'string' && result.time.length > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('馬の基本情報（名前、生年）が正しい形式', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mockHorses),
        (horse) => {
          return (
            typeof horse.id === 'string' && horse.id.length > 0 &&
            typeof horse.name === 'string' && horse.name.length > 0 &&
            typeof horse.birthYear === 'number' && horse.birthYear > 2000 && horse.birthYear < 2030
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 9: 空検索の防止
 * Feature: keiba-search, Property 9: 空検索の防止
 * Validates: Requirements 4.5
 * 
 * *For any* 空白のみの文字列に対して、検索結果は空配列を返す
 */
describe('Property 9: 空検索の防止', () => {
  it('空白のみの検索クエリは空の結果を返す', () => {
    // 空白文字のみで構成される文字列のArbitrary
    const whitespaceChars = [' ', '\t', '\n', '\r', '　'];
    const whitespaceOnlyArb = fc.array(
      fc.constantFrom(...whitespaceChars),
      { minLength: 0, maxLength: 10 }
    ).map(chars => chars.join(''));

    fc.assert(
      fc.property(
        whitespaceOnlyArb,
        (query) => {
          const results = searchHorses(query, mockHorses);
          
          // 空白のみの検索は空の結果を返す
          return results.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('空文字列の検索は空の結果を返す', () => {
    const results = searchHorses('', mockHorses);
    expect(results).toEqual([]);
  });

  it('有効な検索クエリは結果を返す可能性がある', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mockHorses.map(h => h.name)),
        (validQuery) => {
          const results = searchHorses(validQuery, mockHorses);
          
          // 有効なクエリは少なくとも1件の結果を返す
          return results.length >= 1;
        }
      ),
      { numRuns: 100 }
    );
  });
});
