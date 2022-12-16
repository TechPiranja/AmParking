import React from 'react';
import { Icon, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { ParkingSpotInfo } from '../types/ParkingSpotInfo';

interface ParkInfoProps {
  parkingSpotInfo: ParkingSpotInfo;
}

export default function ParkInfo({ parkingSpotInfo }: ParkInfoProps) {
  return (
    <>
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
    </>
  );
}
