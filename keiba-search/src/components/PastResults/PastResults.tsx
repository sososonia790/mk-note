/**
 * PastResults コンポーネント
 * 近5走の成績表示
 * Requirements: 2.2
 */

import type { PastResult } from '../../types';
import styles from './PastResults.module.css';

interface PastResultsProps {
  results: PastResult[];
  maxResults?: number;
}

const getPositionClass = (position: number): string => {
  switch (position) {
    case 1:
      return styles.position1;
    case 2:
      return styles.position2;
    case 3:
      return styles.position3;
    default:
      return styles.positionOther;
  }
};

export const PastResults: React.FC<PastResultsProps> = ({ 
  results, 
  maxResults = 5 
}) => {
  if (!results || results.length === 0) {
    return <span className={styles.noResults}>成績なし</span>;
  }

  const displayResults = results.slice(0, maxResults);

  return (
    <div className={styles.container}>
      {displayResults.map((result, index) => (
        <div key={`${result.date}-${index}`} className={styles.result}>
          <span className={`${styles.position} ${getPositionClass(result.position)}`}>
            {result.position}着
          </span>
          <span className={styles.racecourse}>{result.racecourse}</span>
          <span className={styles.distance}>{result.distance}m</span>
        </div>
      ))}
    </div>
  );
};
