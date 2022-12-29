import { Flex, Switch, Text } from 'native-base';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { changeSpeechVolume } from '../redux/reducers/settingsReducer';
import { SETTINGS } from '../types/Settings';
import { storeSetting } from '../utils/SettingsStorage';

export default function SettingsScreen() {
  const settings = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();

  function changeVolume(volume: boolean) {
    storeSetting(SETTINGS.SpeechVolume, volume);
    dispatch(changeSpeechVolume(volume));
  }

  return (
    <View style={styles.container}>
      <Flex direction="row" justifyContent="space-between">
        <Text fontSize="lg">Sprachausgabe</Text>
        <Switch
          size="md"
          value={settings.speechVolume}
          onToggle={(x: boolean) => changeVolume(x)}
        />
      </Flex>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  }
});
