import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { Loading } from './Loading';

/**
 * Property 13: ローディング状態の表示
 * **Validates: Requirements 6.3**
 * 
 * *For any* ローディングメッセージ, Loadingコンポーネントは
 * そのメッセージを表示し、ローディングインジケーターを含む
 */
describe('Loading Component - Property Tests', () => {
  // 非空白文字を含む文字列のジェネレーター
  const nonEmptyStringArb = fc.stringMatching(/^[^\s].*[^\s]$|^[^\s]$/).filter(s => s.trim().length > 0);

  it('Property 13: should display loading indicator with any message', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        (message) => {
          const { unmount } = render(<Loading message={message} />);
          
          // メッセージが表示されていることを確認
          expect(screen.getByText(message)).toBeInTheDocument();
          
          // role="status"が設定されていることを確認（アクセシビリティ）
          expect(screen.getByRole('status')).toBeInTheDocument();
          
          // スピナーが存在することを確認
          const container = screen.getByRole('status');
          expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
          
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 13: should display default message when no message provided', () => {
    render(<Loading />);
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
