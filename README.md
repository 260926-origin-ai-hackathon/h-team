# はたけマップ — Hatake Map

地図で生産者を知って、畑に取りに行く。生産者の「顔・こだわり・レビュー」を中心にした、予約型の農産物マーケットプレイス（ハッカソン用）。

Expo (React Native / TypeScript / Expo Router) + Mapbox + Convex。

## できること

**消費者**
- 地図に承認済みの生産者を表示（PR 生産者は大きく・先頭に）。★平均・本日収穫・発送対応で絞り込み、検索。
- ピン → シート（ひとこと・こだわり・受取時間・今予約できる商品）→ 生産者ページ（01 人 → 02 農園と受取場所 → 03 商品 → 04 レビュー）。
- 商品を予約カゴへ → 受取方法（取りに行く: 受取日時を選択 / 発送代行: 住所入力・送料 ¥880）→ 予約リクエスト。
- 予約一覧・詳細（リクエスト → 確定 → 受取完了 の進行、キャンセル）。受取完了後に ★＋コメントでレビュー投稿。

**生産者**
- ホーム（承認状態、未対応リクエスト、今日の受取、評価、PR トグル）。
- 予約管理（確定／辞退／受取完了・発送済み）。完了後にお客さまを ★ 評価（他の生産者が参照）。
- 商品の追加・編集（本日収穫、発送代行対応、公開/非公開、在庫）。
- プロフィール登録・編集（顔写真、こだわり、受取場所・時間、畑の位置は現在地から取得可）。新規登録は「承認待ち」になり、承認後に地図へ。
- 受け取ったレビューの一覧と分布。

**運営（デモ）**: 生産者の承認／却下。

起動時に 消費者 / 生産者（藤井農園デモ） / 生産者（新規登録） / 運営 を選びます。認証は固定のデモ ID です（`lib/convex.ts`）。

## セットアップ

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
```

1. **Convex**: `npm run backend`（= `npx convex dev`）。アカウント無しなら `CONVEX_AGENT_MODE=anonymous npx convex dev` でローカル実行できます。`.env.local` に `EXPO_PUBLIC_CONVEX_URL` が書き込まれます。
2. **シード**: `npm run seed`（大阪の生産者 9 名・商品・レビュー・予約のデモデータ。1 名は承認待ち）。
3. **Mapbox**: `.env.local` に `EXPO_PUBLIC_MAPBOX_TOKEN`（pk.…）。未設定でもオフラインの空スタイルでピンは動きます。
4. **ネイティブビルド**（Mapbox は Expo Go 不可）: `npx expo run:ios`。以降は `npx expo start --dev-client`。

## 構成

```
app/
  index.tsx                 起動時のロール選択
  admin.tsx                 運営: 生産者の承認
  consumer/                 map / farmer/[id] / product/[id] / cart / reservations / reservation/[id] / review/[id]
  farmer/                   home / reservations / reservation/[id] / products / product/[id] / profile / reviews
components/                 FarmerMarker, FarmerBottomSheet, MapFilters, ProductCard, ReservationCard, ReviewCard, Stars, TabBar, ui
convex/                     schema, farmers, products, reservations, reviews, users, seed
lib/                        theme（デザイントークン）, store（Zustand: role / cart / filter / toast）, map, farmerView, useMyFarmer
e2e/                        Maestro フロー（consumer / farmer / admin）
```

## データモデル（Convex）

- `farmers`: `status` (pending/approved/rejected), `pr`, `ownerUserId`, 顔・こだわり・受取場所/時間・位置
- `products`: `deliveryAvailable`（発送代行）, `harvestedToday`, `stock`, `available`
- `reservations`: `status` (requested → confirmed → completed | declined | cancelled), `method` (pickup/delivery), `pickupAt` / `address`, 明細を埋め込み
- `reviews`（消費者 → 生産者、公開）, `consumerRatings`（生産者 → 消費者、生産者間で参照）

## E2E（Maestro）

```bash
npm run seed
npm run e2e            # consumer → farmer → admin の順に実行
```

スクショは `e2e/shots/`（縮小版は `docs/e2e/`）。iOS の Maestro は日本語入力ができないため、フロー内の入力は ASCII です。
