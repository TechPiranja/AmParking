import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import BottomTabs from "./src/navigation/BottomTabs";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
	return (
		<NavigationContainer>
			<StatusBar style="auto" />
			<BottomTabs />
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
