import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import './global.css'; // NativeWind v4 initialization

function App() {
  return <RootNavigator />;
}

// React Native Gesture Handler is required by React Navigation
export default gestureHandlerRootHOC(App);
