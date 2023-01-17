import React from 'react';
import { Icon, IconButton, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import useParkingData from '../hooks/useParkingData';

// This screen shows detailed information about the selected parkingSpot
export default function DetailedParkInfo({ route }: any) {
  const { x } = route.params ?? { x: undefined };
  const { navigateToSpot } = useParkingData();

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
        <Text bold>Preis für 1 Stunde: </Text> {x?.price?.toString() + ' €' ?? 'no data'}
      </Text>
      <Text>
        <Text bold>Trend: </Text>{' '}
        <Icon as={Ionicons} name={x?.trend ? 'trending-down' : 'trending-up'} />
      </Text>
      <Text bold style={{ color: x?.closed ? 'red' : 'green' }}>
        {x?.closed ? 'Geschlossen' : 'Offen'}
      </Text>
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
