import {AppRegistry} from 'react-native';
import React from 'react';
import App from './App';
import {name as appName} from './app.json';
import { AuthContextProvider } from './Context/AuthContext';
const Root = () => (
  <AuthContextProvider>
    <App/>
  </AuthContextProvider>
);

AppRegistry.registerComponent(appName, () => Root);
