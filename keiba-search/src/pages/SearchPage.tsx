/**
 * SearchPage - 競走馬検索ページ
 * ルート: /search
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { HorseSearch, HorseDetail, Loading } from '../components';
import { useHorseSearch } from '../hooks';
import styles from './SearchPage.module.css';

export const SearchPage: React.FC = () => {
  const {
    horses,
    selectedHorse,
    isLoading,
    isLoadingDetail,
    error,
    search,
    selectHorse,
    clearSelection,
  } = useHorseSearch();

  const handleSelectHorse = (horse: { id: string }) => {
    selectHorse(horse.id);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>競走馬検索</h1>
      </header>

      {selectedHorse ? (
        <>
          {isLoadingDetail && <Loading message="馬情報を読み込み中..." />}
          {!isLoadingDetail && (
            <HorseDetail horse={selectedHorse} onBack={clearSelection} />
          )}
        </>
      ) : (
        <HorseSearch
          horses={horses}
          isLoading={isLoading}
          error={error}
          onSearch={search}
          onSelectHorse={handleSelectHorse}
        />
      )}
    </div>
  );
};
