import React from 'react';
import { StyleSheet, View } from 'react-native';
import DetailedParkList from '../components/DetailedParkList';

// this screen show the detailed parkinglist
export default function ListScreen() {
  return (
    <View style={styles.container}>
      <DetailedParkList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
