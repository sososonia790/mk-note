import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import { ErrorMessage } from './ErrorMessage';

/**
 * Property 14: エラー時のリトライボタン表示
 * **Validates: Requirements 7.3**
 * 
 * *For any* エラーメッセージ, ErrorMessageコンポーネントは
 * そのメッセージを表示し、onRetryが提供された場合はリトライボタンを表示する
 */
describe('ErrorMessage Component - Property Tests', () => {
  // 非空白文字を含む文字列のジェネレーター
  const nonEmptyStringArb = fc.stringMatching(/^[^\s].*[^\s]$|^[^\s]$/).filter(s => s.trim().length > 0);

  it('Property 14: should display error message and retry button when onRetry provided', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        (message) => {
          const onRetry = vi.fn();
          const { unmount } = render(<ErrorMessage message={message} onRetry={onRetry} />);
          
          // エラーメッセージが表示されていることを確認
          expect(screen.getByText(message)).toBeInTheDocument();
          
          // role="alert"が設定されていることを確認（アクセシビリティ）
          expect(screen.getByRole('alert')).toBeInTheDocument();
          
          // リトライボタンが表示されていることを確認
          const retryButton = screen.getByRole('button', { name: '再試行' });
          expect(retryButton).toBeInTheDocument();
          
          // リトライボタンをクリックするとonRetryが呼ばれることを確認
          fireEvent.click(retryButton);
          expect(onRetry).toHaveBeenCalledTimes(1);
          
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 14: should not display retry button when onRetry not provided', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        (message) => {
          const { unmount } = render(<ErrorMessage message={message} />);
          
          // エラーメッセージが表示されていることを確認
          expect(screen.getByText(message)).toBeInTheDocument();
          
          // リトライボタンが表示されていないことを確認
          expect(screen.queryByRole('button', { name: '再試行' })).not.toBeInTheDocument();
          
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
