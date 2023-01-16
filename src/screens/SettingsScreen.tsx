import { Flex, Input, Switch, Text } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { changeSpeechVolume, changeRadius } from '../redux/reducers/settingsReducer';
import { SETTINGS } from '../types/Settings';
import { storeSetting } from '../utils/SettingsStorage';

export default function SettingsScreen() {
  const settings = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();

  function setVolume(volume: boolean) {
    storeSetting(SETTINGS.SpeechVolume, volume);
    dispatch(changeSpeechVolume(volume));
  }

  function setRadius(radius: number) {
    storeSetting(SETTINGS.Radius, radius);
    dispatch(changeRadius(radius));
  }

  return (
    <View style={styles.container}>
      <Flex direction="row" justifyContent="space-between" style={{ margin: 10 }}>
        <Text fontSize="lg">Sprachausgabe</Text>
        <Switch size="md" value={settings.speechVolume} onToggle={(x: boolean) => setVolume(x)} />
      </Flex>
      <Flex direction="row" justifyContent="space-between" style={{ margin: 10 }}>
        <Text fontSize="lg">Radius</Text>
        <Input
          placeholder="Radius in Meter"
          w="40%"
          value={settings.radius}
          onChangeText={(x: string) => setRadius(Number(x))}
        />
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
    padding: 10
  }
});
