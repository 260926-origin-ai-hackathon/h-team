import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

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
  delivery?: boolean;
  stock: number;
  img: string;
  /** 出荷予定（未公開）: 何日後に出荷予定か */
  upcomingInDays?: number;
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
  pickupAddress: string;
  pickupSlots: { days: number[]; start: number; end: number }[];
  pickupNote?: string;
  prMessage?: string;
  pr?: boolean;
  status?: "pending" | "approved";
  owner?: string;
  sns?: { instagram?: string; x?: string; website?: string };
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
    pickupAddress: "大阪府貝塚市小瀬 山本農園 直売所",
    pickupSlots: [{ days: [2, 4, 6], start: 9, end: 12 }],
    sns: { instagram: "yamamoto_farm_senshu", website: "https://example.com/yamamoto" },
    farms: ["yamamoto-1", "yamamoto-2", "yamamoto-3"],
    products: [
      { name: "泉州水なす", unit: "5本", price: 1280, description: "生でもかじれる、アクの少ない水なす。サラダや浅漬けに。", harvest: "毎朝5時収穫・当日発送", harvestedToday: true, stock: 3, img: "nasu-1" },
      { name: "水なすぬか漬け", delivery: true, unit: "3本", price: 1500, description: "自家製のぬか床で漬けた、食べ頃の浅漬け。", harvest: "収穫翌日に漬込み", stock: 15, img: "nasu-2" },
      { name: "なす食べ比べ", unit: "4種・8本", price: 1800, description: "水なす、長なす、白なすなどの詰め合わせ。", harvest: "朝採り", stock: 10, img: "nasu-3" },
      { name: "秋なす", unit: "6本", price: 1100, description: "皮が柔らかい秋の水なす。", harvest: "10月上旬出荷予定", stock: 20, img: "nasu-aki", upcomingInDays: 12 },
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
    pickupAddress: "大阪府泉佐野市日根野 森農園 作業小屋前",
    pickupSlots: [{ days: [1, 2, 3, 4, 5, 6], start: 8, end: 11 }],
    sns: { instagram: "mori_onion" },
    farms: ["mori-1", "mori-2"],
    products: [
      { name: "新玉ねぎ", unit: "3kg", price: 1600, description: "辛みが少なく、スライスしてそのまま食べられます。", harvest: "5月収穫", stock: 30, img: "onion-1" },
      { name: "吊り玉ねぎ", delivery: true, unit: "5kg", price: 2200, description: "乾燥させて日持ちするタイプ。", harvest: "貯蔵品", stock: 2, img: "onion-2" },
      { name: "玉ねぎドレッシング", delivery: true, unit: "300ml", price: 780, description: "すりおろし玉ねぎたっぷりのドレッシング。", harvest: "通年", stock: 40, img: "dressing-1" },
      { name: "赤玉ねぎ", unit: "2kg", price: 1200, description: "サラダ向けの赤玉ねぎ。", harvest: "5月出荷予定", stock: 30, img: "onion-red", upcomingInDays: 40 },
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
    pickupAddress: "大阪府羽曳野市駒ヶ谷 岡田農園",
    pickupSlots: [{ days: [0, 6], start: 9, end: 15 }],
    pickupNote: "8〜10月は朝採りが並びます。駐車 2 台可。",
    pr: true,
    prMessage: "今週末は朝採りいちじくを多めに用意します。駐車場あり、ご家族でどうぞ。",
    sns: { instagram: "okada_fig", x: "okada_fig" },
    farms: ["okada-1", "okada-2"],
    products: [
      { name: "朝採りいちじく", unit: "8玉", price: 2000, description: "桝井ドーフィン種。皮ごと食べられます。", harvest: "早朝収穫・当日発送", harvestedToday: true, stock: 2, img: "fig-1" },
      { name: "いちじくジャム", delivery: true, unit: "150g", price: 850, description: "赤ワインを少し加えて煮た、粒感のあるジャム。", harvest: "旬の実を使用", stock: 25, img: "jam-1" },
      { name: "ドライいちじく", delivery: true, unit: "80g", price: 700, description: "低温でゆっくり乾燥させました。", harvest: "通年", stock: 20, img: "dryfig-1" },
      { name: "いちじく（初もの）", unit: "6玉", price: 1800, description: "今季最初の収穫分。", harvest: "来週出荷予定", stock: 15, img: "fig-first", upcomingInDays: 6 },
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
    pickupAddress: "大阪府柏原市大県 西川農園 直売テント",
    pickupSlots: [{ days: [5, 6, 0], start: 10, end: 16 }],
    pr: true,
    prMessage: "シャインマスカットの予約受付中。斜面の畑の見学もできます。",
    sns: { instagram: "nishikawa_grapes" },
    farms: ["nishikawa-1", "nishikawa-2", "nishikawa-3"],
    products: [
      { name: "デラウェア", unit: "1kg", price: 1800, description: "種なしで食べやすい、夏のデラウェア。", harvest: "朝採り", harvestedToday: true, stock: 12, img: "grape-1" },
      { name: "シャインマスカット", unit: "1房", price: 2800, description: "皮ごと食べられる大粒のぶどう。", harvest: "8〜9月", stock: 3, img: "grape-2" },
      { name: "ぶどうジュース", delivery: true, unit: "500ml", price: 1200, description: "デラウェアを搾った濃いジュース。", harvest: "通年", stock: 30, img: "juice-1" },
      { name: "巨峰", unit: "1房", price: 2200, description: "香り高い巨峰。", harvest: "9月中旬出荷予定", stock: 10, img: "grape-kyoho", upcomingInDays: 9 },
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
    pickupAddress: "大阪府豊能郡能勢町 大西農園",
    pickupSlots: [{ days: [0, 6], start: 10, end: 15 }],
    pickupNote: "栗の時期のみ受取可。",
    farms: ["onishi-1", "onishi-2"],
    products: [
      { name: "銀寄 生栗", unit: "1kg", price: 2600, description: "ひと粒30gを超える大粒の栗。", harvest: "毎朝拾い集め", harvestedToday: true, stock: 4, img: "kuri-1" },
      { name: "栗の渋皮煮", delivery: true, unit: "300g", price: 1600, description: "渋皮ごとゆっくり煮含めました。", harvest: "秋の栗を使用", stock: 15, img: "kuri-2" },
      { name: "栗ごはんセット", delivery: true, unit: "2合用", price: 980, description: "むき栗と炊き込みだし入り。", harvest: "通年", stock: 20, img: "kuri-3" },
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
    pickupAddress: "大阪府八尾市恩智 藤井農園 母屋前",
    pickupSlots: [{ days: [3, 6], start: 9, end: 12 }],
    pickupNote: "インターホンを押してください。",
    owner: "demo-farmer",
    sns: { instagram: "fujii_gobo", website: "https://example.com/fujii" },
    farms: ["fujii-1", "fujii-2"],
    products: [
      { name: "八尾の若ごぼう", unit: "3束", price: 1100, description: "葉・茎・根をまるごと。炒め物やきんぴらに。", harvest: "2〜4月", stock: 10, img: "gobo-1" },
      { name: "若ごぼう佃煮", delivery: true, unit: "100g", price: 680, description: "ご飯に合う甘辛い佃煮。", harvest: "通年", stock: 30, img: "gobo-2" },
      { name: "春野菜セット", unit: "6〜8品", price: 2400, description: "若ごぼうと季節の葉物の詰め合わせ。", harvest: "朝採り", stock: 8, img: "veg-1" },
      { name: "若ごぼう（来季）", unit: "3束", price: 1100, description: "来春の若ごぼう。予約受付前にお知らせします。", harvest: "2月上旬出荷予定", stock: 40, img: "gobo-next", upcomingInDays: 30 },
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
    pickupAddress: "大阪府富田林市板持 中島農園",
    pickupSlots: [{ days: [6], start: 9, end: 12 }],
    farms: ["nakajima-1", "nakajima-2"],
    products: [
      { name: "海老芋", delivery: true, unit: "1kg", price: 2200, description: "煮物にするとねっとりと甘い、冬の里芋。", harvest: "11月収穫", stock: 12, img: "ebiimo-1" },
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
    pickupAddress: "大阪府高槻市樫田 吉田農園 精米所",
    pickupSlots: [{ days: [0], start: 10, end: 15 }],
    sns: { x: "yoshida_rice" },
    farms: ["yoshida-1", "yoshida-2", "yoshida-3"],
    products: [
      { name: "樫田のお米 白米", delivery: true, unit: "5kg", price: 3600, description: "はざかけ天日干しのヒノヒカリ。", harvest: "10月収穫", stock: 40, img: "rice-1" },
      { name: "玄米", delivery: true, unit: "5kg", price: 3300, description: "同じ棚田のお米を玄米のままで。", harvest: "10月収穫", stock: 30, img: "rice-2" },
      { name: "お餅", delivery: true, unit: "8個", price: 900, description: "もち米を杵でついた、昔ながらのお餅。", harvest: "年末につきたて", stock: 20, img: "mochi-1" },
      { name: "新米（今年）", unit: "5kg", price: 3600, description: "今年の新米。", harvest: "10月上旬出荷予定", stock: 60, img: "rice-new", upcomingInDays: 14 },
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
    pickupAddress: "大阪府岸和田市三田町 松田農園",
    pickupSlots: [{ days: [2, 5], start: 9, end: 11 }],
    status: "pending",
    farms: ["matsuda-1", "matsuda-2"],
    products: [
      { name: "サラダ春菊", unit: "200g×2", price: 680, description: "生で食べられる、やわらかい春菊。", harvest: "朝採り", stock: 20, img: "shungiku-1" },
      { name: "冬の鍋野菜セット", unit: "5品", price: 1800, description: "春菊、水菜、ねぎなど鍋に合う野菜。", harvest: "朝採り", stock: 10, img: "veg-3" },
      { name: "春菊ジェノベーゼ", delivery: true, unit: "120g", price: 980, description: "春菊とくるみで作ったソース。", harvest: "通年", stock: 15, img: "sauce-1" },
    ],
  },
];

const USERS = [
  { userId: "demo-consumer", name: "田中 花", role: "consumer" as const, phone: "090-1234-5678", address: "大阪市北区中之島1-1-1", bio: "野菜好き。週末に畑まで取りに行くのが楽しみです。" },
  { userId: "consumer-sasaki", name: "佐々木 健", role: "consumer" as const },
  { userId: "consumer-kobayashi", name: "小林 美月", role: "consumer" as const },
  { userId: "demo-farmer", name: "藤井 翔", role: "farmer" as const },
  { userId: "demo-farmer-new", name: "新規の生産者", role: "farmer" as const },
  { userId: "demo-admin", name: "運営", role: "admin" as const },
];

const REVIEWS: Record<string, [string, number, string, number][]> = {
  // farmer name → [author userId, rating, comment, days ago]
  "山本 和也": [["consumer-sasaki", 5, "取りに行ったら畑も見せてもらえました。水なすは本当に生でいけます。", 3], ["consumer-kobayashi", 4, "受取場所が分かりやすく、時間どおりに用意されていました。", 12], ["demo-consumer", 5, "ぬか漬けが絶品。子どもも食べました。", 30]],
  "森 早苗": [["consumer-kobayashi", 4, "新玉ねぎが甘くて驚きました。発送も丁寧。", 8]],
  "岡田 学": [["demo-consumer", 5, "朝採りいちじく、その日の夜に食べたら香りが違いました。", 2], ["consumer-sasaki", 5, "駐車場ありで受取が楽。おまけもいただきました。", 15], ["consumer-kobayashi", 4, "ジャムをリピート中。", 40]],
  "西川 あゆみ": [["consumer-sasaki", 5, "シャインマスカットが房ごと立派。斜面の畑の話が面白かった。", 5], ["consumer-kobayashi", 5, "予約から受取までスムーズでした。", 20]],
  "大西 隆": [["demo-consumer", 4, "栗が大粒。時期限定なので次も予約します。", 6]],
  "藤井 翔": [["demo-consumer", 5, "若ごぼうの食べ方まで教えてもらえました。", 1], ["consumer-sasaki", 4, "受取時間の案内が丁寧。", 10]],
  "中島 文子": [["consumer-kobayashi", 5, "海老芋の煮物が最高でした。", 9]],
  "吉田 修": [["consumer-sasaki", 5, "はざかけ米、冷めても美味しい。発送対応が助かります。", 4], ["demo-consumer", 4, "精米したてを受け取れました。", 25]],
};

const DAY = 24 * 60 * 60 * 1000;
const JST = 9 * 60 * 60 * 1000;
/** Next (or, with negative `dir`, previous) JST date whose weekday is in `days`, at `hour` JST. Server runs in UTC. */
const slotAt = (days: number[], hour: number, dir: 1 | -1 = 1, skip = 0) => {
  const d = new Date(Date.now() + JST); // "JST clock" expressed via UTC getters
  d.setUTCHours(hour, 0, 0, 0);
  let found = -1;
  for (let i = 1; i <= 21; i++) {
    d.setUTCDate(d.getUTCDate() + dir);
    if (days.includes(d.getUTCDay())) {
      found++;
      if (found === skip) break;
    }
  }
  return d.getTime() - JST;
};

/** Wipe and re-seed everything. Run with: npx convex run seed:run */
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    for (const table of ["watches", "consumerRatings", "reviews", "reservations", "products", "farmers", "users"] as const) {
      const rows = await ctx.db.query(table).collect();
      for (const r of rows) await ctx.db.delete(r._id);
    }
    for (const u of USERS) await ctx.db.insert("users", u);

    const farmerIds: Record<string, Id<"farmers">> = {};
    const productIds: Record<string, Id<"products">> = {};
    const now = Date.now();

    for (const f of FARMERS) {
      const farmerId = await ctx.db.insert("farmers", {
        ownerUserId: f.owner,
        status: f.status ?? "approved",
        pr: f.pr ?? false,
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
        pickupAddress: f.pickupAddress,
        pickupSlots: f.pickupSlots,
        pickupNote: f.pickupNote,
        prMessage: f.prMessage,
        sns: f.sns,
      });
      farmerIds[f.name] = farmerId;
      for (const p of f.products) {
        productIds[p.name] = await ctx.db.insert("products", {
          farmerId,
          name: p.name,
          imageUrl: photo(p.img, 800, 800),
          description: p.description,
          price: p.price,
          unit: p.unit,
          harvest: p.harvest,
          harvestedToday: p.harvestedToday ?? false,
          deliveryAvailable: p.delivery ?? false,
          stock: p.stock,
          available: !p.upcomingInDays,
          expectedAt: p.upcomingInDays ? now + p.upcomingInDays * DAY : undefined,
        });
      }
      for (const [userId, rating, comment, daysAgo] of REVIEWS[f.name] ?? []) {
        const user = USERS.find((u) => u.userId === userId)!;
        await ctx.db.insert("reviews", { farmerId, userId, authorName: user.name, rating, comment, createdAt: now - daysAgo * DAY });
      }
    }

    // 予約（デモ用）
    const mk = async (
      userId: string,
      farmer: string,
      status: "requested" | "confirmed" | "completed" | "declined" | "cancelled",
      method: "pickup" | "delivery",
      items: [string, number][],
      pickupAt: number | undefined,
      createdDaysAgo: number,
      extra: Partial<{ address: string; note: string; consumerReviewed: boolean; farmerReviewed: boolean; paid: "card" | "cash" | false; trackingNumber: string }> = {},
    ) => {
      const lines = [];
      for (const [name, quantity] of items) {
        const p = await ctx.db.get(productIds[name]);
        if (!p) continue;
        lines.push({ productId: p._id, name: p.name, unit: p.unit, price: p.price, quantity });
      }
      const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
      const shipping = method === "delivery" ? 880 : 0;
      return ctx.db.insert("reservations", {
        userId,
        farmerId: farmerIds[farmer],
        status,
        method,
        pickupAt,
        address: extra.address,
        note: extra.note,
        items: lines,
        subtotal,
        shipping,
        total: subtotal + shipping,
        paymentStatus: extra.paid === false ? "unpaid" : "paid",
        paymentMethod: extra.paid === false ? undefined : (extra.paid ?? "card"),
        paidAt: extra.paid === false ? undefined : now - createdDaysAgo * DAY,
        carrier: method === "delivery" && status === "completed" ? "ヤマト運輸" : undefined,
        trackingNumber: extra.trackingNumber,
        createdAt: now - createdDaysAgo * DAY,
        updatedAt: now - createdDaysAgo * DAY,
        consumerReviewed: extra.consumerReviewed ?? false,
        farmerReviewed: extra.farmerReviewed ?? false,
      });
    };

    // demo-consumer（消費者デモ）
    await mk("demo-consumer", "岡田 学", "confirmed", "pickup", [["朝採りいちじく", 1]], slotAt([0, 6], 10), 1, { note: "10時ごろ伺います", paid: false });
    await mk("demo-consumer", "藤井 翔", "completed", "pickup", [["八尾の若ごぼう", 2]], slotAt([3, 6], 10, -1), 5, { consumerReviewed: true, farmerReviewed: true, paid: "cash" });
    await mk("demo-consumer", "吉田 修", "completed", "delivery", [["樫田のお米 白米", 1]], undefined, 20, { address: "大阪市北区中之島1-1-1", consumerReviewed: true, trackingNumber: "4123-4567-8901" });
    const toReview = await mk("demo-consumer", "大西 隆", "completed", "pickup", [["銀寄 生栗", 1]], slotAt([0, 6], 11, -1), 4);
    // 藤井農園（生産者デモ）への予約
    await mk("consumer-sasaki", "藤井 翔", "requested", "pickup", [["八尾の若ごぼう", 1], ["若ごぼう佃煮", 2]], slotAt([3, 6], 9), 0, { note: "初めて伺います。", paid: false });
    await mk("consumer-kobayashi", "藤井 翔", "confirmed", "delivery", [["若ごぼう佃煮", 3]], undefined, 1, { address: "京都市左京区吉田本町" });
    const done = await mk("consumer-sasaki", "藤井 翔", "completed", "pickup", [["春野菜セット", 1]], slotAt([3, 6], 10, -1, 1), 8, { consumerReviewed: true });
    await ctx.db.insert("watches", { userId: "demo-consumer", productId: productIds["いちじく（初もの）"], farmerId: farmerIds["岡田 学"], createdAt: now - 2 * DAY });
    await ctx.db.insert("watches", { userId: "consumer-sasaki", productId: productIds["若ごぼう（来季）"], farmerId: farmerIds["藤井 翔"], createdAt: now - DAY });
    await ctx.db.insert("watches", { userId: "consumer-kobayashi", productId: productIds["若ごぼう（来季）"], farmerId: farmerIds["藤井 翔"], createdAt: now - DAY });
    await ctx.db.insert("consumerRatings", { userId: "demo-consumer", farmerId: farmerIds["藤井 翔"], reservationId: toReview, rating: 5, comment: "時間どおり。", createdAt: now - 3 * DAY });
    await ctx.db.insert("consumerRatings", { userId: "consumer-sasaki", farmerId: farmerIds["岡田 学"], reservationId: done, rating: 4, createdAt: now - 7 * DAY });

    return { farmers: FARMERS.length };
  },
});
