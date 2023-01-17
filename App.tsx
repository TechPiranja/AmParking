import { StatusBar } from 'expo-status-bar';
import BottomTabs from './src/navigation/BottomTabs';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import configureStore from './src/redux/store/configureStore';

// enables the redux store
const store = configureStore;

// the nativebaseprovider is needed in order to use the native base design system
export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <BottomTabs />
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}
