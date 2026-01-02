/**
 * 調教データモックデータ
 * Requirements: 3.1
 */

import type { TrainingData } from '../../types';

// 東京新聞杯出走馬の調教データ
export const mockTrainingData: TrainingData[] = [
  // サンライズアース
  {
    horseId: 'horse-001',
    date: '2025-01-03',
    course: 'slope',
    times: [13.2, 12.8, 12.5, 12.2],
  },
  {
    horseId: 'horse-001',
    date: '2025-01-01',
    course: 'cw',
    times: [13.5, 13.0, 12.8, 12.5, 12.0],
  },
  // ウインカーネリアン
  {
    horseId: 'horse-002',
    date: '2025-01-03',
    course: 'slope',
    times: [13.0, 12.6, 12.3, 12.0],
  },
  {
    horseId: 'horse-002',
    date: '2025-01-02',
    course: 'cw',
    times: [13.8, 13.2, 12.9, 12.6, 12.2],
  },
  // ナミュール
  {
    horseId: 'horse-003',
    date: '2025-01-03',
    course: 'slope',
    times: [12.8, 12.4, 12.1, 11.8],
  },
  {
    horseId: 'horse-003',
    date: '2025-01-01',
    course: 'cw',
    times: [13.2, 12.8, 12.5, 12.2, 11.8],
  },
  // ソウルラッシュ
  {
    horseId: 'horse-004',
    date: '2025-01-03',
    course: 'slope',
    times: [13.1, 12.7, 12.4, 12.1],
  },
  {
    horseId: 'horse-004',
    date: '2025-01-02',
    course: 'cw',
    times: [13.6, 13.1, 12.8, 12.4, 12.0],
  },
  // セリフォス
  {
    horseId: 'horse-005',
    date: '2025-01-03',
    course: 'slope',
    times: [12.9, 12.5, 12.2, 11.9],
  },
  {
    horseId: 'horse-005',
    date: '2025-01-01',
    course: 'cw',
    times: [13.4, 12.9, 12.6, 12.3, 11.9],
  },
  // ジャスティンカフェ
  {
    horseId: 'horse-006',
    date: '2025-01-03',
    course: 'slope',
    times: [13.3, 12.9, 12.6, 12.3],
  },
  {
    horseId: 'horse-006',
    date: '2025-01-02',
    course: 'cw',
    times: [13.7, 13.2, 12.9, 12.5, 12.1],
  },
  // マテンロウオリオン
  {
    horseId: 'horse-007',
    date: '2025-01-03',
    course: 'slope',
    times: [13.4, 13.0, 12.7, 12.4],
  },
  {
    horseId: 'horse-007',
    date: '2025-01-01',
    course: 'cw',
    times: [13.9, 13.4, 13.0, 12.7, 12.3],
  },
  // ダノンスコーピオン
  {
    horseId: 'horse-008',
    date: '2025-01-03',
    course: 'slope',
    times: [13.0, 12.6, 12.3, 12.0],
  },
  {
    horseId: 'horse-008',
    date: '2025-01-02',
    course: 'cw',
    times: [13.5, 13.0, 12.7, 12.3, 11.9],
  },
];

// 馬IDでグループ化
export const mockTrainingByHorse: Record<string, TrainingData[]> = mockTrainingData.reduce(
  (acc, training) => {
    if (!acc[training.horseId]) {
      acc[training.horseId] = [];
    }
    acc[training.horseId].push(training);
    return acc;
  },
  {} as Record<string, TrainingData[]>
);
