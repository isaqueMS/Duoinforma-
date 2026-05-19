// Import root component registration utility from Expo.
// This utility configures the React Native framework to bootstrap the app properly on native and web environments.
import { registerRootComponent } from 'expo';

// Import our root App component containing our global providers and navigation structure
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go, in a native build (APK/iOS), or on web,
// the environment is set up and executed appropriately.
registerRootComponent(App);

