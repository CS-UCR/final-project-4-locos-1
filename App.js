import React, {useState} from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {credentials} from './src/config';
import AuthenticationMenu from './src/Navigation/navigation';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import { Provider } from 'react-redux';
import UserAuthenticationReducer from './src/authentication/store/Reducer/auth'
import UserWorkspaceReducer from './src/authentication/store/Reducer/workspace'

import * as Font from 'expo-font';
import { useScreens } from 'react-native-screens'
import { AppLoading } from 'expo';

useScreens()

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

credentials();

const rootReducer = combineReducers({
  userAuth: UserAuthenticationReducer,
  WorkSpaces:  UserWorkspaceReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


export default function App(){
  const [fontLoaded, setFontLoaded] = useState(false);

  if(!fontLoaded){
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError = {console.warn}
      />
    )
  }

  return (
    <Provider store={store}>
      <AuthenticationMenu/>
    </Provider>
  )
}