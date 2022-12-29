import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import BottomTabs from './src/navigation/BottomTabs';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import configureStore from './src/redux/store/configureStore';

const store = configureStore;

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
