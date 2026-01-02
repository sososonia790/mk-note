/**
 * TrainingChart コンポーネントテスト
 * Property 6: 調教グラフの表示
 * Validates: Requirements 3.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import { TrainingChart, transformToChartData } from './TrainingChart';
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

describe('TrainingChart Component', () => {
  /**
   * Property 6: 調教グラフの表示
   * Feature: keiba-search, Property 6: 調教グラフの表示
   * Validates: Requirements 3.3
   * 
   * *For any* 調教データが与えられた場合、
   * グラフコンポーネントが正しくレンダリングされ、凡例が表示される
   */
  it('Property 6: 調教グラフの表示 - グラフがレンダリングされる', () => {
    fc.assert(
      fc.property(trainingsArb, (trainings) => {
        const { container } = render(<TrainingChart trainings={trainings} />);
        
        // グラフコンテナが存在することを確認
        const chartContainer = container.querySelector('.recharts-responsive-container');
        return chartContainer !== null;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 6: 調教グラフの表示 - 凡例が表示される', () => {
    fc.assert(
      fc.property(trainingsArb, (trainings) => {
        const { container } = render(<TrainingChart trainings={trainings} />);
        
        // 凡例（坂路、CW）が表示されていることを確認
        const hasLegend = container.textContent?.includes('坂路') && 
                          container.textContent?.includes('CW');
        return hasLegend === true;
      }),
      { numRuns: 100 }
    );
  });
});

describe('transformToChartData', () => {
  it('調教データをグラフ用データに正しく変換する', () => {
    fc.assert(
      fc.property(trainingsArb, (trainings) => {
        const chartData = transformToChartData(trainings);
        
        // 変換後のデータ数が元のデータ数と一致
        if (chartData.length !== trainings.length) {
          return false;
        }
        
        // 各データポイントに日付とコース情報が含まれる
        for (const point of chartData) {
          if (!point.date || !point.course) {
            return false;
          }
          // slopeまたはcwのいずれかの値が存在する
          if (point.slope === undefined && point.cw === undefined) {
            return false;
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('日付順（古い順）にソートされる', () => {
    fc.assert(
      fc.property(trainingsArb, (trainings) => {
        const chartData = transformToChartData(trainings);
        
        // 日付が昇順になっていることを確認
        for (let i = 1; i < chartData.length; i++) {
          const prevDate = new Date(chartData[i - 1].date).getTime();
          const currDate = new Date(chartData[i].date).getTime();
          if (prevDate > currDate) {
            return false;
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('最終タイム（上がり）が使用される', () => {
    const trainings: TrainingData[] = [
      { horseId: 'horse-001', date: '2025-01-03', course: 'slope', times: [13.2, 12.8, 12.5, 12.2] },
    ];
    
    const chartData = transformToChartData(trainings);
    
    // 最後のタイム（12.2）が使用されている
    expect(chartData[0].slope).toBe(12.2);
  });
});

describe('TrainingChart - Edge Cases', () => {
  it('調教データがない場合、適切なメッセージが表示される', () => {
    render(<TrainingChart trainings={[]} />);
    
    expect(screen.getByText('調教データがありません')).toBeInTheDocument();
  });

  it('馬名が指定された場合、ヘッダーに表示される', () => {
    const trainings: TrainingData[] = [
      { horseId: 'horse-001', date: '2025-01-03', course: 'slope', times: [13.2, 12.8, 12.5] },
    ];
    
    render(<TrainingChart trainings={trainings} horseName="サンライズアース" />);
    
    expect(screen.getByText('サンライズアース')).toBeInTheDocument();
  });

  it('タイトルが表示される', () => {
    const trainings: TrainingData[] = [
      { horseId: 'horse-001', date: '2025-01-03', course: 'slope', times: [13.2, 12.8, 12.5] },
    ];
    
    render(<TrainingChart trainings={trainings} />);
    
    expect(screen.getByText('調教タイム推移')).toBeInTheDocument();
  });
});
