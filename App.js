import React, {Component} from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {credentials} from './src/config';
import AuthenticationMenu from './src/Navigation/navigation';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import { Provider } from 'react-redux';
import UserAuthenticationReducer from './src/authentication/store/Reducer/auth'




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