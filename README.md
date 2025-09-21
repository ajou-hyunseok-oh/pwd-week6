# pwd-week4 Express Server

This project provides a lean Express.js backend that pairs with the React client from **pwd-week3**. The codebase is organised with an MVC-style folder layout, demonstrates RESTful routing, and includes both synchronous and asynchronous service examples plus Jest tests to reinforce TDD habits.

## Getting Started

```bash
npm install
npm run dev       # start with nodemon for local development
npm test          # run Jest and Supertest suites
```

> The repository ships without additional infrastructure so students can focus on HTTP fundamentals. Data persistence is kept in memory and seeded from `src/data/restaurants.json`.

## REST Endpoints

| Method | Path                              | Description |
| ------ | --------------------------------- | ----------- |
| GET    | `/health`                         | Basic health probe |
| GET    | `/api/restaurants`                | Asynchronous list fetch (uses simulated latency) |
| GET    | `/api/restaurants/sync-demo`      | Synchronous list fetch for comparison |
| GET    | `/api/restaurants/popular?limit=` | Top restaurants sorted by rating |
| GET    | `/api/restaurants/:id`            | Restaurant detail lookup |
| POST   | `/api/restaurants`                | Create in-memory restaurant (validates core fields) |
| POST   | `/api/restaurants/reset-demo`     | Reset the in-memory store to seed data (handy for workshops/tests) |

Each handler lives in `src/controllers`, delegates to the service layer in `src/services`, and returns JSON envelopes that match the client expectations from week 3.

## Sync vs Async Learning Hook

- `RestaurantService.getAllRestaurants()` mimics non-blocking I/O with a tiny `setTimeout` so students can observe Promise-based flows.
- `RestaurantService.getAllRestaurantsSync()` reads the dataset synchronously and is exposed via `/api/restaurants/sync-demo` to highlight blocking behaviour.

## TDD Support

Tests reside in `tests/` and rely on Jest plus Supertest. They cover both the service layer and the REST surface, showing how to pin down behaviour before adding new infrastructure like databases or authentication.
