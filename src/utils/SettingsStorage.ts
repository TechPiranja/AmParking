import AsyncStorage from '@react-native-async-storage/async-storage';
import { SETTINGS } from '../types/Settings';

// stores the settings in the internal storage
const storeSetting = async (name: string, setting: any) => {
    try {
        const jsonValue = JSON.stringify(setting)
        await AsyncStorage.setItem('@' + name, jsonValue)
    } catch (e) {
        // saving error
    }
}

// gets the settings from the internal storage
const getSettings = async (): Promise<any | null | undefined> => {
    try {
        let settings = {} as any;
        for (const setting in SETTINGS) {
            const jsonValue = await AsyncStorage.getItem('@' + setting)
            settings[setting] = jsonValue != null ? JSON.parse(jsonValue) : null;
        }
        return settings;

    } catch (e) {
        // error reading value
    }
}

// gets specifig setting by name from the internal storage
const getSetting = async (name: string): Promise<any | null | undefined> => {
    try {
        const jsonValue = await AsyncStorage.getItem('@' + name)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
}

export {
    storeSetting,
    getSettings,
    getSetting
}