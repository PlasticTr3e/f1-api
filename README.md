# F1 Race Weekend Tracker API

REST API untuk manajemen data akhir pekan balap Formula 1, meliputi tim, pembalap, sirkuit, balapan, dan hasil balapan.

## 1. Deskripsi Project

Project ini adalah backend API berbasis Node.js, Express, Prisma, PostgreSQL dengan tema Formula 1.

Fitur utama:
- Manajemen `Team` (CRUD)
- Manajemen `Driver` (CRUD)
- Manajemen `Circuit` (CRUD)
- Manajemen `Race` (Create + Read)
- Manajemen `RaceResult` (Create + Read)

Tech stack:
- Node.js (Express)
- Prisma ORM
- PostgreSQL
- Docker + Docker Compose
- Jest + Supertest
- GitHub Actions (CI + Security Scan)

## 2. Dokumentasi API

Base URL (local):
- `http://localhost:3000`

### Endpoint List

Health:
- `GET /health`

Teams:
- `GET /teams`
- `GET /teams/:id`
- `POST /teams`
- `PUT /teams/:id`
- `DELETE /teams/:id`

Drivers:
- `GET /drivers`
- `GET /drivers/:id`
- `POST /drivers`
- `PUT /drivers/:id`
- `DELETE /drivers/:id`

Circuits:
- `GET /circuits`
- `GET /circuits/:id`
- `POST /circuits`
- `PUT /circuits/:id`
- `DELETE /circuits/:id`

Races:
- `GET /races`
- `GET /races/:id`
- `POST /races`

Results:
- `GET /results/race/:raceId`
- `POST /results`

### Format Response JSON

Response sukses:

```json
{
	"status": "success",
	"message": "Teams retrieved",
	"data": [
		{
			"id": 1,
			"name": "Red Bull Racing",
			"base": "Milton Keynes, United Kingdom",
			"principal": "Christian Horner",
			"createdAt": "2026-03-25T10:00:00.000Z",
			"updatedAt": "2026-03-25T10:00:00.000Z"
		}
	]
}
```

Response error:

```json
{
	"status": "error",
	"message": "Validation failed",
	"errors": [
		{
			"field": "name",
			"message": "name is required"
		}
	]
}
```

## 3. Panduan Instalasi (Docker)

### Prasyarat
- Docker Desktop aktif

### Menjalankan aplikasi

1. Build dan jalankan container:

```bash
docker-compose up --build
```

Container API otomatis menjalankan migrasi database (`prisma migrate deploy`) saat startup.

2. (Opsional) isi data awal:

```bash
docker-compose exec f1-api node prisma/seed.js
```

### Informasi Port
- API: `3000` (host) -> `3000` (container)
- PostgreSQL: `5432` (host) -> `5432` (container)

## 4. Alur Kerja Git

Branch strategy yang digunakan:
- `main`: branch rilis/produksi
- `dev`: branch integrasi utama pengembangan
- `features/*`: branch untuk fitur spesifik

Contoh branch yang dipakai di project:
- `features/project-setup`
- `features/api-routes-test`

Conventional Commit yang digunakan:
- `feat: express api with health endpoint and unit test`
- `feat: initialize Prisma schema and set up database models for F1 teams, drivers, circuits, races, and results`
- `fix: update branch names in CI workflows to use 'dev' and 'features/**'`

## 5. Status Automasi (GitHub Actions)

Workflow yang tersedia:
- CI (Unit Testing): [.github/workflows/ci.yml](.github/workflows/ci.yml)
- CS (Security Scan): [.github/workflows/security.yml](.github/workflows/security.yml)

Penjelasan singkat:
- CI menjalankan instalasi dependency, generate Prisma client, migrasi database, lalu test otomatis (`npm run test`) setiap Push/PR.
- Security Scan menjalankan `npm audit` untuk dependency scan pada setiap Push/PR.

```md
![CI](https://github.com/PlasticTr3e/f1-api/actions/workflows/ci.yml/badge.svg)
![Security](https://github.com/PlasticTr3e/f1-api/actions/workflows/security.yml/badge.svg)
```

## Menjalankan Test Lokal

```bash
npm install
npm run test
```

## Menjalankan API Lokal Tanpa Docker

```bash
npm install
npx prisma generate
npx prisma migrate deploy
node prisma/seed.js
npm run dev
```
