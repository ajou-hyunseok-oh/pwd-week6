import * as restaurantService from '../src/services/restaurants.service';

describe('RestaurantService', () => {
  afterEach(() => {
    restaurantService.resetStore();
  });

  test('getAllRestaurants resolves with data', async () => {
    const restaurants = await restaurantService.getAllRestaurants();
    expect(Array.isArray(restaurants)).toBe(true);
    expect(restaurants.length).toBeGreaterThan(0);
  });

  test('getAllRestaurantsSync returns data immediately', () => {
    const restaurants = restaurantService.getAllRestaurantsSync();
    expect(Array.isArray(restaurants)).toBe(true);
    expect(restaurants.length).toBeGreaterThan(0);
  });

  test('async and sync file loaders read the same seed data', async () => {
    expect(await restaurantService.loadRestaurantsAsync()).toEqual(restaurantService.loadRestaurantsSync());
  });

  test('returned collections do not expose cached menu arrays', async () => {
    const restaurants = await restaurantService.getAllRestaurants();
    restaurants[0].recommendedMenu.push('외부 변경');
    const fresh = restaurantService.getAllRestaurantsSync();
    expect(fresh[0].recommendedMenu).not.toContain('외부 변경');
  });

  test('createRestaurant appends a new entry', async () => {
    const payload = {
      name: '테스트 식당',
      category: '테스트',
      location: '가상 캠퍼스',
      rating: 4.5,
    };

    const created = await restaurantService.createRestaurant(payload);
    expect(created.id).toBeDefined();
    expect(created.name).toBe(payload.name);

    const all = await restaurantService.getAllRestaurants();
    const found = all.find((item) => item.id === created.id);
    expect(found).toBeTruthy();
  });

  test('createRestaurant rejects invalid payloads', async () => {
    await expect(
      restaurantService.createRestaurant({ name: '누락된 식당' })
    ).rejects.toThrow("'category' is required");
  });
});
