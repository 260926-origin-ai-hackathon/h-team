import { mutation } from "./_generated/server";

// Demo images: stable placeholder services. Replace with Convex File Storage
// uploads (avatarStorageId / imageStorageId) when real photos are available.
const face = (n: number) => `https://i.pravatar.cc/400?img=${n}`;
const photo = (seed: string, w = 900, h = 700) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const FARMERS = [
  {
    name: "山本 恵子",
    avatar: face(47),
    prefecture: "大阪府",
    city: "岸和田市",
    latitude: 34.4605,
    longitude: 135.3711,
    crops: ["水なす", "玉ねぎ"],
    bio: "泉州の海風が育てる、みずみずしい水なす。三代続く畑を守っています。",
    philosophy:
      "化学肥料をできるだけ減らし、海藻由来の堆肥で土をつくっています。収穫は必ず朝のうちに。皮の薄さと甘さが自慢です。",
    farms: ["yamamoto-1", "yamamoto-2", "yamamoto-3"],
    products: [
      { name: "泉州水なす 朝採り", price: 1280, unit: "6個", harvest: "毎朝5時収穫・当日発送", stock: 20, description: "生でかじれる甘さ。塩を軽くふるだけで十分です。", img: "nasu-1" },
      { name: "水なすの浅漬け", price: 980, unit: "3個入り", harvest: "収穫翌日に漬込み", stock: 15, description: "祖母の代から続く糠床で、ほんのり甘く仕上げました。", img: "nasu-2" },
      { name: "泉州玉ねぎ", price: 880, unit: "2kg", harvest: "5月収穫・貯蔵品", stock: 30, description: "辛みが少なく、スライスしてそのままサラダに。", img: "onion-1" },
    ],
  },
  {
    name: "田中 大輔",
    avatar: face(12),
    prefecture: "大阪府",
    city: "能勢町",
    latitude: 34.9707,
    longitude: 135.4168,
    crops: ["トマト", "栗"],
    bio: "能勢の山あいで、昼夜の寒暖差を活かしたトマトを育てています。",
    philosophy:
      "水を極限まで絞って甘さを引き出す栽培法。ひと株ひと株、実の数を制限して味を凝縮させています。",
    farms: ["tanaka-1", "tanaka-2"],
    products: [
      { name: "高糖度トマト", price: 1680, unit: "1kg", harvest: "完熟後に手摘み", stock: 12, description: "糖度9以上。フルーツのように食べられます。", img: "tomato-1" },
      { name: "ミニトマト ミックス", price: 1180, unit: "500g", harvest: "朝採り", stock: 25, description: "赤・黄・オレンジの3色。彩りと酸味のバランスが楽しめます。", img: "tomato-2" },
      { name: "能勢栗", price: 2200, unit: "1kg", harvest: "9〜10月限定", stock: 8, description: "大粒で甘みが強い銀寄。渋皮煮にどうぞ。", img: "kuri-1" },
    ],
  },
  {
    name: "佐藤 美咲",
    avatar: face(32),
    prefecture: "奈良県",
    city: "明日香村",
    latitude: 34.4726,
    longitude: 135.8207,
    crops: ["いちご", "米"],
    bio: "飛鳥の里山で、いちごとお米を育てています。子育てしながらの農業6年目。",
    philosophy:
      "農薬を使わず、天敵昆虫で害虫を抑えています。いちごは完熟してから摘むので、届く日にいちばん美味しい状態です。",
    farms: ["sato-1", "sato-2", "sato-3"],
    products: [
      { name: "古都華いちご", price: 1980, unit: "1パック", harvest: "完熟摘み・翌日着", stock: 10, description: "奈良生まれの品種。香りが強く、コクのある甘さ。", img: "ichigo-1" },
      { name: "ヒノヒカリ 新米", price: 2400, unit: "5kg", harvest: "10月収穫", stock: 40, description: "飛鳥川の水で育てた、粘りと甘みのあるお米です。", img: "rice-1" },
    ],
  },
  {
    name: "中村 健一",
    avatar: face(59),
    prefecture: "京都府",
    city: "亀岡市",
    latitude: 35.0134,
    longitude: 135.5735,
    crops: ["九条ねぎ", "小松菜"],
    bio: "京野菜ひと筋30年。霧の街・亀岡で葉物を育てています。",
    philosophy:
      "亀岡の朝霧が葉を柔らかくしてくれます。ねぎは何度も土寄せして、白い部分を長く甘く育てます。",
    farms: ["nakamura-1", "nakamura-2"],
    products: [
      { name: "九条ねぎ", price: 680, unit: "3束", harvest: "朝採り", stock: 30, description: "ぬめりと甘みが強い。鍋やうどんに。", img: "negi-1" },
      { name: "小松菜", price: 480, unit: "2束", harvest: "朝採り", stock: 30, description: "えぐみが少なく、お浸しでも炒めても。", img: "komatsuna-1" },
    ],
  },
  {
    name: "小林 直人",
    avatar: face(68),
    prefecture: "和歌山県",
    city: "有田市",
    latitude: 34.083,
    longitude: 135.1276,
    crops: ["みかん", "レモン"],
    bio: "有田川を見下ろす段々畑で、みかんとレモンを育てています。",
    philosophy:
      "石垣の段々畑は日当たりと水はけが抜群。摘果を徹底して、ひと玉ひと玉に養分を集中させています。",
    farms: ["kobayashi-1", "kobayashi-2", "kobayashi-3"],
    products: [
      { name: "有田みかん", price: 2800, unit: "5kg", harvest: "11〜12月", stock: 50, description: "皮が薄く、甘みと酸味のバランスが良い早生品種。", img: "mikan-1" },
      { name: "国産レモン", price: 1200, unit: "1kg", harvest: "10〜3月", stock: 20, description: "防カビ剤不使用。皮まで安心して使えます。", img: "lemon-1" },
    ],
  },
  {
    name: "渡辺 さくら",
    avatar: face(25),
    prefecture: "兵庫県",
    city: "丹波篠山市",
    latitude: 35.0757,
    longitude: 135.2192,
    crops: ["黒豆", "山の芋"],
    bio: "丹波篠山で黒豆と山の芋を育てる、就農3年目の新規就農者です。",
    philosophy:
      "先輩農家に教わりながら、昔ながらの手作業を大切に。黒豆は枝豆の時期がいちばん贅沢だと思っています。",
    farms: ["watanabe-1", "watanabe-2"],
    products: [
      { name: "丹波黒 枝豆", price: 1500, unit: "1kg 枝付き", harvest: "10月中旬〜下旬限定", stock: 15, description: "旬はたった2週間。大粒でコクのある甘みです。", img: "edamame-1" },
      { name: "丹波山の芋", price: 1800, unit: "1kg", harvest: "11月収穫", stock: 12, description: "驚くほどの粘り。とろろにすると箸で持ち上がります。", img: "yamanoimo-1" },
    ],
  },
  {
    name: "伊藤 涼",
    avatar: face(15),
    prefecture: "滋賀県",
    city: "高島市",
    latitude: 35.3528,
    longitude: 136.0353,
    crops: ["米", "アドベリー"],
    bio: "琵琶湖の北西、湧き水の里で米づくりをしています。",
    philosophy:
      "生きものと共に育てる田んぼ。除草剤を使わず、鴨や鯉の力を借りて草を抑えています。",
    farms: ["ito-1", "ito-2", "ito-3"],
    products: [
      { name: "コシヒカリ 湧き水米", price: 2600, unit: "5kg", harvest: "9月収穫", stock: 35, description: "冷めても甘い。おにぎりに最適です。", img: "rice-2" },
      { name: "アドベリージャム", price: 900, unit: "150g", harvest: "6月収穫の実を使用", stock: 20, description: "高島特産のベリー。甘酸っぱさが際立ちます。", img: "jam-1" },
    ],
  },
  {
    name: "高橋 奈々",
    avatar: face(44),
    prefecture: "大阪府",
    city: "羽曳野市",
    latitude: 34.5578,
    longitude: 135.6061,
    crops: ["ぶどう", "いちじく"],
    bio: "河内のぶどう畑で、デラウェアからシャインマスカットまで育てています。",
    philosophy:
      "袋掛けも摘粒もすべて手作業。ひと房を小さく仕立てて、粒の一つ一つに味をのせます。",
    farms: ["takahashi-1", "takahashi-2"],
    products: [
      { name: "シャインマスカット", price: 3200, unit: "1房 約600g", harvest: "8〜9月", stock: 10, description: "皮ごと食べられる、パリッとした食感と高い糖度。", img: "grape-1" },
      { name: "河内いちじく", price: 1400, unit: "6個", harvest: "8〜10月・完熟摘み", stock: 12, description: "とろけるような果肉。朝摘みをそのままお届けします。", img: "fig-1" },
    ],
  },
];

/** Wipe and re-seed farmers/products. Run with: npx convex run seed:run */
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    for (const table of ["orderItems", "orders", "farmerCollections", "products", "farmers"] as const) {
      const rows = await ctx.db.query(table).collect();
      for (const r of rows) await ctx.db.delete(r._id);
    }

    for (const f of FARMERS) {
      const farmerId = await ctx.db.insert("farmers", {
        name: f.name,
        avatarUrl: f.avatar,
        farmUrls: f.farms.map((s) => photo(s)),
        bio: f.bio,
        philosophy: f.philosophy,
        prefecture: f.prefecture,
        city: f.city,
        latitude: f.latitude,
        longitude: f.longitude,
        crops: f.crops,
      });
      for (const p of f.products) {
        await ctx.db.insert("products", {
          farmerId,
          name: p.name,
          imageUrl: photo(p.img, 800, 800),
          description: p.description,
          price: p.price,
          unit: p.unit,
          harvest: p.harvest,
          stock: p.stock,
          available: true,
        });
      }
    }
    return { farmers: FARMERS.length };
  },
});
