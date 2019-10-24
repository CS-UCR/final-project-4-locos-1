import React, {Component} from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {credentials} from './src/config';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';

import Title from './src/components/Title'
import Feed from './src/components/Feed'
import Main from './src/components/Main'
import myMap from './src/components/myMap'
import Login from './src/authentication/User/LoginScreen';
//import SignUp from './src/authentication/User/SignUpScreen'

credentials();

const AppStack = createStackNavigator({
  MainRoute: Main,
  TitleRoute: Title,
  FeedRoute: Feed,
  MapRoute: myMap,
  LoginRoute: Login,
//  SignUpRoute: SignUp
  })

export default createAppContainer(createSwitchNavigator({

  App: AppStack
}));