# CLAUDE.md

## Project Overview
結婚式招待状Webアプリ（Ken & Miki Wedding）。Cloudflare Pages + R2 で動作。

## Structure
- `front/` - Vue 3 + TypeScript + Vuetify (Vite) + Cloudflare Pages Functions
- `front/functions/api/` - Hono ベースの API（Pages Functions）

## Tech Stack
- **Frontend**: Vue 3, Vue Router, Pinia, Vuetify 3, Axios, Google Maps API
- **API**: Hono on Cloudflare Pages Functions, R2 (file storage)
- **CI/CD**: GitHub Actions (ci-front.yaml, cd-front.yaml)

## Commands

### Frontend (`front/`)
```bash
npm run dev          # Dev server
npm run build        # Production build (type-check + vite build)
npm run test:unit    # Unit tests (Vitest)
npm run test:e2e     # E2E tests (Playwright)
npm run lint         # ESLint
npm run format       # Prettier
npx wrangler pages dev dist  # Local dev with Pages Functions + R2
```

## Key Routes (Frontend)
- `/` `/invitation` - 招待状（挙式+披露宴）
- `/invite` - 招待状（披露宴のみ）
- `/kohei` - 招待状（kohei用スケジュール）
- `/upload` - 写真アップロード
- `/album` - アルバム表示

## API Routes (Pages Functions)
- `POST /api/files/upload` - 写真アップロード
- `POST /api/files/invitation/upload?assetKey=...` - 招待状アセットアップロード
- `GET /api/photos` - 写真一覧
- `GET /api/photos/:name` - 写真配信
- `GET /api/assets/:key` - 招待状アセット配信
- `GET /api/health` - ヘルスチェック

## Notes
- Domain: kenmiki.com
- Hosting: Cloudflare Pages
- Storage: Cloudflare R2 (`kenmiki-wedding-photo`, `kenmiki-wedding-assets`)
