/**
 * EntryTable コンポーネントテスト
 * Property 3: 出馬表の必須情報表示
 * Validates: Requirements 2.1
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { EntryTable } from './EntryTable';
import type { Entry, PastResult } from '../../types';

// 日付文字列のArbitrary（YYYY-MM-DD形式）
const dateStringArb = fc.tuple(
  fc.integer({ min: 2020, max: 2025 }),
  fc.integer({ min: 1, max: 12 }),
  fc.integer({ min: 1, max: 28 })
).map(([year, month, day]) => 
  `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
);

// PastResultのArbitrary
const pastResultArb: fc.Arbitrary<PastResult> = fc.record({
  date: dateStringArb,
  racecourse: fc.constantFrom('東京', '中山', '阪神', '京都', '新潟', '札幌', '函館', '福島', '中京', '小倉'),
  distance: fc.constantFrom(1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2500, 3000, 3200),
  position: fc.integer({ min: 1, max: 18 }),
  time: fc.tuple(fc.integer({ min: 1, max: 3 }), fc.integer({ min: 0, max: 59 }), fc.integer({ min: 0, max: 9 }))
    .map(([min, sec, dec]) => `${min}:${sec.toString().padStart(2, '0')}.${dec}`),
});

// EntryのArbitrary
const entryArb: fc.Arbitrary<Entry> = fc.record({
  id: fc.uuid(),
  raceId: fc.uuid(),
  horseNumber: fc.integer({ min: 1, max: 18 }),
  horseName: fc.stringMatching(/^[ァ-ヶー]{2,9}$/),
  jockey: fc.stringMatching(/^[ァ-ヶー]{2,6}$/),
  weight: fc.constantFrom(49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59),
  horseWeight: fc.integer({ min: 400, max: 600 }),
  pastResults: fc.array(pastResultArb, { minLength: 0, maxLength: 5 }),
});

// 複数のEntryを生成（馬番が重複しないように）
const entriesArb: fc.Arbitrary<Entry[]> = fc.array(entryArb, { minLength: 1, maxLength: 18 })
  .map(entries => {
    // 馬番を1から順に割り当て
    return entries.map((entry, index) => ({
      ...entry,
      horseNumber: index + 1,
    }));
  });

// テスト用ラッパー
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('EntryTable Component', () => {
  /**
   * Property 3: 出馬表の必須情報表示
   * Feature: keiba-search, Property 3: 出馬表の必須情報表示
   * Validates: Requirements 2.1
   * 
   * *For any* 出馬表データが与えられた場合、
   * 各出走馬の馬番、馬名、騎手、斤量が表示される
   */
  it('Property 3: 出馬表の必須情報表示 - 全ての出走馬の必須情報が表示される', () => {
    fc.assert(
      fc.property(entriesArb, (entries) => {
        const { container } = renderWithRouter(<EntryTable entries={entries} />);
        
        // 各出走馬の必須情報が表示されていることを確認
        for (const entry of entries) {
          // 馬番が表示されている
          const horseNumberText = container.textContent;
          if (!horseNumberText?.includes(entry.horseNumber.toString())) {
            return false;
          }
          
          // 馬名が表示されている
          if (!horseNumberText?.includes(entry.horseName)) {
            return false;
          }
          
          // 騎手が表示されている
          if (!horseNumberText?.includes(entry.jockey)) {
            return false;
          }
          
          // 斤量が表示されている（kg付き）
          if (!horseNumberText?.includes(`${entry.weight}kg`)) {
            return false;
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: 出馬表のテーブルヘッダーに必須カラムが含まれる', () => {
    const entries: Entry[] = [{
      id: 'test-1',
      raceId: 'race-1',
      horseNumber: 1,
      horseName: 'テストホース',
      jockey: 'テスト騎手',
      weight: 57,
      horseWeight: 480,
      pastResults: [],
    }];
    
    renderWithRouter(<EntryTable entries={entries} />);
    
    // テーブルヘッダーに必須カラムが含まれていることを確認
    const headers = screen.getAllByRole('columnheader');
    const headerTexts = headers.map(h => h.textContent);
    
    expect(headerTexts).toContain('馬番');
    expect(headerTexts).toContain('馬名');
    expect(headerTexts).toContain('騎手');
    expect(headerTexts).toContain('斤量');
  });

  it('空の出馬表の場合、適切なメッセージが表示される', () => {
    renderWithRouter(<EntryTable entries={[]} />);
    
    expect(screen.getByText('出馬表データがありません')).toBeInTheDocument();
  });

  it('レース名が指定された場合、ヘッダーに表示される', () => {
    const raceName = '東京新聞杯(G3)';
    const entries: Entry[] = [{
      id: 'test-1',
      raceId: 'race-1',
      horseNumber: 1,
      horseName: 'テストホース',
      jockey: 'テスト騎手',
      weight: 57,
      horseWeight: 480,
      pastResults: [],
    }];
    
    renderWithRouter(<EntryTable entries={entries} raceName={raceName} />);
    
    expect(screen.getByText(raceName)).toBeInTheDocument();
  });
});
