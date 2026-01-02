/**
 * API exports
 */

// Client
export { apiClient, ApiError, NetworkError } from './client';
export type { ApiResponse } from './client';

// Races
export { getRacesByDate, getRaceById } from './races';
export type { RacesResponse } from './races';

// Entries
export { getEntriesByRaceId } from './entries';
export type { EntriesResponse } from './entries';

// Training
export { getTrainingByHorseId, getTrainingByRaceId } from './training';
export type { TrainingResponse } from './training';

// Horses
export { searchHorses, getHorseById } from './horses';
export type { HorseSearchResponse } from './horses';

// Mock API (for development)
export {
  getMockRacesByDate,
  getMockRaceById,
  getMockEntriesByRaceId,
  getMockTrainingByHorseId,
  getMockTrainingByRaceId,
  getMockSearchHorses,
  getMockHorseById,
} from './mockApi';

// Mock Data
export * from './mock';
