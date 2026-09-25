import { Tabs } from "expo-router";
import { FARMER_TABS, TabBar } from "../../../components/TabBar";
import { colors } from "../../../lib/theme";

export default function FarmerTabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg }, animation: "fade" }}
      tabBar={({ state, navigation }) => (
        <TabBar active={state.routes[state.index].name} tabs={FARMER_TABS} onPress={(key) => navigation.navigate(key)} />
      )}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="reservations" />
      <Tabs.Screen name="products" />
      <Tabs.Screen name="reviews" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
