import { mutation } from "./_generated/server";

// Demo images: stable placeholder services. Replace with Convex File Storage
// uploads (avatarStorageId / imageStorageId) when real photos are available.
const face = (n: number) => `https://i.pravatar.cc/400?img=${n}`;
const photo = (seed: string, w = 900, h = 700) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

type SeedProduct = {
  name: string;
  unit: string;
  price: number;
  description: string;
  harvest: string;
  harvestedToday?: boolean;
  stock: number;
  img: string;
};

type SeedFarmer = {
  name: string;
  kana: string;
  farmName: string;
  face: number;
  tint: string;
  prefecture: string;
  city: string;
  latitude: number;
  longitude: number;
  crops: string[];
  years: number;
  season: string;
  seasonState: "now" | "soon" | "off";
  catchphrase: string;
  bio: string;
  kodawari: { title: string; body: string }[];
  farms: string[];
  products: SeedProduct[];
};

const FARMERS: SeedFarmer[] = [
  {
    name: "山本 和也", kana: "やまもと かずや", farmName: "山本農園", face: 12, tint: "#F0E4F1",
    prefecture: "大阪府", city: "貝塚市", latitude: 34.43, longitude: 135.36,
    crops: ["水なす"], years: 21, season: "5〜9月", seasonState: "now",
    catchphrase: "手でしぼれば水がしたたる、泉州の水なす。",
    bio: "泉州の海風が育てる、みずみずしい水なす。三代続く畑を守っています。",
    kodawari: [
      { title: "皮が薄いまま育てる", body: "風で実が傷つかないよう、一本ずつ枝を誘引しています。" },
      { title: "朝どれを浅漬けに", body: "収穫した日のうちに、ぬか漬けに仕込みます。" },
      { title: "地下水を使う", body: "井戸水をたっぷり与えて、みずみずしさを保ちます。" },
    ],
    farms: ["yamamoto-1", "yamamoto-2", "yamamoto-3"],
    products: [
      { name: "泉州水なす", unit: "5本", price: 1280, description: "生でもかじれる、アクの少ない水なす。サラダや浅漬けに。", harvest: "毎朝5時収穫・当日発送", harvestedToday: true, stock: 3, img: "nasu-1" },
      { name: "水なすぬか漬け", unit: "3本", price: 1500, description: "自家製のぬか床で漬けた、食べ頃の浅漬け。", harvest: "収穫翌日に漬込み", stock: 15, img: "nasu-2" },
      { name: "なす食べ比べ", unit: "4種・8本", price: 1800, description: "水なす、長なす、白なすなどの詰め合わせ。", harvest: "朝採り", stock: 10, img: "nasu-3" },
    ],
  },
  {
    name: "森 早苗", kana: "もり さなえ", farmName: "森農園", face: 47, tint: "#F3EBD6",
    prefecture: "大阪府", city: "泉佐野市", latitude: 34.39, longitude: 135.31,
    crops: ["玉ねぎ"], years: 28, season: "4〜6月", seasonState: "off",
    catchphrase: "かじると甘い、泉州の新玉ねぎ。",
    bio: "泉佐野の畑で、吊り玉干しの玉ねぎを28年育てています。",
    kodawari: [
      { title: "吊り玉干し", body: "収穫した玉ねぎを小屋に吊るし、風で乾かします。" },
      { title: "有機肥料", body: "魚粉と米ぬかの肥料で、甘みを引き出しています。" },
      { title: "早生から晩生まで", body: "品種を変えて、春から初夏まで出荷します。" },
    ],
    farms: ["mori-1", "mori-2"],
    products: [
      { name: "新玉ねぎ", unit: "3kg", price: 1600, description: "辛みが少なく、スライスしてそのまま食べられます。", harvest: "5月収穫", stock: 30, img: "onion-1" },
      { name: "吊り玉ねぎ", unit: "5kg", price: 2200, description: "乾燥させて日持ちするタイプ。", harvest: "貯蔵品", stock: 2, img: "onion-2" },
      { name: "玉ねぎドレッシング", unit: "300ml", price: 780, description: "すりおろし玉ねぎたっぷりのドレッシング。", harvest: "通年", stock: 40, img: "dressing-1" },
    ],
  },
  {
    name: "岡田 学", kana: "おかだ まなぶ", farmName: "岡田農園", face: 59, tint: "#F5E3E6",
    prefecture: "大阪府", city: "羽曳野市", latitude: 34.55, longitude: 135.61,
    crops: ["いちじく"], years: 14, season: "8〜10月", seasonState: "now",
    catchphrase: "木で熟した、とろける甘さ。",
    bio: "河内のいちじく畑で、樹上完熟にこだわって育てています。",
    kodawari: [
      { title: "樹上完熟", body: "割れ始める直前まで木に残し、早朝に収穫します。" },
      { title: "一文字仕立て", body: "低く横に広げた枝で、日当たりを揃えています。" },
      { title: "当日発送", body: "傷みやすいので、朝採りをその日に発送します。" },
    ],
    farms: ["okada-1", "okada-2"],
    products: [
      { name: "朝採りいちじく", unit: "8玉", price: 2000, description: "桝井ドーフィン種。皮ごと食べられます。", harvest: "早朝収穫・当日発送", harvestedToday: true, stock: 2, img: "fig-1" },
      { name: "いちじくジャム", unit: "150g", price: 850, description: "赤ワインを少し加えて煮た、粒感のあるジャム。", harvest: "旬の実を使用", stock: 25, img: "jam-1" },
      { name: "ドライいちじく", unit: "80g", price: 700, description: "低温でゆっくり乾燥させました。", harvest: "通年", stock: 20, img: "dryfig-1" },
    ],
  },
  {
    name: "西川 あゆみ", kana: "にしかわ あゆみ", farmName: "西川農園", face: 32, tint: "#ECE4F3",
    prefecture: "大阪府", city: "柏原市", latitude: 34.58, longitude: 135.64,
    crops: ["ぶどう"], years: 10, season: "6〜9月", seasonState: "now",
    catchphrase: "山の斜面で育つ、大阪ぶどう。",
    bio: "柏原の急斜面で、デラウェアからシャインマスカットまで育てています。",
    kodawari: [
      { title: "急斜面の畑", body: "水はけのよい斜面で、実がしまります。" },
      { title: "一房ずつ袋がけ", body: "雨や虫から守るため、手作業で袋をかけます。" },
      { title: "ワイナリーとの協働", body: "規格外の実はワインに生まれ変わります。" },
    ],
    farms: ["nishikawa-1", "nishikawa-2", "nishikawa-3"],
    products: [
      { name: "デラウェア", unit: "1kg", price: 1800, description: "種なしで食べやすい、夏のデラウェア。", harvest: "朝採り", harvestedToday: true, stock: 12, img: "grape-1" },
      { name: "シャインマスカット", unit: "1房", price: 2800, description: "皮ごと食べられる大粒のぶどう。", harvest: "8〜9月", stock: 3, img: "grape-2" },
      { name: "ぶどうジュース", unit: "500ml", price: 1200, description: "デラウェアを搾った濃いジュース。", harvest: "通年", stock: 30, img: "juice-1" },
    ],
  },
  {
    name: "大西 隆", kana: "おおにし たかし", farmName: "大西農園", face: 68, tint: "#F4EBD9",
    prefecture: "大阪府", city: "能勢町", latitude: 34.97, longitude: 135.42,
    crops: ["栗"], years: 33, season: "9〜10月", seasonState: "now",
    catchphrase: "大粒の「銀寄」を、能勢の山から。",
    bio: "銀寄栗のふるさと能勢で、古木を守りながら栗を育てています。",
    kodawari: [
      { title: "原産地の銀寄", body: "能勢は銀寄栗のふるさと。古木を大切に守っています。" },
      { title: "落ちた実だけ拾う", body: "自然に落ちたものを、毎朝拾い集めます。" },
      { title: "低温で追熟", body: "0度で寝かせ、甘みを引き出してから出荷します。" },
    ],
    farms: ["onishi-1", "onishi-2"],
    products: [
      { name: "銀寄 生栗", unit: "1kg", price: 2600, description: "ひと粒30gを超える大粒の栗。", harvest: "毎朝拾い集め", harvestedToday: true, stock: 4, img: "kuri-1" },
      { name: "栗の渋皮煮", unit: "300g", price: 1600, description: "渋皮ごとゆっくり煮含めました。", harvest: "秋の栗を使用", stock: 15, img: "kuri-2" },
      { name: "栗ごはんセット", unit: "2合用", price: 980, description: "むき栗と炊き込みだし入り。", harvest: "通年", stock: 20, img: "kuri-3" },
    ],
  },
  {
    name: "藤井 翔", kana: "ふじい しょう", farmName: "藤井農園", face: 15, tint: "#E2EFE3",
    prefecture: "大阪府", city: "八尾市", latitude: 34.63, longitude: 135.6,
    crops: ["若ごぼう"], years: 6, season: "2〜4月", seasonState: "off",
    catchphrase: "葉も茎も食べる、春の若ごぼう。",
    bio: "祖父の畑を継いで6年目。八尾の若ごぼうを育てています。",
    kodawari: [
      { title: "葉から根まで", body: "茎と葉のほろ苦さが、春の味です。" },
      { title: "柔らかく育てる", body: "土を深く耕して、根をまっすぐ伸ばします。" },
      { title: "若手のバトン", body: "祖父の畑を継いで6年目です。" },
    ],
    farms: ["fujii-1", "fujii-2"],
    products: [
      { name: "八尾の若ごぼう", unit: "3束", price: 1100, description: "葉・茎・根をまるごと。炒め物やきんぴらに。", harvest: "2〜4月", stock: 10, img: "gobo-1" },
      { name: "若ごぼう佃煮", unit: "100g", price: 680, description: "ご飯に合う甘辛い佃煮。", harvest: "通年", stock: 30, img: "gobo-2" },
      { name: "春野菜セット", unit: "6〜8品", price: 2400, description: "若ごぼうと季節の葉物の詰め合わせ。", harvest: "朝採り", stock: 8, img: "veg-1" },
    ],
  },
  {
    name: "中島 文子", kana: "なかじま ふみこ", farmName: "中島農園", face: 44, tint: "#F5E8DE",
    prefecture: "大阪府", city: "富田林市", latitude: 34.49, longitude: 135.6,
    crops: ["海老芋"], years: 40, season: "11〜1月", seasonState: "off",
    catchphrase: "煮崩れしない、ねっとりとした海老芋。",
    bio: "親子二代で40年、富田林の畑で海老芋を育てています。",
    kodawari: [
      { title: "土寄せを重ねる", body: "何度も土をかぶせて、えびのような形に育てます。" },
      { title: "石川の水", body: "近くを流れる石川の水を引いています。" },
      { title: "40年の経験", body: "親子二代で、同じ畑を守っています。" },
    ],
    farms: ["nakajima-1", "nakajima-2"],
    products: [
      { name: "海老芋", unit: "1kg", price: 2200, description: "煮物にするとねっとりと甘い、冬の里芋。", harvest: "11月収穫", stock: 12, img: "ebiimo-1" },
      { name: "海老芋 下ごしらえ済み", unit: "500g", price: 1400, description: "皮をむいて下茹でしてあります。", harvest: "収穫後に加工", stock: 10, img: "ebiimo-2" },
      { name: "冬の根菜セット", unit: "5〜6品", price: 2600, description: "海老芋と冬の根菜の詰め合わせ。", harvest: "朝採り", stock: 6, img: "veg-2" },
    ],
  },
  {
    name: "吉田 修", kana: "よしだ おさむ", farmName: "吉田農園", face: 60, tint: "#EDF1DD",
    prefecture: "大阪府", city: "高槻市 樫田", latitude: 34.92, longitude: 135.57,
    crops: ["米"], years: 25, season: "10〜11月", seasonState: "soon",
    catchphrase: "山あいの棚田で、冷たい水で育つ米。",
    bio: "高槻・樫田の棚田で、はざかけ天日干しの米を作っています。",
    kodawari: [
      { title: "棚田の米", body: "寒暖差の大きい山あいで、粒がしまります。" },
      { title: "はざかけ", body: "刈った稲を天日で2週間ほど干します。" },
      { title: "減農薬", body: "除草は手作業と機械を組み合わせています。" },
    ],
    farms: ["yoshida-1", "yoshida-2", "yoshida-3"],
    products: [
      { name: "樫田のお米 白米", unit: "5kg", price: 3600, description: "はざかけ天日干しのヒノヒカリ。", harvest: "10月収穫", stock: 40, img: "rice-1" },
      { name: "玄米", unit: "5kg", price: 3300, description: "同じ棚田のお米を玄米のままで。", harvest: "10月収穫", stock: 30, img: "rice-2" },
      { name: "お餅", unit: "8個", price: 900, description: "もち米を杵でついた、昔ながらのお餅。", harvest: "年末につきたて", stock: 20, img: "mochi-1" },
    ],
  },
  {
    name: "松田 恵", kana: "まつだ めぐみ", farmName: "松田農園", face: 25, tint: "#DFEFE6",
    prefecture: "大阪府", city: "岸和田市", latitude: 34.43, longitude: 135.44,
    crops: ["春菊"], years: 12, season: "10〜3月", seasonState: "soon",
    catchphrase: "生で食べられる、香りやさしい春菊。",
    bio: "岸和田で、サラダで食べられる大葉の春菊を育てています。",
    kodawari: [
      { title: "大葉の品種", body: "葉が大きくやわらかい品種を選んでいます。" },
      { title: "摘み取り収穫", body: "伸びた脇芽を摘んで、何度も収穫します。" },
      { title: "サラダ向け", body: "苦みが少ないので、生のままサラダに。" },
    ],
    farms: ["matsuda-1", "matsuda-2"],
    products: [
      { name: "サラダ春菊", unit: "200g×2", price: 680, description: "生で食べられる、やわらかい春菊。", harvest: "朝採り", stock: 20, img: "shungiku-1" },
      { name: "冬の鍋野菜セット", unit: "5品", price: 1800, description: "春菊、水菜、ねぎなど鍋に合う野菜。", harvest: "朝採り", stock: 10, img: "veg-3" },
      { name: "春菊ジェノベーゼ", unit: "120g", price: 980, description: "春菊とくるみで作ったソース。", harvest: "通年", stock: 15, img: "sauce-1" },
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

    let no = 1;
    for (const f of FARMERS) {
      const farmerId = await ctx.db.insert("farmers", {
        no: no++,
        name: f.name,
        kana: f.kana,
        farmName: f.farmName,
        avatarUrl: face(f.face),
        farmUrls: f.farms.map((s) => photo(s)),
        catchphrase: f.catchphrase,
        bio: f.bio,
        kodawari: f.kodawari,
        years: f.years,
        season: f.season,
        seasonState: f.seasonState,
        tint: f.tint,
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
          harvestedToday: p.harvestedToday ?? false,
          stock: p.stock,
          available: true,
        });
      }
    }
    return { farmers: FARMERS.length };
  },
});
