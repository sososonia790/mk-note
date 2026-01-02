import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { PredictionMark, getMarkClassName } from './PredictionMark';
import type { PredictionMark as PredictionMarkType } from '../../types';

// 予想印のArbitrary（nullを含む）
const predictionMarkArb: fc.Arbitrary<PredictionMarkType> = fc.constantFrom(
  '◎', '○', '▲', '△', '×', null
);

// 有効な予想印のArbitrary（nullを含まない）
const validPredictionMarkArb: fc.Arbitrary<Exclude<PredictionMarkType, null>> = fc.constantFrom(
  '◎', '○', '▲', '△', '×'
);

describe('PredictionMark Component', () => {
  /**
   * Property 10: 予想印の表示更新
   * Feature: keiba-search, Property 10: 予想印の表示更新
   * Validates: Requirements 5.2
   * 
   * *For any* 予想印（◎○▲△×）が設定された場合、
   * その印が正しく表示される
   */
  it('Property 10: 予想印の表示更新 - 設定された予想印が正しく表示される', () => {
    fc.assert(
      fc.property(validPredictionMarkArb, (mark) => {
        const { unmount } = render(
          <PredictionMark mark={mark} testId="test-mark" />
        );
        
        const element = screen.getByTestId('test-mark');
        const displayedMark = element.textContent;
        
        unmount();
        
        // 表示されている印が設定した印と一致することを確認
        return displayedMark === mark;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 10: nullの場合は"-"が表示される', () => {
    const { unmount } = render(
      <PredictionMark mark={null} testId="test-mark" />
    );
    
    const element = screen.getByTestId('test-mark');
    expect(element.textContent).toBe('-');
    
    unmount();
  });

  it('Property 10: 各予想印に対応するCSSクラスが適用される', () => {
    fc.assert(
      fc.property(predictionMarkArb, (mark) => {
        const className = getMarkClassName(mark);
        
        // 各印に対応するクラス名が返されることを確認
        if (mark === '◎') return className.includes('honmei');
        if (mark === '○') return className.includes('taikou');
        if (mark === '▲') return className.includes('tanana');
        if (mark === '△') return className.includes('renka');
        if (mark === '×') return className.includes('hoshi');
        if (mark === null) return className.includes('empty');
        
        return false;
      }),
      { numRuns: 100 }
    );
  });
});
