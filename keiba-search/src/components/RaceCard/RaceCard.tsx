/**
 * RaceCard コンポーネント
 * 競馬場名とレース番号一覧
 * Requirements: 1.3, 1.4
 */

import { Link } from 'react-router-dom';
import type { Race, Racecourse } from '../../types';
import styles from './RaceCard.module.css';

interface RaceCardProps {
  racecourse: Racecourse;
  races: Race[];
}

// 重賞レースかどうかを判定
const isGradeRace = (raceName: string): boolean => {
  return raceName.includes('(G');
};

export const RaceCard: React.FC<RaceCardProps> = ({ racecourse, races }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.racecourse}>{racecourse.name}</h2>
      </div>
      <div className={styles.raceList}>
        {races.map((race) => (
          <Link
            key={race.id}
            to={`/race/${race.id}`}
            className={`${styles.raceItem} ${isGradeRace(race.raceName) ? styles.gradeRace : ''}`}
            aria-label={`${race.raceNumber}R ${race.raceName}`}
          >
            <span className={styles.raceNumber}>{race.raceNumber}R</span>
            <span className={styles.startTime}>{race.startTime}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
