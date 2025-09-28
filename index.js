import { registerRootComponent } from 'expo';
import 'react-native-gesture-handler';
import App from './App'; // ✅ notice the ./App (points to App.js)

registerRootComponent(App);
