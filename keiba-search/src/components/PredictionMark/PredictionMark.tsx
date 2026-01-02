import type { PredictionMark as PredictionMarkType } from '../../types';
import styles from './PredictionMark.module.css';

interface PredictionMarkProps {
  mark: PredictionMarkType;
  onClick?: () => void;
  testId?: string;
}

/**
 * 予想印の表示に対応するCSSクラスを取得
 */
export const getMarkClassName = (mark: PredictionMarkType): string => {
  switch (mark) {
    case '◎':
      return styles.honmei;
    case '○':
      return styles.taikou;
    case '▲':
      return styles.tanana;
    case '△':
      return styles.renka;
    case '×':
      return styles.hoshi;
    default:
      return styles.empty;
  }
};

/**
 * 予想印を表示するコンポーネント
 * ◎: 本命, ○: 対抗, ▲: 単穴, △: 連下, ×: 消し
 */
export const PredictionMark = ({ mark, onClick, testId }: PredictionMarkProps) => {
  const className = `${styles.mark} ${getMarkClassName(mark)}`;
  const displayMark = mark ?? '-';

  return (
    <span
      className={className}
      onClick={onClick}
      data-testid={testId}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {displayMark}
    </span>
  );
};
