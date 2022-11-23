import React, { useState, useEffect } from "react";
import MapView, { Circle } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";

import * as Location from "expo-location";

export default function MapScreen() {
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				console.log(errorMsg);
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			console.warn(location);
			setLocation(location);
		})();
	}, []);

	return (
		<View style={styles.container}>
			<MapView
				style={styles.map}
				region={{
					latitude: location?.coords.latitude,
					longitude: location?.coords.longitude,
					latitudeDelta: 0.03,
					longitudeDelta: 0.02,
				}}
				showsUserLocation
				showsCompass
				showsScale
			/>
			<Circle center={location?.coords} radius={1000} fillColor="rgba(6, 172, 244, 0.26)" strokeColor="rgba(0, 0, 0, 0)" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
});
