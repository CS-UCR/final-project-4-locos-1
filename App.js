import React, {Component} from 'react';
import {StyleSheet, Text, View } from 'react-native';
import {credentials} from './src/config';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';

import Feed from './src/components/Feed'
import Main from './src/components/Main'

const AppStack = createStackNavigator({

  FeedRoute: Feed,
  MainRoute: Main


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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
