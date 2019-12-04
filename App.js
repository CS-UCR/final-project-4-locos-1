import React, {Component} from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {credentials} from './src/config';
import AuthenticationMenu from './src/Navigation/navigation';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import { Provider } from 'react-redux';
import UserAuthenticationReducer from './src/authentication/store/Reducer/auth'
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};


console.ignoredYellowBox = ['Setting a timer']
credentials();

const rootReducer = combineReducers({
  userAuth: UserAuthenticationReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


export default function App(){
  return (
    <Provider store={store}>
      <AuthenticationMenu/>
    </Provider>
  )
}