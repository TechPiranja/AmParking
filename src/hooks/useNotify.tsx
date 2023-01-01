import { getSetting } from '../utils/SettingsStorage';
import { SETTINGS } from '../types/Settings';
import { useEffect } from 'react';
import * as Speech from 'expo-speech';
import { useDispatch, useSelector } from 'react-redux';
import { changeSpeechVolume } from '../redux/reducers/settingsReducer';
import { Box, useToast, Text } from 'native-base';

export default function useNotify() {
  const settings = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    async () => {
      const volume = await getSetting(SETTINGS.SpeechVolume);
      dispatch(changeSpeechVolume(volume));
    };
  }, []);

  function notify(text: string, customRender: any = undefined, showMessage: boolean = true) {
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
