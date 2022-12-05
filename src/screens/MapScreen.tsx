import React, { useState, useEffect } from "react";
import MapView, { Circle, Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";
import parkingSpots from "../data/parkingSpots.json";

import * as Location from "expo-location";

export default function MapScreen() {
	const [location, setLocation] = useState<any>(null);
	const [errorMsg, setErrorMsg] = useState<any>(null);

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
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
			>
				{parkingSpots.map((x: any) => (
					<Marker coordinate={{ latitude: x.latitude, longitude: x.longitude }} title={x.name} description={x.name} />
				))}
				<Circle center={location?.coords} radius={500} fillColor="rgba(6, 172, 244, 0.26)" strokeColor="rgba(0, 0, 0, 0)" />
			</MapView>
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
