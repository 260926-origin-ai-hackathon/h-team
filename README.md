# はたけカード — Farmer Cards

地図から生産者を見つけて、買うとその農家のカードが図鑑に集まる農産物EC（ハッカソン用）。

Expo (React Native / TypeScript / Expo Router) + Mapbox + Convex。
UI は claude.ai/design の「Farm Card App v2」（Map Options 案 3）に沿っています。

## セットアップ

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
```

1. **Convex**: `npm run backend`（= `npx convex dev`）を実行してログイン／プロジェクト作成。
   表示される Deployment URL を `.env.local` の `EXPO_PUBLIC_CONVEX_URL` に入れる。
   `convex/_generated` は dev 起動時に自動で再生成されます。
2. **シード投入**: `npm run seed`（= `npx convex run seed:run`）。大阪の生産者 9 名と商品が入ります。
3. **Mapbox**: `.env.local` に `EXPO_PUBLIC_MAPBOX_TOKEN`（pk.…）と `MAPBOX_DOWNLOAD_TOKEN`（sk.… / DOWNLOADS:READ）を設定。
4. **ネイティブビルド**（Mapbox は Expo Go では動きません）:

```bash
npx expo run:ios      # または npx expo run:android
```

以降は `npx expo start --dev-client` で起動できます。

## 構成

```
app/                Expo Router の画面
  index.tsx         地図（ホーム）: ピン → シート → 商品
  collection.tsx    生産者図鑑（2列カード）
  cart.tsx          カート → 疑似決済 → カード獲得演出
  farmer/[id].tsx   生産者詳細（01 人 → 02 農園 → 03 商品）
  product/[id].tsx  商品詳細
  card/[id].tsx     カード詳細（重なった所持カード・また買う）
components/         FarmerMarker / FarmerBottomSheet / FarmerCard / BigFarmerCard / CardRevealModal ほか
convex/             schema, farmers, products, orders, collections, seed
lib/                theme（デザイントークン）, store（Zustand: cart / selection / filter / reveal）, map, farmerView
```

## 仕様メモ

- 未購入の生産者もプロフィール閲覧・購入は制限しない（ゲーム性は CV を妨げない）。
  地図では顔をぼかし・彩度を落とし・点線リング＋鍵で「未解放」を表現。
- 購入すると `orders` / `orderItems` を作成し `farmerCollections` を upsert。
  1 回の購入ごとにカード 1 枚（`purchaseCount`）。初回はカード解放。
- 決済は疑似（`api.orders.create` が即成功）。送料は農家ごと ¥880。
- ユーザーは固定の `DEMO_USER_ID`（`lib/convex.ts`）。
- 画像はシードでは外部プレースホルダ URL。実写真は Convex File Storage に上げて
  `avatarStorageId` / `farmStorageIds` / `imageStorageId` に入れると優先されます。

## E2E（Maestro）

シミュレータに dev build を入れ、Metro と Convex を起動した状態で:

```bash
npm run seed                 # DB をリセット
npm run e2e                  # e2e/farmer-flow.yaml: 地図 → ピン → シート → 生産者 → 商品 → カート → 購入 → カード獲得 → 図鑑 → カード詳細
```

スクリーンショットは `e2e/shots/` に出力されます（確認用の縮小版は `docs/e2e/`）。
Mapbox トークン未設定でもオフラインの空スタイルでピンは動作します（タイルは表示されません）。
