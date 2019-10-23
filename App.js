import React, {Component} from 'react';
import {StyleSheet, Text, View } from 'react-native';
import {credentials} from './src/config';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';

import Feed from './src/components/Feed'
import Main from './src/components/Main'
import myMap from './src/components/myMap'


credentials();

const AppStack = createStackNavigator({
  FeedRoute: Feed,
  MainRoute: Main,
  MapRoute: myMap
})

export default createAppContainer(createSwitchNavigator({

  App: AppStack
}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
