import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/MapScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import SettingsScreen from '../screens/SettingsScreen';
import ListScreen from '../screens/ListScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Karte') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Einstellungen')
            iconName = focused ? 'settings' : 'settings-outline';
          else if (route.name === 'Liste') iconName = focused ? 'list' : 'list-outline';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray'
      })}>
      <Tab.Screen name="Liste" component={ListScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Karte" component={MapScreen} />
      <Tab.Screen name="Einstellungen" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
