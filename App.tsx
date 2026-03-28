import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import { LocalizationProvider } from './src/localization/LocalizationProvider';
import { AppErrorBoundary } from './src/components/app/AppErrorBoundary';
import './global.css'; // NativeWind v4 initialization

function App() {
  return (
    <AppErrorBoundary>
      <LocalizationProvider>
        <RootNavigator />
      </LocalizationProvider>
    </AppErrorBoundary>
  );
}

// React Native Gesture Handler is required by React Navigation
export default gestureHandlerRootHOC(App);
