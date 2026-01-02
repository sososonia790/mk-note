/**
 * 出馬表モックデータ
 * Requirements: 2.1
 */

import type { Entry, PastResult } from '../../types';

// 過去成績サンプル
const samplePastResults: PastResult[] = [
  { date: '2024-12-22', racecourse: '中山', distance: 1600, position: 3, time: '1:35.2' },
  { date: '2024-12-01', racecourse: '東京', distance: 1600, position: 1, time: '1:34.8' },
  { date: '2024-11-10', racecourse: '東京', distance: 1400, position: 2, time: '1:22.5' },
  { date: '2024-10-20', racecourse: '新潟', distance: 1600, position: 5, time: '1:36.1' },
  { date: '2024-09-15', racecourse: '中山', distance: 1600, position: 4, time: '1:35.8' },
];

// 東京新聞杯の出馬表
export const mockEntriesTokyoShinbunHai: Entry[] = [
  {
    id: 'entry-001',
    raceId: 'race-2025-01-05-tokyo-11',
    horseNumber: 1,
    horseName: 'サンライズアース',
    jockey: '川田将雅',
    weight: 57,
    horseWeight: 486,
    pastResults: [
      { date: '2024-12-22', racecourse: '阪神', distance: 1600, position: 2, time: '1:33.5' },
      { date: '2024-11-17', racecourse: '東京', distance: 1600, position: 1, time: '1:32.8' },
      { date: '2024-10-13', racecourse: '東京', distance: 1800, position: 3, time: '1:46.2' },
      { date: '2024-09-08', racecourse: '中山', distance: 1600, position: 1, time: '1:33.1' },
      { date: '2024-06-02', racecourse: '東京', distance: 1600, position: 4, time: '1:34.0' },
    ],
  },
  {
    id: 'entry-002',
    raceId: 'race-2025-01-05-tokyo-11',
    horseNumber: 2,
    horseName: 'ウインカーネリアン',
    jockey: '横山武史',
    weight: 57,
    horseWeight: 502,
    pastResults: [
      { date: '2024-12-08', racecourse: '中山', distance: 1600, position: 5, time: '1:34.2' },
      { date: '2024-11-03', racecourse: '東京', distance: 1600, position: 3, time: '1:33.0' },
      { date: '2024-10-06', racecourse: '中山', distance: 1600, position: 2, time: '1:33.8' },
      { date: '2024-08-25', racecourse: '新潟', distance: 1600, position: 1, time: '1:32.5' },
      { date: '2024-06-09', racecourse: '東京', distance: 1600, position: 6, time: '1:34.5' },
    ],
  },
  {
    id: 'entry-003',
    raceId: 'race-2025-01-05-tokyo-11',
    horseNumber: 3,
    horseName: 'ナミュール',
    jockey: 'C.ルメール',
    weight: 55,
    horseWeight: 468,
    pastResults: [
      { date: '2024-11-17', racecourse: '東京', distance: 1600, position: 1, time: '1:31.8' },
      { date: '2024-10-13', racecourse: '東京', distance: 1800, position: 2, time: '1:45.5' },
      { date: '2024-06-02', racecourse: '東京', distance: 1600, position: 1, time: '1:32.0' },
      { date: '2024-04-07', racecourse: '阪神', distance: 1600, position: 3, time: '1:33.2' },
      { date: '2024-02-18', racecourse: '東京', distance: 1600, position: 2, time: '1:32.5' },
    ],
  },
  {
    id: 'entry-004',
    raceId: 'race-2025-01-05-tokyo-11',
    horseNumber: 4,
    horseName: 'ソウルラッシュ',
    jockey: '戸崎圭太',
    weight: 57,
    horseWeight: 494,
    pastResults: [
      { date: '2024-12-22', racecourse: '阪神', distance: 1600, position: 4, time: '1:33.8' },
      { date: '2024-11-17', racecourse: '東京', distance: 1600, position: 5, time: '1:33.2' },
      { date: '2024-10-13', racecourse: '東京', distance: 1800, position: 1, time: '1:45.0' },
      { date: '2024-06-02', racecourse: '東京', distance: 1600, position: 2, time: '1:32.2' },
      { date: '2024-04-07', racecourse: '阪神', distance: 1600, position: 1, time: '1:32.8' },
    ],
  },
  {
    id: 'entry-005',
    raceId: 'race-2025-01-05-tokyo-11',
    horseNumber: 5,
    horseName: 'セリフォス',
    jockey: '福永祐一',
    weight: 57,
    horseWeight: 478,
    pastResults: [
      { date: '2024-12-08', racecourse: '中山', distance: 1600, position: 1, time: '1:33.0' },
      { date: '2024-11-03', racecourse: '東京', distance: 1600, position: 2, time: '1:32.5' },
      { date: '2024-10-06', racecourse: '中山', distance: 1600, position: 3, time: '1:34.0' },
      { date: '2024-06-09', racecourse: '東京', distance: 1600, position: 1, time: '1:32.0' },
      { date: '2024-04-14', racecourse: '阪神', distance: 1600, position: 4, time: '1:33.5' },
    ],
  },
  {
    id: 'entry-006',
    raceId: 'race-2025-01-05-tokyo-11',
    horseNumber: 6,
    horseName: 'ジャスティンカフェ',
    jockey: '松山弘平',
    weight: 57,
    horseWeight: 490,
    pastResults: [
      { date: '2024-12-22', racecourse: '阪神', distance: 1600, position: 3, time: '1:33.6' },
      { date: '2024-11-17', racecourse: '東京', distance: 1600, position: 4, time: '1:33.0' },
      { date: '2024-10-13', racecourse: '東京', distance: 1800, position: 5, time: '1:46.5' },
      { date: '2024-06-02', racecourse: '東京', distance: 1600, position: 3, time: '1:32.5' },
      { date: '2024-04-07', racecourse: '阪神', distance: 1600, position: 2, time: '1:33.0' },
    ],
  },
  {
    id: 'entry-007',
    raceId: 'race-2025-01-05-tokyo-11',
    horseNumber: 7,
    horseName: 'マテンロウオリオン',
    jockey: '横山典弘',
    weight: 57,
    horseWeight: 512,
    pastResults: [
      { date: '2024-12-08', racecourse: '中山', distance: 1600, position: 6, time: '1:34.5' },
      { date: '2024-11-03', racecourse: '東京', distance: 1600, position: 7, time: '1:33.8' },
      { date: '2024-10-06', racecourse: '中山', distance: 1600, position: 4, time: '1:34.2' },
      { date: '2024-08-25', racecourse: '新潟', distance: 1600, position: 2, time: '1:32.8' },
      { date: '2024-06-09', racecourse: '東京', distance: 1600, position: 5, time: '1:34.0' },
    ],
  },
  {
    id: 'entry-008',
    raceId: 'race-2025-01-05-tokyo-11',
    horseNumber: 8,
    horseName: 'ダノンスコーピオン',
    jockey: '北村友一',
    weight: 57,
    horseWeight: 482,
    pastResults: samplePastResults,
  },
];

// 全出馬表データ（レースIDでマッピング）
export const mockEntriesMap: Record<string, Entry[]> = {
  'race-2025-01-05-tokyo-11': mockEntriesTokyoShinbunHai,
};
