/**
 * HorseDetail コンポーネント
 * 血統情報と過去戦績表示
 * Requirements: 4.2, 4.3
 */

import React from 'react';
import type { Horse } from '../../types';
import styles from './HorseDetail.module.css';

export interface HorseDetailProps {
  /** 馬データ */
  horse: Horse;
  /** 戻るボタンクリック時のコールバック */
  onBack: () => void;
}

/**
 * 着順に応じたスタイルクラスを取得
 */
function getPositionClass(position: number): string {
  if (position === 1) return styles.position1;
  if (position === 2) return styles.position2;
  if (position === 3) return styles.position3;
  return '';
}

export function HorseDetail({
  horse,
  onBack,
}: HorseDetailProps): React.ReactElement {
  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.backButton}
        onClick={onBack}
        aria-label="検索結果に戻る"
      >
        ← 戻る
      </button>

      <header className={styles.header}>
        <h1 className={styles.horseName}>{horse.name}</h1>
        <p className={styles.birthYear}>{horse.birthYear}年生</p>
      </header>

      {/* 血統情報 (Requirements: 4.2) */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>血統情報</h2>
        <table className={styles.pedigreeTable}>
          <tbody>
            <tr>
              <th>父</th>
              <td data-testid="sire">{horse.sire}</td>
            </tr>
            <tr>
              <th>母</th>
              <td data-testid="dam">{horse.dam}</td>
            </tr>
            <tr>
              <th>母父</th>
              <td data-testid="damSire">{horse.damSire}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 過去戦績 (Requirements: 4.3) */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>過去戦績</h2>
        {horse.results.length > 0 ? (
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>日付</th>
                <th>競馬場</th>
                <th>距離</th>
                <th>着順</th>
                <th>タイム</th>
              </tr>
            </thead>
            <tbody>
              {horse.results.map((result, index) => (
                <tr key={`${result.date}-${index}`}>
                  <td>{result.date}</td>
                  <td>{result.racecourse}</td>
                  <td>{result.distance}m</td>
                  <td
                    className={`${styles.position} ${getPositionClass(result.position)}`}
                  >
                    {result.position}着
                  </td>
                  <td>{result.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noResults}>過去戦績がありません</p>
        )}
      </section>
    </div>
  );
}
