import { useState, useRef, useEffect } from 'react';
import type { PredictionMark as PredictionMarkType } from '../../types';
import { PredictionMark } from '../PredictionMark';
import styles from './MarkSelector.module.css';

interface MarkSelectorProps {
  currentMark: PredictionMarkType;
  onSelect: (mark: PredictionMarkType) => void;
  testId?: string;
}

const MARKS: PredictionMarkType[] = ['◎', '○', '▲', '△', '×'];

const getOptionClassName = (mark: PredictionMarkType): string => {
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
      return styles.clear;
  }
};

/**
 * 予想印選択メニューコンポーネント
 * クリックでドロップダウンを表示し、印を選択できる
 */
export const MarkSelector = ({ currentMark, onSelect, testId }: MarkSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 外側クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (mark: PredictionMarkType) => {
    onSelect(mark);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef} data-testid={testId}>
      <PredictionMark
        mark={currentMark}
        onClick={handleMarkClick}
        testId={testId ? `${testId}-current` : undefined}
      />
      {isOpen && (
        <div className={styles.dropdown} data-testid={testId ? `${testId}-dropdown` : undefined}>
          {MARKS.map((mark) => (
            <button
              key={mark}
              className={`${styles.option} ${getOptionClassName(mark)}`}
              onClick={() => handleSelect(mark)}
              data-testid={testId ? `${testId}-option-${mark}` : undefined}
            >
              {mark}
            </button>
          ))}
          <button
            className={`${styles.option} ${styles.clear}`}
            onClick={() => handleSelect(null)}
            data-testid={testId ? `${testId}-option-clear` : undefined}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
