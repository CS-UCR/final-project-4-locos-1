import React, {Component} from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {credentials} from './src/config';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';

import Feed from './src/components/Feed'
import Main from './src/components/Main'

//const Maps_API = "AIzaSyDbhCsme0uvQT5Kt-eFHE1cgHg8YhZmAs0";
credentials();

const AppStack = createStackNavigator({

  TitleRoute: Title,
  FeedRoute: Feed,
  MainRoute: Main,


})

export default createAppContainer(createSwitchNavigator({

  App: AppStack
}));

/*
export default class App extends Component{

  constructor (){
    //super()
    credentials(); //firebase api key config
  }

  render(){
    return (
    <View style={styles.container}>
      <Text>updated 7</Text>

    </View>
    );
  }

}

*/
