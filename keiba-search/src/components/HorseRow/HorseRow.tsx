/**
 * HorseRow コンポーネント
 * 各馬の情報行と近走成績
 * Requirements: 2.1, 2.2
 */

import type { Entry } from '../../types';
import { PastResults } from '../PastResults';
import styles from './HorseRow.module.css';

interface HorseRowProps {
  entry: Entry;
}

export const HorseRow: React.FC<HorseRowProps> = ({ entry }) => {
  return (
    <tr className={styles.row}>
      <td className={`${styles.cell} ${styles.horseNumber}`}>
        {entry.horseNumber}
      </td>
      <td className={`${styles.cell} ${styles.horseName}`}>
        {entry.horseName}
      </td>
      <td className={`${styles.cell} ${styles.jockey}`}>
        {entry.jockey}
      </td>
      <td className={`${styles.cell} ${styles.weight}`}>
        {entry.weight}kg
      </td>
      <td className={`${styles.cell} ${styles.horseWeight}`}>
        {entry.horseWeight}kg
      </td>
      <td className={styles.pastResults}>
        <PastResults results={entry.pastResults} maxResults={5} />
      </td>
    </tr>
  );
};
