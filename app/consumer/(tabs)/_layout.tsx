import { Tabs } from "expo-router";
import { CONSUMER_TABS, TabBar } from "../../../components/TabBar";
import { colors } from "../../../lib/theme";

export default function ConsumerTabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg }, animation: "fade" }}
      tabBar={({ state, navigation }) => (
        <TabBar active={state.routes[state.index].name} tabs={CONSUMER_TABS} onPress={(key) => navigation.navigate(key)} />
      )}
    >
      <Tabs.Screen name="map" />
      <Tabs.Screen name="reservations" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
