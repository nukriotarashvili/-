import axios from 'axios';
import { UnsplashPhoto, UnsplashSearchResponse, UnsplashRandomResponse, PhotoCache } from '../types/unsplash';

const unsplashApi = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
  },
});

// კეშირების სისტემა
const cache = new Map<string, PhotoCache<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 წუთი

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function searchPhotos(query: string, page: number = 1, perPage: number = 20): Promise<UnsplashSearchResponse> {
  const cacheKey = `search:${query}:${page}:${perPage}`;
  const cached = getCachedData<UnsplashSearchResponse>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const response = await unsplashApi.get<UnsplashSearchResponse>('/search/photos', {
    params: { query, page, per_page: perPage },
  });

  setCachedData(cacheKey, response.data);
  return response.data;
}

export async function getRandomPhotos(count: number = 20): Promise<UnsplashRandomResponse> {
  const cacheKey = `random:${count}`;
  const cached = getCachedData<UnsplashRandomResponse>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const response = await unsplashApi.get<UnsplashRandomResponse>('/photos/random', {
    params: { count },
  });

  setCachedData(cacheKey, response.data);
  return response.data;
}

export async function getPhotoById(id: string): Promise<UnsplashPhoto> {
  const cacheKey = `photo:${id}`;
  const cached = getCachedData<UnsplashPhoto>(cacheKey);
  
  if (cached) {
    return cached;
  }

  const response = await unsplashApi.get<UnsplashPhoto>(`/photos/${id}`);
  setCachedData(cacheKey, response.data);
  return response.data;
} 