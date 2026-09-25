import { useMutation } from "convex/react";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FARMER_TABS, TabBar } from "../../components/TabBar";
import { Btn, Card, Field, Pill, ScreenTitle, Segmented, Txt } from "../../components/ui";
import { api } from "../../convex/_generated/api";
import { useStore } from "../../lib/store";
import { colors } from "../../lib/theme";
import { useMyFarmer } from "../../lib/useMyFarmer";

const STATUS = {
  pending: { label: "承認待ち", bg: colors.amberBg, color: colors.amberText },
  approved: { label: "公開中", bg: colors.greenBg, color: colors.greenText },
  rejected: { label: "却下", bg: colors.fewBg, color: colors.fewText },
} as const;

const TINTS = ["#E2EFE3", "#F3EBD6", "#F0E4F1", "#F5E3E6", "#EDF1DD", "#DFEFE6"];

export default function FarmerProfileScreen() {
  const insets = useSafeAreaInsets();
  const farmer = useMyFarmer();
  const upsert = useMutation(api.farmers.upsertMine);
  const { userId, showToast } = useStore();

  const [f, setF] = useState({
    name: "", kana: "", farmName: "", catchphrase: "", bio: "", crops: "", years: "1", season: "", seasonState: "off" as "now" | "soon" | "off",
    prefecture: "大阪府", city: "", pickupAddress: "", pickupHours: "", pickupNote: "", avatarUrl: "", farmUrls: "",
    latitude: "34.66", longitude: "135.47",
    k1t: "", k1b: "", k2t: "", k2b: "", k3t: "", k3b: "",
  });
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);

  // Load the saved profile into the form once (render-phase state adjustment).
  if (farmer && !loaded) {
    {
      const k = farmer.kodawari;
      setF({
        name: farmer.name, kana: farmer.kana, farmName: farmer.farmName, catchphrase: farmer.catchphrase, bio: farmer.bio,
        crops: farmer.crops.join("、"), years: String(farmer.years), season: farmer.season, seasonState: farmer.seasonState,
        prefecture: farmer.prefecture, city: farmer.city, pickupAddress: farmer.pickupAddress, pickupHours: farmer.pickupHours, pickupNote: farmer.pickupNote ?? "",
        avatarUrl: farmer.avatar, farmUrls: farmer.farmPhotos.join("\n"), latitude: String(farmer.latitude), longitude: String(farmer.longitude),
        k1t: k[0]?.title ?? "", k1b: k[0]?.body ?? "", k2t: k[1]?.title ?? "", k2b: k[1]?.body ?? "", k3t: k[2]?.title ?? "", k3b: k[2]?.body ?? "",
      });
      setLoaded(true);
    }
  }

  const useLocation = async () => {
    try {
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return showToast("位置情報の許可が必要です");
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setF((s) => ({ ...s, latitude: pos.coords.latitude.toFixed(5), longitude: pos.coords.longitude.toFixed(5) }));
      showToast("現在地を畑の位置に設定しました");
    } finally {
      setLocating(false);
    }
  };

  const save = async () => {
    if (busy) return;
    const lat = Number(f.latitude), lng = Number(f.longitude);
    if (!f.name.trim() || !f.farmName.trim() || !f.city.trim() || !f.pickupAddress.trim() || !f.pickupHours.trim()) {
      showToast("名前・農園名・市区町村・受取場所・受取時間は必須です");
      return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return showToast("畑の位置（緯度経度）を確認してください");
    const kodawari = [[f.k1t, f.k1b], [f.k2t, f.k2b], [f.k3t, f.k3b]].filter(([t]) => t.trim()).map(([title, body]) => ({ title: title.trim(), body: body.trim() }));
    setBusy(true);
    try {
      const isNew = farmer === null;
      await upsert({
        userId,
        name: f.name.trim(), kana: f.kana.trim(), farmName: f.farmName.trim(), catchphrase: f.catchphrase.trim() || `${f.farmName.trim()}の野菜です。`, bio: f.bio.trim(),
        kodawari, years: Number(f.years) || 1, season: f.season.trim() || "通年", seasonState: f.seasonState,
        tint: farmer?.tint ?? TINTS[f.name.length % TINTS.length],
        prefecture: f.prefecture.trim(), city: f.city.trim(), latitude: lat, longitude: lng,
        crops: f.crops.split(/[、,，\s]+/).map((c) => c.trim()).filter(Boolean),
        pickupAddress: f.pickupAddress.trim(), pickupHours: f.pickupHours.trim(), pickupNote: f.pickupNote.trim() || undefined,
        avatarUrl: f.avatarUrl.trim() || `https://i.pravatar.cc/400?u=${encodeURIComponent(userId)}`,
        farmUrls: f.farmUrls.split(/\n|,/).map((u) => u.trim()).filter(Boolean),
      });
      showToast(isNew ? "申請しました。運営の承認をお待ちください" : "保存しました");
      if (isNew) router.navigate("/farmer/home");
    } catch (e) {
      showToast(e instanceof Error ? e.message.replace(/^.*Uncaught Error: /, "") : "保存に失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: 18, paddingBottom: 130, gap: 14 }} keyboardShouldPersistTaps="handled">
        <ScreenTitle label="PROFILE" title={farmer ? "プロフィール" : "生産者登録"} right={farmer ? <Pill {...STATUS[farmer.status]} weight={700} /> : undefined} />
        {!farmer && <Txt size={12} color={colors.inkSoft} style={{ lineHeight: 19 }}>消費者に見せたい「人」の情報を書いてください。登録後、運営の承認を経て地図に掲載されます。</Txt>}

        <Card style={{ padding: 14, gap: 12 }}>
          <Txt w={700} size={13}>01 · 人</Txt>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}><Field label="名前" value={f.name} onChangeText={set("name")} placeholder="山本 和也" /></View>
            <View style={{ flex: 1 }}><Field label="よみがな" value={f.kana} onChangeText={set("kana")} placeholder="やまもと かずや" /></View>
          </View>
          <Field label="顔写真URL" value={f.avatarUrl} onChangeText={set("avatarUrl")} placeholder="https://…" hint="顔が見えることが信頼につながります。未入力なら仮画像。" />
          <Field label="ひとこと" value={f.catchphrase} onChangeText={set("catchphrase")} placeholder="手でしぼれば水がしたたる、泉州の水なす。" />
          <Field label="自己紹介" value={f.bio} onChangeText={set("bio")} multiline />
          <Txt w={500} size={11} color={colors.muted}>こだわり（最大3つ）</Txt>
          {([["k1t", "k1b"], ["k2t", "k2b"], ["k3t", "k3b"]] as const).map(([t, b], i) => (
            <View key={t} style={{ gap: 6, padding: 10, borderRadius: 12, backgroundColor: colors.bg }}>
              <Field label={`こだわり ${i + 1} タイトル`} value={f[t]} onChangeText={set(t)} placeholder="皮が薄いまま育てる" />
              <Field label="説明" value={f[b]} onChangeText={set(b)} placeholder="風で実が傷つかないよう…" />
            </View>
          ))}
        </Card>

        <Card style={{ padding: 14, gap: 12 }}>
          <Txt w={700} size={13}>02 · 農園</Txt>
          <Field label="農園名" value={f.farmName} onChangeText={set("farmName")} placeholder="山本農園" />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}><Field label="都道府県" value={f.prefecture} onChangeText={set("prefecture")} /></View>
            <View style={{ flex: 1 }}><Field label="市区町村" value={f.city} onChangeText={set("city")} placeholder="貝塚市" /></View>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}><Field label="代表作物（、区切り）" value={f.crops} onChangeText={set("crops")} placeholder="水なす、玉ねぎ" /></View>
            <View style={{ width: 90 }}><Field label="就農年数" value={f.years} onChangeText={set("years")} keyboardType="numeric" /></View>
          </View>
          <Field label="旬" value={f.season} onChangeText={set("season")} placeholder="5〜9月" />
          <Segmented value={f.seasonState} onChange={(v) => setF((s) => ({ ...s, seasonState: v }))} options={[{ value: "now", label: "今が旬" }, { value: "soon", label: "もうすぐ" }, { value: "off", label: "旬以外" }]} />
          <Field label="農園写真URL（改行区切り）" value={f.farmUrls} onChangeText={set("farmUrls")} multiline placeholder="https://…" />
          <View style={{ flexDirection: "row", gap: 8, alignItems: "flex-end" }}>
            <View style={{ flex: 1 }}><Field label="緯度" value={f.latitude} onChangeText={set("latitude")} keyboardType="decimal-pad" /></View>
            <View style={{ flex: 1 }}><Field label="経度" value={f.longitude} onChangeText={set("longitude")} keyboardType="decimal-pad" /></View>
            <Btn label={locating ? "取得中…" : "現在地を使う"} variant="outline" height={44} style={{ paddingHorizontal: 12 }} onPress={useLocation} />
          </View>
        </Card>

        <Card style={{ padding: 14, gap: 12 }}>
          <Txt w={700} size={13}>03 · 受取</Txt>
          <Field label="受取場所（住所・目印）" value={f.pickupAddress} onChangeText={set("pickupAddress")} placeholder="大阪府貝塚市小瀬 山本農園 直売所" />
          <Field label="受取可能な曜日・時間" value={f.pickupHours} onChangeText={set("pickupHours")} placeholder="火・木・土 9:00〜12:00" />
          <Field label="受取の注意（任意）" value={f.pickupNote} onChangeText={set("pickupNote")} placeholder="インターホンを押してください" />
          <Txt size={11} color={colors.muted}>発送代行の可否は商品ごとに設定します。</Txt>
        </Card>

        <Btn label={busy ? "保存中…" : farmer ? "保存する" : "登録して承認を申請"} variant="green" height={50} disabled={busy} onPress={save} />
      </ScrollView>
      <TabBar active="profile" tabs={FARMER_TABS} />
    </View>
  );
}
