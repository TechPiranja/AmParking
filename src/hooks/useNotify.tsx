import { getSetting } from '../utils/SettingsStorage';
import { SETTINGS } from '../types/Settings';
import { useEffect } from 'react';
import * as Speech from 'expo-speech';
import { useDispatch, useSelector } from 'react-redux';
import { changeSpeechVolume } from '../redux/reducers/settingsReducer';
import { useToast } from 'native-base';

// this hook is responsible for placing notifications and speech
export default function useNotify() {
  const settings = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();
  const toast = useToast();

  // initially the settings for the speech volume are get from the storage
  useEffect(() => {
    async () => {
      const volume = await getSetting(SETTINGS.SpeechVolume);
      dispatch(changeSpeechVolume(volume));
    };
  }, []);

  // this function can be called by any component in order to place a notification and speech
  function notify(text: string, showMessage: boolean = true) {
    if (showMessage)
      if (!toast.isActive(text)) {
        toast.show({
          id: text,
          description: text,
          placement: 'top'
        });
      }

    if (settings.speechVolume) Speech.speak(text, { language: 'de' });
  }

  return { notify };
}
