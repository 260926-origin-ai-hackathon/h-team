import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Btn, Card, Field, IconButton, ToggleRow, Txt } from "../../../components/ui";
import { fmtExpected } from "../../../lib/farmerView";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useStore } from "../../../lib/store";
import { colors } from "../../../lib/theme";
import { useMyFarmer } from "../../../lib/useMyFarmer";

/** 商品の作成・編集（id === "new" で新規）。 */
export default function FarmerProductEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";
  const insets = useSafeAreaInsets();
  const farmer = useMyFarmer();
  const existing = useQuery(api.products.get, isNew ? "skip" : { id: id as Id<"products"> });
  const upsert = useMutation(api.products.upsert);
  const remove = useMutation(api.products.remove);
  const showToast = useStore((s) => s.showToast);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [stock, setStock] = useState("10");
  const [harvest, setHarvest] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [harvestedToday, setHarvestedToday] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [available, setAvailable] = useState(true);
  const [upcoming, setUpcoming] = useState(false);
  const [now] = useState(() => Date.now());
  const [expectedDays, setExpectedDays] = useState("7");
  const [loaded, setLoaded] = useState(isNew);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  // Load the existing product into the form once (render-phase state adjustment, see react.dev "storing information from previous renders").
  if (existing && !loaded) {
    {
      setName(existing.name);
      setPrice(String(existing.price));
      setUnit(existing.unit);
      setStock(String(existing.stock));
      setHarvest(existing.harvest);
      setDescription(existing.description);
      setImageUrl(existing.image);
      setHarvestedToday(existing.harvestedToday);
      setDeliveryAvailable(existing.deliveryAvailable);
      setAvailable(existing.available);
      if (existing.expectedAt && !existing.available) {
        setUpcoming(true);
        setExpectedDays(String(Math.max(1, Math.round((existing.expectedAt - now) / 86400000))));
      }
      setLoaded(true);
    }
  }

  const save = async () => {
    if (!farmer || busy) return;
    const p = Number(price), s = Number(stock);
    if (!name.trim() || !unit.trim() || !Number.isFinite(p) || p <= 0 || !Number.isFinite(s)) {
      showToast("商品名・価格・単位・在庫を入力してください");
      return;
    }
    setBusy(true);
    try {
      await upsert({
        id: isNew ? undefined : (id as Id<"products">),
        farmerId: farmer._id,
        name: name.trim(),
        price: p,
        unit: unit.trim(),
        stock: s,
        harvest: harvest.trim() || "収穫時期は要相談",
        description: description.trim(),
        imageUrl: imageUrl.trim() || `https://picsum.photos/seed/${encodeURIComponent(name.trim())}/800/800`,
        harvestedToday,
        deliveryAvailable,
        available: upcoming ? false : available,
        expectedAt: upcoming ? Date.now() + Math.max(1, Number(expectedDays) || 7) * 86400000 : undefined,
      });
      showToast(isNew ? "商品を追加しました" : "保存しました");
      router.back();
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView keyboardDismissMode="on-drag" contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 18, paddingBottom: insets.bottom + 40, gap: 14 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <IconButton name="chevron-back" onPress={() => router.back()} />
          <Txt w={700} size={20}>{isNew ? "商品を追加" : "商品を編集"}</Txt>
        </View>
        <Card style={{ padding: 14, gap: 12 }}>
          <Field label="商品名" value={name} onChangeText={setName} placeholder="泉州水なす" />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}><Field label="価格（円・税込）" value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="1280" /></View>
            <View style={{ flex: 1 }}><Field label="単位" value={unit} onChangeText={setUnit} placeholder="5本 / 1kg" /></View>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}><Field label="在庫" value={stock} onChangeText={setStock} keyboardType="numeric" /></View>
            <View style={{ flex: 1 }}><Field label="収穫情報" value={harvest} onChangeText={setHarvest} placeholder="毎朝5時収穫" /></View>
          </View>
          <Field label="説明" value={description} onChangeText={setDescription} multiline placeholder="味・食べ方・おすすめ" />
          <Field label="画像URL（任意）" value={imageUrl} onChangeText={setImageUrl} placeholder="https://…" hint="未入力ならプレースホルダ画像になります" />
        </Card>
        <Card style={{ paddingHorizontal: 14, paddingVertical: 4 }}>
          <ToggleRow label="本日収穫" hint="地図とシートに「本日収穫」が付きます" value={harvestedToday} onChange={setHarvestedToday} />
          <ToggleRow label="発送代行に対応" hint="受取だけでなく発送も選べるようにする" value={deliveryAvailable} onChange={setDeliveryAvailable} />
          <ToggleRow label="出荷予定として掲載" hint="まだ販売しないが予定日を見せてウォッチを集める" value={upcoming} onChange={setUpcoming} />
          {upcoming ? (
            <View style={{ paddingBottom: 12, gap: 6 }}>
              <Field label="出荷予定（何日後）" value={expectedDays} onChangeText={setExpectedDays} keyboardType="numeric" hint={fmtExpected(now + Math.max(1, Number(expectedDays) || 7) * 86400000) + "。販売を始めるときはこのスイッチを切って公開してください。ウォッチした人に知らせます。"} />
            </View>
          ) : (
            <ToggleRow label="公開する" hint="オフにすると消費者に表示されません" value={available} onChange={setAvailable} />
          )}
        </Card>
        <Btn label={busy ? "保存中…" : isNew ? "この内容で追加" : "保存する"} variant="green" height={50} disabled={busy} onPress={save} />
        {!isNew && !confirmDelete && <Btn label="この商品を削除" variant="outline" height={44} onPress={() => setConfirmDelete(true)} />}
        {!isNew && confirmDelete && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Btn label="やめる" variant="outline" height={44} style={{ flex: 1 }} onPress={() => setConfirmDelete(false)} />
            <Btn label="削除を確定" height={44} style={{ flex: 1 }} onPress={() => remove({ id: id as Id<"products"> }).then(() => { showToast("削除しました"); router.back(); })} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
