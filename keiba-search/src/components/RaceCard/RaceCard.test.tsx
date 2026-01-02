/**
 * RaceCard コンポーネント Property Test
 * Requirements: 1.3, 1.4
 */

import { describe, it, expect, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RaceCard } from './RaceCard';
import type { Race, Racecourse } from '../../types';

// 競馬場のArbitrary
const racecourseArb: fc.Arbitrary<Racecourse> = fc.record({
  id: fc.stringMatching(/^rc-[0-9]{2}$/),
  name: fc.constantFrom('東京', '中山', '阪神', '京都', '中京', '新潟', '福島', '札幌', '函館', '小倉'),
  code: fc.stringMatching(/^[0-9]{2}$/),
});

// 日付のArbitrary（YYYY-MM-DD形式）
const dateArb = fc.integer({ min: 2024, max: 2026 }).chain(year =>
  fc.integer({ min: 1, max: 12 }).chain(month =>
    fc.integer({ min: 1, max: 28 }).map(day =>
      `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    )
  )
);

// レースのArbitrary
const raceArb = (racecourse: Racecourse): fc.Arbitrary<Race> => 
  fc.tuple(
    fc.stringMatching(/^race-[a-z0-9-]{20,30}$/),
    dateArb,
    fc.integer({ min: 1, max: 12 }),
    fc.constantFrom('3歳未勝利', '4歳上1勝クラス', 'オープン', '東京新聞杯(G3)'),
    fc.constantFrom(1200, 1400, 1600, 1800, 2000, 2400),
    fc.constantFrom('turf', 'dirt') as fc.Arbitrary<'turf' | 'dirt'>,
    fc.tuple(
      fc.integer({ min: 9, max: 16 }),
      fc.integer({ min: 0, max: 59 })
    ).map(([h, m]) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`)
  ).map(([id, date, raceNumber, raceName, distance, trackType, startTime]) => ({
    id,
    date,
    racecourse,
    raceNumber,
    raceName,
    distance,
    trackType,
    startTime,
  }));

// レース配列のArbitrary（1〜12レース、レース番号はユニーク）
const racesArb = (racecourse: Racecourse): fc.Arbitrary<Race[]> => 
  fc.integer({ min: 1, max: 12 }).chain(count => {
    const raceNumbers = Array.from({ length: count }, (_, i) => i + 1);
    return fc.tuple(
      ...raceNumbers.map(num => 
        raceArb(racecourse).map(race => ({ ...race, raceNumber: num }))
      )
    );
  });

// テスト用ラッパー
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('RaceCard - Property Tests', () => {
  afterEach(() => {
    cleanup();
  });

  /**
   * Property 2: レース番号の完全表示
   * Feature: keiba-search, Property 2: レース番号の完全表示
   * Validates: Requirements 1.3
   * 
   * *For any* 競馬場のレース一覧において、全てのレース番号、競馬場名、
   * 発走時刻が表示され、各レースへのリンクが正しく設定される
   */
  it('Property 2: レース番号完全表示 - 全てのレース情報が正しく表示される', () => {
    fc.assert(
      fc.property(
        racecourseArb.chain(rc => fc.tuple(fc.constant(rc), racesArb(rc))),
        ([racecourse, races]) => {
          cleanup();
          const { container } = renderWithRouter(
            <RaceCard racecourse={racecourse} races={races} />
          );
          
          // 競馬場名が表示されていることを確認
          expect(container.textContent).toContain(racecourse.name);
          
          // 全てのレース番号が表示されていることを確認
          for (const race of races) {
            const raceNumberText = `${race.raceNumber}R`;
            expect(container.textContent).toContain(raceNumberText);
            // 発走時刻が表示されていることを確認
            expect(container.textContent).toContain(race.startTime);
          }
          
          // 各レースへのリンクが存在することを確認
          const links = container.querySelectorAll('a');
          expect(links.length).toBe(races.length);
          
          // 各リンクのhrefが正しいことを確認
          for (const race of races) {
            const link = Array.from(links).find(l => l.getAttribute('href') === `/race/${race.id}`);
            expect(link).toBeTruthy();
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
