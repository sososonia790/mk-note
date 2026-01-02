/**
 * RaceDetailPage - レース詳細ページ（出馬表・調教・予想印）
 * ルート: /race/:id
 * Requirements: 2.1, 3.1, 5.1
 */

import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import {
  TrainingTable,
  TrainingChart,
  Loading,
  ErrorMessage,
  MarkSelector,
} from '../components';
import { useEntries, useTrainingByRace, usePrediction } from '../hooks';
import { getMockRaceById } from '../api/mockApi';
import type { Entry, TrainingData, Race } from '../types';
import styles from './RaceDetailPage.module.css';

type TabType = 'entries' | 'training';

export const RaceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const raceId = id || '';
  
  const [activeTab, setActiveTab] = useState<TabType>('entries');
  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);
  const [race, setRace] = useState<Race | null>(null);
  const [raceLoading, setRaceLoading] = useState(true);
  
  const { data: entriesData, isLoading: entriesLoading, error: entriesError, refetch: refetchEntries } = useEntries(raceId);
  const { data: trainingData, isLoading: trainingLoading, error: trainingError, refetch: refetchTraining } = useTrainingByRace(raceId);
  const { setPrediction, getPrediction } = usePrediction(raceId);

  // レース情報を取得
  const fetchRace = useCallback(async () => {
    if (!raceId) return;
    setRaceLoading(true);
    try {
      const raceData = await getMockRaceById(raceId);
      setRace(raceData);
    } finally {
      setRaceLoading(false);
    }
  }, [raceId]);

  useEffect(() => {
    fetchRace();
  }, [fetchRace]);

  const isLoading = entriesLoading || trainingLoading || raceLoading;
  const error = entriesError || trainingError;

  const handleRetry = () => {
    refetchEntries();
    refetchTraining();
    fetchRace();
  };

  // 選択された馬の調教データをフィルタリング
  const getHorseTraining = (horseId: string): TrainingData[] => {
    if (!trainingData) return [];
    return trainingData.filter(t => t.horseId === horseId);
  };

  if (!raceId) {
    return (
      <div className={styles.container}>
        <ErrorMessage message="レースIDが指定されていません" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.backLink}>← 開催一覧に戻る</Link>
      </div>

      {race && (
        <header className={styles.header}>
          <h1 className={styles.title}>
            {race.raceNumber}R {race.raceName}
          </h1>
          <div className={styles.raceInfo}>
            <span>{race.racecourse.name}</span>
            <span>{race.trackType === 'turf' ? '芝' : 'ダート'}</span>
            <span>{race.distance}m</span>
            <span>{race.startTime}</span>
          </div>
        </header>
      )}

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'entries' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('entries')}
        >
          出馬表
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'training' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('training')}
        >
          調教情報
        </button>
      </div>

      {isLoading && <Loading message="データを読み込み中..." />}
      
      {error && <ErrorMessage message={error.message} onRetry={handleRetry} />}

      {!isLoading && !error && activeTab === 'entries' && entriesData && (
        <div className={styles.entriesSection}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>印</th>
                <th>馬番</th>
                <th>馬名</th>
                <th>騎手</th>
                <th>斤量</th>
                <th>馬体重</th>
              </tr>
            </thead>
            <tbody>
              {entriesData.entries.map((entry: Entry) => (
                <tr key={entry.id}>
                  <td className={styles.markCell}>
                    <MarkSelector
                      currentMark={getPrediction(entry.horseNumber)}
                      onSelect={(mark) => setPrediction(entry.horseNumber, mark)}
                    />
                  </td>
                  <td className={styles.numberCell}>{entry.horseNumber}</td>
                  <td className={styles.nameCell}>{entry.horseName}</td>
                  <td>{entry.jockey}</td>
                  <td>{entry.weight}kg</td>
                  <td>{entry.horseWeight}kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !error && activeTab === 'training' && (
        <div className={styles.trainingSection}>
          {entriesData && (
            <div className={styles.horseSelector}>
              <label htmlFor="horse-select">馬を選択:</label>
              <select
                id="horse-select"
                value={selectedHorseId || ''}
                onChange={(e) => setSelectedHorseId(e.target.value || null)}
                className={styles.select}
              >
                <option value="">全馬の調教データ</option>
                {entriesData.entries.map((entry: Entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.horseNumber}. {entry.horseName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {trainingData && (
            <>
              {selectedHorseId ? (
                <>
                  <TrainingTable
                    trainings={getHorseTraining(selectedHorseId)}
                    horseName={entriesData?.entries.find(e => e.id === selectedHorseId)?.horseName}
                  />
                  <TrainingChart trainings={getHorseTraining(selectedHorseId)} />
                </>
              ) : (
                <TrainingTable trainings={trainingData} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
