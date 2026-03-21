import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import { LocalizationProvider } from './src/localization/LocalizationProvider';
import './global.css'; // NativeWind v4 initialization

function App() {
  return (
    <LocalizationProvider>
      <RootNavigator />
    </LocalizationProvider>
  );
}

// React Native Gesture Handler is required by React Navigation
export default gestureHandlerRootHOC(App);
