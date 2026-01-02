/**
 * HorseSearch コンポーネント
 * 検索入力フォームと候補表示
 * Requirements: 4.1, 4.4, 4.5
 */

import React, { useState, useCallback } from 'react';
import type { Horse } from '../../types';
import styles from './HorseSearch.module.css';

export interface HorseSearchProps {
  /** 検索結果の馬リスト */
  horses: Horse[];
  /** 検索中かどうか */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 検索実行時のコールバック */
  onSearch: (query: string) => void;
  /** 馬選択時のコールバック */
  onSelectHorse: (horse: Horse) => void;
}

export function HorseSearch({
  horses,
  isLoading,
  error,
  onSearch,
  onSelectHorse,
}: HorseSearchProps): React.ReactElement {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedQuery = query.trim();
      // 空検索を防止 (Requirements: 4.5)
      if (trimmedQuery) {
        onSearch(trimmedQuery);
      }
    },
    [query, onSearch]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    []
  );

  const isSearchDisabled = !query.trim() || isLoading;

  return (
    <div className={styles.container}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="馬名を入力してください"
          value={query}
          onChange={handleInputChange}
          aria-label="馬名検索"
        />
        <button
          type="submit"
          className={styles.searchButton}
          disabled={isSearchDisabled}
          aria-label="検索"
        >
          {isLoading ? '検索中...' : '検索'}
        </button>
      </form>

      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}

      {!error && horses.length > 0 && (
        <>
          <p className={styles.resultCount}>
            {horses.length}件の馬が見つかりました
          </p>
          <div className={styles.resultList} role="list">
            {horses.map((horse) => (
              <div
                key={horse.id}
                className={styles.resultItem}
                onClick={() => onSelectHorse(horse)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectHorse(horse);
                  }
                }}
                role="listitem"
                tabIndex={0}
                aria-label={`${horse.name}を選択`}
              >
                <div className={styles.horseInfo}>
                  <span className={styles.horseName}>{horse.name}</span>
                  <span className={styles.horseDetails}>
                    {horse.birthYear}年生 / 父: {horse.sire}
                  </span>
                </div>
                <span className={styles.arrow}>→</span>
              </div>
            ))}
          </div>
        </>
      )}

      {!error && !isLoading && horses.length === 0 && query.trim() && (
        <p className={styles.emptyMessage}>
          該当する馬が見つかりませんでした
        </p>
      )}
    </div>
  );
}
