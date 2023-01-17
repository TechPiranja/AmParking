import { Flex, Input, Switch, Text } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeSpeechVolume,
  changeRadius,
  togglePseudoNavigation
} from '../redux/reducers/settingsReducer';
import { SETTINGS } from '../types/Settings';
import { storeSetting } from '../utils/SettingsStorage';

// the settings screen shows all possible configuration points
export default function SettingsScreen() {
  const settings = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();

  // sets the volume in the internal storage and redux store
  function setVolume(volume: boolean) {
    storeSetting(SETTINGS.SpeechVolume, volume);
    dispatch(changeSpeechVolume(volume));
  }

  // sets the radius in the internal storage and redux store
  function setRadius(radius: number) {
    storeSetting(SETTINGS.Radius, radius);
    dispatch(changeRadius(radius));
  }

  // sets the pseudoNavigation in the internal storage and redux store
  function setPseudoNavigation(isActive: boolean) {
    storeSetting(SETTINGS.PseudoNavigation, !isActive);
    dispatch(togglePseudoNavigation());
  }

  return (
    <View style={styles.container}>
      <Flex direction="row" justifyContent="space-between" style={{ margin: 10 }}>
        <Text fontSize="lg">Sprachausgabe</Text>
        <Switch size="md" value={settings.speechVolume} onToggle={(x: boolean) => setVolume(x)} />
      </Flex>
      <Flex direction="row" justifyContent="space-between" style={{ margin: 10 }}>
        <Text fontSize="lg">Pseudo-Navigation</Text>
        <Switch
          size="md"
          value={settings.pseudoNavigation}
          onToggle={(x: boolean) => setPseudoNavigation(x)}
        />
      </Flex>
      <Flex direction="row" justifyContent="space-between" style={{ margin: 10 }}>
        <Text fontSize="lg">Radius</Text>
        <Input
          w="40%"
          placeholder="300"
          value={settings?.radius ?? 300}
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
