/**
 * EntryTable コンポーネント
 * 馬番、馬名、騎手、斤量の表形式表示
 * Requirements: 2.1
 */

import type { Entry } from '../../types';
import { HorseRow } from '../HorseRow';
import styles from './EntryTable.module.css';

interface EntryTableProps {
  entries: Entry[];
  raceName?: string;
}

export const EntryTable: React.FC<EntryTableProps> = ({ entries, raceName }) => {
  return (
    <div className={styles.container}>
      {raceName && (
        <div className={styles.header}>
          <h2 className={styles.title}>{raceName}</h2>
        </div>
      )}
      {entries.length === 0 ? (
        <div className={styles.emptyMessage}>出馬表データがありません</div>
      ) : (
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>馬番</th>
              <th>馬名</th>
              <th>騎手</th>
              <th>斤量</th>
              <th>馬体重</th>
              <th>近走成績</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <HorseRow key={entry.id} entry={entry} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
