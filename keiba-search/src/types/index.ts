// 競馬場
export interface Racecourse {
  id: string;
  name: string;        // 例: "東京", "中山"
  code: string;        // 例: "05", "06"
}

// レース
export interface Race {
  id: string;
  date: string;        // YYYY-MM-DD
  racecourse: Racecourse;
  raceNumber: number;  // 1-12
  raceName: string;
  distance: number;    // メートル
  trackType: 'turf' | 'dirt';
  startTime: string;   // HH:mm
}

// 過去成績
export interface PastResult {
  date: string;
  racecourse: string;
  distance: number;
  position: number;
  time: string;
}

// 出走馬
export interface Entry {
  id: string;
  raceId: string;
  horseNumber: number;
  horseName: string;
  jockey: string;
  weight: number;      // 斤量
  horseWeight: number; // 馬体重
  pastResults: PastResult[];
}

// 調教データ
export interface TrainingData {
  horseId: string;
  date: string;
  course: 'slope' | 'cw';  // 坂路 or CW
  times: number[];         // 1F〜のタイム
}

// 競走馬詳細
export interface Horse {
  id: string;
  name: string;
  birthYear: number;
  sire: string;        // 父
  dam: string;         // 母
  damSire: string;     // 母父
  results: PastResult[];
}

// 予想印
export type PredictionMark = '◎' | '○' | '▲' | '△' | '×' | null;

export interface Prediction {
  raceId: string;
  horseNumber: number;
  mark: PredictionMark;
}

// LocalStorage用の予想印データ構造
export interface StoredPredictions {
  [raceId: string]: {
    [horseNumber: number]: PredictionMark;
  };
}
