import React, { useEffect } from 'react';
import { Icon, IconButton, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';
import { View } from 'react-native';

interface ParkInfoProps {
  parkingSpotInfo: ParkingSpotInfo;
  changeSpot: any;
  navigateToSpot: any;
}

export default function ParkInfo({ parkingSpotInfo, changeSpot, navigateToSpot }: ParkInfoProps) {
  return (
    <View style={{ width: 140 }}>
      <Text fontSize="md" bold>
        {parkingSpotInfo?.name}
      </Text>
      <Text>
        <Text bold>Belegt: </Text> {parkingSpotInfo?.current?.toString() ?? 'no data'} /{' '}
        {parkingSpotInfo?.total?.toString() ?? 'no data'}
      </Text>
      <Text>
        <Text bold>Frei: </Text> {parkingSpotInfo?.free?.toString() ?? 'no data'}
      </Text>
      <Text>
        <Text bold>Trend: </Text>{' '}
        <Icon as={Ionicons} name={parkingSpotInfo?.trend ? 'trending-down' : 'trending-up'} />
      </Text>
      {/* <Text>
    <Text bold>Status: </Text> {parkingSpotInfo?.state?.toString() ?? 'no data'}
  </Text> */}

      <Text bold style={{ color: parkingSpotInfo?.closed ? 'red' : 'green' }}>
        {parkingSpotInfo.closed ? 'Geschlossen' : 'Offen'}
      </Text>
      <IconButton
        style={{ position: 'absolute', bottom: -10, right: -10 }}
        size="lg"
        icon={<Icon as={Ionicons} name={parkingSpotInfo?.isFavorite ? 'star' : 'star-outline'} />}
        borderRadius="full"
        onPress={() => changeSpot(parkingSpotInfo.id, !parkingSpotInfo.isFavorite ?? true)}
      />
      <IconButton
        style={{ position: 'absolute', bottom: -10, right: 25 }}
        size="lg"
        icon={<Icon as={Ionicons} name={'navigate'} />}
        borderRadius="full"
        onPress={() =>
          navigateToSpot(
            { latitude: parkingSpotInfo!.latitude, longitude: parkingSpotInfo!.longitude },
            parkingSpotInfo!.name
          )
        }
      />
    </View>
  );
}
