/**
 * モックAPIハンドラー
 * 開発時にモックデータを返す
 */

import type { Race, Entry, TrainingData, Horse, Racecourse } from '../types';
import type { RacesResponse } from './races';
import type { EntriesResponse } from './entries';
import type { TrainingResponse } from './training';
import type { HorseSearchResponse } from './horses';
import { mockRaces } from './mock/races';
import { mockEntriesMap } from './mock/entries';
import { mockTrainingByHorse, mockTrainingData } from './mock/training';
import { mockHorses } from './mock/horses';

// 遅延をシミュレート
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 指定日の開催一覧を取得（モック）
 */
export async function getMockRacesByDate(date: string): Promise<RacesResponse> {
  await delay(300);
  
  const racesForDate = mockRaces.filter(race => race.date === date);
  
  // 競馬場ごとにグループ化
  const racecourseMap = new Map<string, { racecourse: Racecourse; races: Race[] }>();
  
  for (const race of racesForDate) {
    const key = race.racecourse.id;
    if (!racecourseMap.has(key)) {
      racecourseMap.set(key, { racecourse: race.racecourse, races: [] });
    }
    racecourseMap.get(key)!.races.push(race);
  }
  
  // レース番号でソート
  for (const group of racecourseMap.values()) {
    group.races.sort((a, b) => a.raceNumber - b.raceNumber);
  }
  
  return {
    date,
    racecourses: Array.from(racecourseMap.values()),
  };
}

/**
 * レース詳細を取得（モック）
 */
export async function getMockRaceById(raceId: string): Promise<Race | null> {
  await delay(200);
  return mockRaces.find(race => race.id === raceId) || null;
}

/**
 * 出馬表を取得（モック）
 */
export async function getMockEntriesByRaceId(raceId: string): Promise<EntriesResponse> {
  await delay(300);
  
  const entries = mockEntriesMap[raceId] || [];
  return { raceId, entries };
}

/**
 * 馬の調教データを取得（モック）
 */
export async function getMockTrainingByHorseId(horseId: string): Promise<TrainingResponse> {
  await delay(200);
  
  const trainings = mockTrainingByHorse[horseId] || [];
  return { horseId, trainings };
}

/**
 * レースの全出走馬の調教データを取得（モック）
 */
export async function getMockTrainingByRaceId(raceId: string): Promise<TrainingData[]> {
  await delay(300);
  
  const entries = mockEntriesMap[raceId] || [];
  const horseIds = entries.map((_, index) => `horse-00${index + 1}`);
  
  return mockTrainingData.filter(t => horseIds.includes(t.horseId));
}

/**
 * 馬名で検索（モック）
 */
export async function getMockSearchHorses(query: string): Promise<HorseSearchResponse> {
  await delay(300);
  
  if (!query.trim()) {
    return { horses: [], total: 0 };
  }
  
  const normalizedQuery = query.toLowerCase();
  const horses = mockHorses.filter(horse => 
    horse.name.toLowerCase().includes(normalizedQuery)
  );
  
  return { horses, total: horses.length };
}

/**
 * 馬詳細を取得（モック）
 */
export async function getMockHorseById(horseId: string): Promise<Horse | null> {
  await delay(200);
  return mockHorses.find(horse => horse.id === horseId) || null;
}
