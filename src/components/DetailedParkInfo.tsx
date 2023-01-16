import React, { useEffect } from 'react';
import { Icon, IconButton, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';
import { View } from 'react-native';
import useParkingData from '../hooks/useParkingData';

interface ParkInfoProps {
  parkingSpotInfo: ParkingSpotInfo;
  changeSpot: any;
  navigateToSpot: any;
}

export default function DetailedParkInfo({ route }: any) {
  const { x } = route.params ?? { x: undefined };
  const { changeSpot, navigateToSpot } = useParkingData();

  return (
    <View style={{ padding: 10, margin: 10, borderRadius: 10, backgroundColor: '#fff' }}>
      <Text fontSize="lg" bold>
        {x?.name}
      </Text>
      <Text>
        <Text bold>Belegt: </Text> {x?.current?.toString() ?? 'no data'} /{' '}
        {x?.total?.toString() ?? 'no data'}
      </Text>
      <Text>
        <Text bold>Frei: </Text> {x?.free?.toString() ?? 'no data'}
      </Text>
      <Text>
        <Text bold>Trend: </Text>{' '}
        <Icon as={Ionicons} name={x?.trend ? 'trending-down' : 'trending-up'} />
      </Text>
      {/* <Text>
    <Text bold>Status: </Text> {parkingSpotInfo?.state?.toString() ?? 'no data'}
  </Text> */}

      <Text bold style={{ color: x?.closed ? 'red' : 'green' }}>
        {x?.closed ? 'Geschlossen' : 'Offen'}
      </Text>
      {/* TODO: this needs redux! <IconButton
        style={{ position: 'absolute', bottom: -5, right: -5 }}
        size="lg"
        icon={<Icon as={Ionicons} name={x?.isFavorite ? 'star' : 'star-outline'} />}
        borderRadius="full"
        onPress={() => changeSpot(x?.id, !x.isFavorite ?? true)}
      /> */} 
      <IconButton
        style={{ position: 'absolute', bottom: -5, right: 0 }}
        size="lg"
        icon={<Icon as={Ionicons} name={'navigate'} />}
        borderRadius="full"
        onPress={() => navigateToSpot({ latitude: x!.latitude, longitude: x!.longitude }, x!.name)}
      />
    </View>
  );
}
