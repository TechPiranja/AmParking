import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "../screens/MapScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === "Map") iconName = focused ? "map" : "map-outline";
					else if (route.name === "Settings") iconName = focused ? "settings" : "settings-outline";

					return <Ionicons name={iconName as any} size={size} color={color} />;
				},
				tabBarActiveTintColor: "orange",
				tabBarInactiveTintColor: "gray",
			})}
		>
			<Tab.Screen options={{ headerShown: false }} name="Map" component={MapScreen} />
			<Tab.Screen name="Settings" component={SettingsScreen} />
		</Tab.Navigator>
	);
}
