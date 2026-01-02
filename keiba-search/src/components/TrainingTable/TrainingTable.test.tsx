/**
 * TrainingTable コンポーネントテスト
 * Property 5: 調教タイムの表示
 * Validates: Requirements 3.1, 3.2
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { TrainingTable, formatTrainingTimes, formatCourse } from './TrainingTable';
import type { TrainingData } from '../../types';

// 日付文字列のArbitrary（YYYY-MM-DD形式）
const dateStringArb = fc.tuple(
  fc.integer({ min: 2020, max: 2025 }),
  fc.integer({ min: 1, max: 12 }),
  fc.integer({ min: 1, max: 28 })
).map(([year, month, day]) => 
  `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
);

// コース種別のArbitrary
const courseArb = fc.constantFrom<'slope' | 'cw'>('slope', 'cw');

// タイム配列のArbitrary（11.0〜14.0秒の範囲で3〜6個）
const timesArb = fc.array(
  fc.float({ min: 11.0, max: 14.0, noNaN: true }),
  { minLength: 3, maxLength: 6 }
);

// TrainingDataのArbitrary
const trainingDataArb: fc.Arbitrary<TrainingData> = fc.record({
  horseId: fc.string({ minLength: 1, maxLength: 20 }),
  date: dateStringArb,
  course: courseArb,
  times: timesArb,
});

// 調教データ配列のArbitrary（1〜10件）
const trainingsArb = fc.array(trainingDataArb, { minLength: 1, maxLength: 10 });

describe('TrainingTable Component', () => {
  /**
   * Property 5: 調教タイムの表示
   * Feature: keiba-search, Property 5: 調教タイムの表示
   * Validates: Requirements 3.1, 3.2
   * 
   * *For any* 調教データが与えられた場合、
   * 各調教の日付、コース種別（坂路/CW）、タイムが表示される
   */
  it('Property 5: 調教タイムの表示 - 各調教の日付が表示される', () => {
    fc.assert(
      fc.property(trainingsArb, (trainings) => {
        const { container } = render(<TrainingTable trainings={trainings} />);
        
        // 各調教の日付が表示されていることを確認
        for (const training of trainings) {
          if (!container.textContent?.includes(training.date)) {
            return false;
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 5: 調教タイムの表示 - コース種別が正しく表示される', () => {
    fc.assert(
      fc.property(trainingsArb, (trainings) => {
        const { container } = render(<TrainingTable trainings={trainings} />);
        
        // 坂路またはCWが表示されていることを確認
        const hasSlopeData = trainings.some(t => t.course === 'slope');
        const hasCwData = trainings.some(t => t.course === 'cw');
        
        if (hasSlopeData && !container.textContent?.includes('坂路')) {
          return false;
        }
        if (hasCwData && !container.textContent?.includes('CW')) {
          return false;
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 5: 調教タイムの表示 - タイムが表示される', () => {
    fc.assert(
      fc.property(trainingsArb, (trainings) => {
        const { container } = render(<TrainingTable trainings={trainings} />);
        
        // 各調教のタイムが表示されていることを確認
        for (const training of trainings) {
          const formattedTimes = formatTrainingTimes(training.times);
          // タイムの一部が表示されていることを確認
          const firstTime = training.times[0].toFixed(1);
          if (!container.textContent?.includes(firstTime)) {
            return false;
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

describe('formatTrainingTimes', () => {
  it('タイム配列を正しくフォーマットする', () => {
    fc.assert(
      fc.property(timesArb, (times) => {
        const formatted = formatTrainingTimes(times);
        
        // 各タイムが含まれていることを確認
        for (const time of times) {
          if (!formatted.includes(time.toFixed(1))) {
            return false;
          }
        }
        
        // セパレータが正しく含まれていることを確認
        const expectedSeparators = times.length - 1;
        const actualSeparators = (formatted.match(/ - /g) || []).length;
        
        return actualSeparators === expectedSeparators;
      }),
      { numRuns: 100 }
    );
  });
});

describe('formatCourse', () => {
  it('坂路を正しく変換する', () => {
    expect(formatCourse('slope')).toBe('坂路');
  });

  it('CWを正しく変換する', () => {
    expect(formatCourse('cw')).toBe('CW');
  });
});

describe('TrainingTable - Edge Cases', () => {
  it('調教データがない場合、適切なメッセージが表示される', () => {
    render(<TrainingTable trainings={[]} />);
    
    expect(screen.getByText('調教データがありません')).toBeInTheDocument();
  });

  it('馬名が指定された場合、ヘッダーに表示される', () => {
    const trainings: TrainingData[] = [
      { horseId: 'horse-001', date: '2025-01-03', course: 'slope', times: [13.2, 12.8, 12.5] },
    ];
    
    render(<TrainingTable trainings={trainings} horseName="サンライズアース" />);
    
    expect(screen.getByText('サンライズアース')).toBeInTheDocument();
  });
});
