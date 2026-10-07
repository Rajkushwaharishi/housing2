# ZameenMauka

Indore-first property marketplace: resale, new projects, plots, rentals, distressed deals and bank auctions.

- `frontend/` Next.js 14 (App Router), TypeScript, Tailwind, Leaflet + OpenStreetMap
- `backend/` FastAPI, SQLAlchemy 2, SQLite by default (PostgreSQL via `DATABASE_URL`)

## Run it

```bash
# 1. API  (http://localhost:8000, docs at /docs)
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# 2. Web  (http://localhost:3000)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

The API creates its tables and loads 26 **sample** listings on first start. All sample data, including the bank
auctions, is fictional. Delete `backend/zameenmauka.db` to reseed.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Search, Indore price map, auctions closing soon, new listings, locality comparison |
| `/properties/indore` | Results with filters, sort, list/map toggle (`?type=rent`, `?view=map`, ...) |
| `/properties/indore/{vijay-nagar \| flat \| plot ...}` | SEO locality and property-type pages |
| `/bank-auction-properties/indore` | Auction listings, sorted by date or discount |
| `/property/indore/{slug}` | Detail: price check vs locality average, auction checklist, map, enquiry form, JSON-LD |
| `/post-property` | Seller form, saved as `pending` for admin review |
| `/sitemap.xml`, `/robots.txt` | Generated from live listings |

## API

`GET /api/properties` (filters: `listing_type`, `property_type`, `locality`, `bhk`, `min_price`, `max_price`,
`facing`, `verified`, `q`, `sort`, `page`, `page_size`), `GET /api/properties/{slug}`, `/similar`,
`GET /api/localities`, `/api/stats`, `/api/slugs`, `POST /api/leads`, `POST /api/properties`.

## Before going live

- **Maps:** the public OSM tile server is for light use only. Set `NEXT_PUBLIC_TILE_URL` to a commercial or
  self-hosted OSM tile provider.
- **Photos:** listings use generated illustrations (`PropertyArt`). Add an `images` column and upload pipeline,
  then swap the art for `next/image`.
- **Admin:** new listings land as `status="pending"`. Build an approval screen (or use `/docs`) to flip them to `live`.
- **Postgres/PostGIS:** set `DATABASE_URL=postgresql+psycopg://...`, replace `lat`/`lng` with a PostGIS `geom` point,
  and add Alembic migrations.
- **Auction data:** real auction entries need the bank notice URL, inspection dates and a verification record.
- **Locality coordinates** in `backend/app/localities.py` are approximate.
