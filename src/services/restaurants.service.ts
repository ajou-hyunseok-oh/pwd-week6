import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import Restaurant from '../models/restaurant.model';
import type { CreateRestaurantInput, RestaurantInput } from '../types/restaurant.types';
import HttpError from '../utils/httpError';

const DATA_PATH = path.join(__dirname, '..', 'data', 'restaurants.json');
let restaurantCache: Restaurant[] = loadRestaurantsSync();

export function loadRestaurantsSync(): Restaurant[] {
  const raw = readFileSync(DATA_PATH, 'utf8');
  const parsed: RestaurantInput[] = JSON.parse(raw);
  return parsed.map((item) => new Restaurant(item));
}

export async function loadRestaurantsAsync(): Promise<Restaurant[]> {
  const raw = await readFile(DATA_PATH, 'utf8');
  const parsed: RestaurantInput[] = JSON.parse(raw);
  return parsed.map((item) => new Restaurant(item));
}

async function ensureCache(): Promise<Restaurant[]> {
  if (!restaurantCache || restaurantCache.length === 0) {
    restaurantCache = await loadRestaurantsAsync();
  }
  return restaurantCache;
}

function nextRestaurantId(): number {
  return restaurantCache.reduce((max, restaurant) => Math.max(max, restaurant.id), 0) + 1;
}

function cloneCollection(collection: Restaurant[]): Restaurant[] {
  return collection.map((restaurant) => new Restaurant(restaurant));
}

// Simulates non-blocking I/O latency so students can compare async vs sync flows.
async function simulateLatency(delayInMs = 20): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayInMs));
}

export async function getAllRestaurants(): Promise<Restaurant[]> {
  await ensureCache();
  await simulateLatency();
  return cloneCollection(restaurantCache);
}

export function getAllRestaurantsSync(): Restaurant[] {
  if (!restaurantCache || restaurantCache.length === 0) {
    restaurantCache = loadRestaurantsSync();
  }
  return cloneCollection(restaurantCache);
}

export async function getRestaurantById(id: number | string): Promise<Restaurant | null> {
  await ensureCache();
  await simulateLatency();
  const numericId = Number(id);
  return restaurantCache.find((restaurant) => restaurant.id === numericId) || null;
}

export async function getPopularRestaurants(limit = 5): Promise<Restaurant[]> {
  const restaurants = await getAllRestaurants();
  return restaurants
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export async function createRestaurant(payload: Partial<CreateRestaurantInput>): Promise<Restaurant> {
  await ensureCache();
  await simulateLatency();

  const { name, category, location } = payload;
  if (!name || !category || !location) {
    const missingField = !name ? 'name' : !category ? 'category' : 'location';
    throw new HttpError(400, `'${missingField}' is required`);
  }

  const restaurant = new Restaurant({
    id: nextRestaurantId(),
    name,
    category,
    location,
    priceRange: payload.priceRange ?? '정보 없음',
    rating: payload.rating ?? 0,
    description: payload.description ?? '',
    recommendedMenu: payload.recommendedMenu ?? [],
    likes: 0,
    image: payload.image ?? ''
  });

  restaurantCache = [...restaurantCache, restaurant];
  return new Restaurant(restaurant);
}

export function resetStore(): void {
  restaurantCache = loadRestaurantsSync();
}

