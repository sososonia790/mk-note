/**
 * RaceList コンポーネント
 * 日付選択と競馬場一覧表示
 * Requirements: 1.1, 1.2, 1.3
 */

import { useState, useCallback } from 'react';
import { RaceCard } from '../RaceCard';
import { Loading } from '../Loading';
import { ErrorMessage } from '../ErrorMessage';
import { useRaces } from '../../hooks/useRaces';
import styles from './RaceList.module.css';

// 今日の日付をYYYY-MM-DD形式で取得
const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const RaceList: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const { data, isLoading, error, refetch } = useRaces(selectedDate);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>開催一覧</h1>
        <div className={styles.dateSelector}>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className={styles.dateInput}
            aria-label="開催日を選択"
          />
        </div>
      </div>

      {isLoading && <Loading message="開催情報を読み込み中..." />}

      {error && (
        <ErrorMessage
          message={error.message}
          onRetry={handleRetry}
        />
      )}

      {!isLoading && !error && data && (
        <>
          {data.racecourses.length === 0 ? (
            <p className={styles.emptyMessage}>
              {selectedDate} の開催はありません
            </p>
          ) : (
            <div className={styles.racecourseList}>
              {data.racecourses.map((group) => (
                <RaceCard
                  key={group.racecourse.id}
                  racecourse={group.racecourse}
                  races={group.races}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
