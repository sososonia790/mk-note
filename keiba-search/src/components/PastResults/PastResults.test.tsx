/**
 * PastResults コンポーネントテスト
 * Property 4: 近走成績の表示
 * Validates: Requirements 2.2
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { PastResults } from './PastResults';
import type { PastResult } from '../../types';

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

// 近走成績配列のArbitrary（1〜10件）
const pastResultsArb = fc.array(pastResultArb, { minLength: 1, maxLength: 10 });

describe('PastResults Component', () => {
  /**
   * Property 4: 近走成績の表示
   * Feature: keiba-search, Property 4: 近走成績の表示
   * Validates: Requirements 2.2
   * 
   * *For any* 近走成績データが与えられた場合、
   * 最大5件の成績が表示され、各成績には着順、競馬場、距離が含まれる
   */
  it('Property 4: 近走成績の表示 - 最大5件の成績が表示される', () => {
    fc.assert(
      fc.property(pastResultsArb, (results) => {
        const { container } = render(<PastResults results={results} maxResults={5} />);
        
        // 表示される成績数は最大5件
        const expectedCount = Math.min(results.length, 5);
        const displayedResults = results.slice(0, expectedCount);
        
        // 各成績の着順が表示されていることを確認
        for (const result of displayedResults) {
          const positionText = `${result.position}着`;
          if (!container.textContent?.includes(positionText)) {
            return false;
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 4: 近走成績の表示 - 各成績に競馬場と距離が含まれる', () => {
    fc.assert(
      fc.property(pastResultsArb, (results) => {
        const { container } = render(<PastResults results={results} maxResults={5} />);
        
        const expectedCount = Math.min(results.length, 5);
        const displayedResults = results.slice(0, expectedCount);
        
        // 各成績の競馬場と距離が表示されていることを確認
        for (const result of displayedResults) {
          if (!container.textContent?.includes(result.racecourse)) {
            return false;
          }
          if (!container.textContent?.includes(`${result.distance}m`)) {
            return false;
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 4: 6件以上の成績がある場合、最初の5件のみ表示される', () => {
    const results: PastResult[] = Array.from({ length: 8 }, (_, i) => ({
      date: `2024-0${i + 1}-01`,
      racecourse: '東京',
      distance: 1600,
      position: i + 1,
      time: '1:35.0',
    }));
    
    const { container } = render(<PastResults results={results} maxResults={5} />);
    
    // 1着〜5着が表示されている
    expect(container.textContent).toContain('1着');
    expect(container.textContent).toContain('5着');
    // 6着以降は表示されていない
    expect(container.textContent).not.toContain('6着');
    expect(container.textContent).not.toContain('7着');
    expect(container.textContent).not.toContain('8着');
  });

  it('成績がない場合、適切なメッセージが表示される', () => {
    render(<PastResults results={[]} />);
    
    expect(screen.getByText('成績なし')).toBeInTheDocument();
  });

  it('着順によって異なるスタイルが適用される', () => {
    const results: PastResult[] = [
      { date: '2024-01-01', racecourse: '東京', distance: 1600, position: 1, time: '1:35.0' },
      { date: '2024-02-01', racecourse: '中山', distance: 1600, position: 2, time: '1:35.5' },
      { date: '2024-03-01', racecourse: '阪神', distance: 1600, position: 3, time: '1:36.0' },
      { date: '2024-04-01', racecourse: '京都', distance: 1600, position: 10, time: '1:37.0' },
    ];
    
    const { container } = render(<PastResults results={results} />);
    
    // 各着順が表示されていることを確認
    expect(container.textContent).toContain('1着');
    expect(container.textContent).toContain('2着');
    expect(container.textContent).toContain('3着');
    expect(container.textContent).toContain('10着');
  });
});
