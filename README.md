# はたけマップ

**地図で生産者を知って、畑に取りに行く。**
生産者の「顔・こだわり・レビュー」を前面に出した、予約型の農産物マーケットプレイスです。
消費者は地図から生産者を選んで予約し、畑へ取りに行く（または宅急便で受け取る）。生産者は予約を確定し、受け渡しまでをアプリで管理します。

<p>
  <img src="docs/e2e/c01-map.png" width="180" alt="地図">
  <img src="docs/e2e/c02-sheet.png" width="180" alt="生産者シート">
  <img src="docs/e2e/c03-farmer-top.png" width="180" alt="生産者ページ">
  <img src="docs/e2e/c07-cart.png" width="180" alt="予約カゴ">
</p>

Expo (React Native / TypeScript / Expo Router) + Mapbox + Convex。ハッカソン提出用のプロトタイプです。

## コンセプト

- **顔が見える**: 生産者ページは「01 人 → 02 農園と受取場所 → 03 商品 → 04 レビュー」の順。誰が、どこで、どんなこだわりで育てているかを先に見せる。
- **予約して、取りに行く**: 生産者ごとの受取時間帯（曜日 × 時間）から日時を選んで予約。発送に対応した商品は宅急便でも受け取れる。
- **双方向の評価**: 消費者は生産者に ★ レビュー、生産者は消費者を ★ 評価（他の生産者だけが参照）。
- **承認制**: 新規の生産者は運営の承認後に地図へ載る。PR をオンにすると地図で大きく・一覧の先頭に表示。
- **出荷予定をウォッチ**: まだ販売前の商品を出荷予定として掲載し、消費者がウォッチしておくと販売開始を知らせる。

## 主な機能

### 消費者

- 地図に承認済みの生産者を表示。検索パネルでキーワード・本日収穫・発送対応・高評価・作物で絞り込み。
- ピンをタップするとシート（ひとこと・こだわり・受取時間・今予約できる商品）→ 生産者ページ（こだわり、受取場所、SNS、販売中／出荷予定の商品、レビュー）。
- 商品を予約カゴへ。受取方法は「取りに行く（受取時間帯から日時を選択）」か「発送（住所入力・送料 ¥880）」。
- 予約一覧・詳細。リクエスト → 確定 → 受取完了 の進行、キャンセル、テスト用カード決済（発送は支払い後に出荷、受取は現地払いも可）。
- 受取完了後に ★ とコメントでレビュー投稿。プロフィール（名前・電話・発送先・ひとこと）の編集。

### 生産者

- ホーム: 承認状態、未対応リクエスト、今日の受取、評価、PR のオン／オフと PR 文言。
- 予約管理: 確定／辞退／受取完了。発送は追跡番号を登録して発送済みに。未払いの受取は現地払いとして完了。完了後にお客さまを ★ 評価。
- 商品の追加・編集: 本日収穫、発送対応、在庫、公開／非公開、出荷予定日（ウォッチ数が見える）。
- プロフィール: 顔写真、こだわり、受取場所と時間帯、SNS、畑の位置（現在地から取得可）。新規登録は「承認待ち」になり、承認後に地図へ。
- 受け取ったレビューの一覧と ★ の分布。

### 運営（デモ）

- 承認待ちの生産者を承認／却下。

## 画面

| 消費者 | | | |
| --- | --- | --- | --- |
| <img src="docs/e2e/c00-role.png" width="160"> | <img src="docs/e2e/c04-farmer-pickup.png" width="160"> | <img src="docs/e2e/c06-product.png" width="160"> | <img src="docs/e2e/c08-cart-filled.png" width="160"> |
| ロール選択 | 農園と受取場所 | 商品 | 受取日時を選ぶ |
| <img src="docs/e2e/c09-reservation-requested.png" width="160"> | <img src="docs/e2e/c10-reservations.png" width="160"> | <img src="docs/e2e/c11-review-form.png" width="160"> | <img src="docs/e2e/c05-farmer-reviews.png" width="160"> |
| 予約リクエスト | 予約一覧 | レビュー投稿 | 生産者のレビュー |

| 生産者 | | | |
| --- | --- | --- | --- |
| <img src="docs/e2e/f01-home.png" width="160"> | <img src="docs/e2e/f03-reservations.png" width="160"> | <img src="docs/e2e/f04-request-detail.png" width="160"> | <img src="docs/e2e/f06-completed-rated.png" width="160"> |
| ホーム | 予約管理 | リクエスト詳細 | 受取完了・お客さま評価 |
| <img src="docs/e2e/f07-products.png" width="160"> | <img src="docs/e2e/f08-product-form.png" width="160"> | <img src="docs/e2e/f11-profile.png" width="160"> | <img src="docs/e2e/f10-reviews.png" width="160"> |
| 商品 | 商品の追加 | プロフィール | レビュー |

| 承認フロー | | |
| --- | --- | --- |
| <img src="docs/e2e/a02-pending.png" width="160"> | <img src="docs/e2e/a03-admin.png" width="160"> | <img src="docs/e2e/a04-approved.png" width="160"> |
| 新規登録 → 承認待ち | 運営が承認 | 公開中 |

スクリーンショットは Maestro の E2E で iOS シミュレータから取得したものです（`docs/e2e/`）。

## 技術スタック

| 領域 | 使用技術 |
| --- | --- |
| アプリ | Expo SDK 57 / React Native 0.86 / TypeScript / Expo Router（Tabs + Stack） |
| 地図 | Mapbox（`@rnmapbox/maps`）。トークン未設定でも空のスタイルでピンは動作 |
| バックエンド | Convex（スキーマ・クエリ・ミューテーション・ファイルストレージ） |
| UI | `@gorhom/bottom-sheet`, Reanimated, expo-image, Zen Kaku Gothic New / IBM Plex Mono |
| 状態 | Zustand（ロール・カゴ・絞り込み・トースト） |
| E2E | Maestro |

## セットアップ

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
```

1. **Convex** を起動: `npm run backend`（= `npx convex dev`）。アカウント無しなら `CONVEX_AGENT_MODE=anonymous npx convex dev` でローカル実行できます。`.env.local` に `EXPO_PUBLIC_CONVEX_URL` が書き込まれます。
2. **シード**: `npm run seed`。大阪の生産者 9 名（1 名は承認待ち）、商品、レビュー、予約のデモデータが入ります。
3. **Mapbox**: `.env.local` の `EXPO_PUBLIC_MAPBOX_TOKEN` に公開トークン（`pk.…`）を設定。
4. **ネイティブビルドで起動**（Mapbox は Expo Go では動きません）: `npx expo run:ios`。2 回目以降は `npx expo start --dev-client`。

起動すると 消費者 / 生産者（藤井農園デモ） / 生産者（新規登録） / 運営 を選ぶ画面になります。認証は固定のデモ ID です（`lib/convex.ts`）。

## 動作確認

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
npm run seed && npm run e2e   # Maestro: consumer → farmer → admin
```

iOS の Maestro は日本語入力ができないため、フロー内の入力は ASCII です。

## ディレクトリ構成

```
app/
  index.tsx                 起動時のロール選択
  admin.tsx                 運営: 生産者の承認
  consumer/
    (tabs)/                 map / reservations / cart / profile
    farmer/[id].tsx         生産者ページ
    product/[id].tsx        商品
    reservation/[id].tsx    予約詳細
    pay/[id].tsx            テスト決済（モーダル）
    review/[id].tsx         レビュー投稿（モーダル）
  farmer/
    (tabs)/                 home / reservations / products / reviews / profile
    reservation/[id].tsx    予約の確定・辞退・完了・発送
    product/[id].tsx        商品の追加・編集（モーダル）
components/                 FarmerMarker, FarmerBottomSheet, SearchPanel, FloatingCartBar, ProductCard, ReservationCard, ReviewCard, Stars, TabBar, ui
convex/                     schema, farmers, products, reservations, reviews, watches, users, images, seed
lib/                        theme（デザイントークン）, store（Zustand）, map, farmerView, useMyFarmer, convex（デモ ID）
e2e/                        Maestro フロー（consumer / farmer / admin）
docs/e2e/                   参照スクリーンショット
```

## データモデル（Convex）

- `users`: ロール、名前、電話、発送先、ひとこと
- `farmers`: `status`（pending / approved / rejected）, `pr` と `prMessage`, `ownerUserId`, 顔写真・こだわり・受取場所・`pickupSlots`（曜日 × 開始/終了時刻）・SNS・位置
- `products`: `harvestedToday`, `deliveryAvailable`, `stock`, `available`, `expectedAt`（出荷予定日）
- `reservations`: `status`（requested → confirmed → completed | declined | cancelled）, `method`（pickup / delivery）, `pickupAt` / `address`, `paymentStatus`（unpaid / paid）と `paymentMethod`（card / cash）, `carrier` / `trackingNumber`, 明細を埋め込み
- `reviews`: 消費者 → 生産者（公開）
- `consumerRatings`: 生産者 → 消費者（生産者間で参照）
- `watches`: 消費者が出荷予定の商品をウォッチ

## デモアカウント

| ロール | 名前 | 用途 |
| --- | --- | --- |
| 消費者 | 田中 花 | 地図から予約・レビュー |
| 生産者 | 藤井 翔（藤井農園） | 承認済み。予約・商品・レビューの管理 |
| 生産者（新規） | 新規の生産者 | プロフィール登録 → 承認待ち |
| 運営 | 運営 | 生産者の承認 |
