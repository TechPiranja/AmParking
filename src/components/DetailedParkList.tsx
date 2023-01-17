import { useNavigation } from '@react-navigation/native';
import { FlatList, Icon, IconButton } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useParkingData from '../hooks/useParkingData';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';
import useGeofences from '../hooks/useGeofences';
import { useIsFocused } from '@react-navigation/native';
import { getParkingSpots } from '../utils/ParkingSpotStorage';

interface ItemProp {
  x: ParkingSpotInfo;
  navigation: any;
  changeSpot: any;
}

// this defined the rendered item component
const Item = ({ x, navigation, changeSpot }: ItemProp) => (
  <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Parkdetails', { x })}>
    <Text>{x.name}</Text>
    <IconButton
      style={{ margin: -15 }}
      size="lg"
      icon={<Icon as={Ionicons} name={x?.isFavorite ? 'star' : 'star-outline'} />}
      borderRadius="full"
      onPress={() => changeSpot(x?.id, !x.isFavorite ?? true)}
    />
  </TouchableOpacity>
);

// this is the divider for the flatlist
const ItemDivider = () => {
  return (
    <View
      style={{
        height: 0.5,
        width: '100%',
        backgroundColor: '#939393'
      }}
    />
  );
};

// this screen shows the list of all parkingSpots
export default function DetailedParkList() {
  const navigation = useNavigation();
  const { parkingSpots, changeSpot } = useParkingData();
  const [spots, setSpots] = useState<ParkingSpotInfo[]>([]);
  const {} = useGeofences();
  const isFocused = useIsFocused();

  // everytime the hook updates data, the component data gets updated too
  useEffect(() => {
    setSpots(parkingSpots);
  }, [parkingSpots]);

  // gets data from storage and sets it in component
  async function getInitialData() {
    const data = await getParkingSpots();
    if (data) setSpots(data);
  }

  // when the screen gets the focus, data will be loaded from storage
  useEffect(() => {
    getInitialData();
  }, [isFocused]);

  // this is used by the flatlist in order to render the items
  const renderItem = ({ item }: any) => (
    <Item x={item} navigation={navigation} changeSpot={changeSpot} />
  );

  return (
    <FlatList
      data={spots?.sort(
        (a: ParkingSpotInfo, b: ParkingSpotInfo) => Number(b!.isFavorite) - Number(a!.isFavorite)
      )}
      ItemSeparatorComponent={ItemDivider}
      renderItem={renderItem}
      keyExtractor={(item: ParkingSpotInfo) => item.id.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  },
  item: {
    margin: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 32
  }
});
