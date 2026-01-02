/**
 * TrainingTable コンポーネント
 * 坂路・CW調教タイム表示
 * Requirements: 3.1, 3.2
 */

import type { TrainingData } from '../../types';
import styles from './TrainingTable.module.css';

interface TrainingTableProps {
  trainings: TrainingData[];
  horseName?: string;
}

/**
 * 調教タイムを表示用文字列にフォーマット
 * @param times - 1Fごとのタイム配列
 */
export function formatTrainingTimes(times: number[]): string {
  return times.map(t => t.toFixed(1)).join(' - ');
}

/**
 * コース種別を日本語表示に変換
 * @param course - コース種別
 */
export function formatCourse(course: 'slope' | 'cw'): string {
  return course === 'slope' ? '坂路' : 'CW';
}

export const TrainingTable: React.FC<TrainingTableProps> = ({ trainings, horseName }) => {
  // 日付の新しい順にソート
  const sortedTrainings = [...trainings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>調教タイム</h2>
        {horseName && <div className={styles.horseName}>{horseName}</div>}
      </div>
      {sortedTrainings.length === 0 ? (
        <div className={styles.emptyMessage}>調教データがありません</div>
      ) : (
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>日付</th>
              <th>コース</th>
              <th>タイム (1F〜)</th>
            </tr>
          </thead>
          <tbody>
            {sortedTrainings.map((training, index) => (
              <tr key={`${training.horseId}-${training.date}-${training.course}-${index}`}>
                <td className={styles.dateCell}>{training.date}</td>
                <td className={styles.courseCell}>
                  <span
                    className={`${styles.courseBadge} ${
                      training.course === 'slope' ? styles.slopeBadge : styles.cwBadge
                    }`}
                  >
                    {formatCourse(training.course)}
                  </span>
                </td>
                <td className={styles.timeCell}>
                  {formatTrainingTimes(training.times)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
