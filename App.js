import React, {Component} from 'react';
import {StyleSheet, Text, View,} from 'react-native';
import {credentials} from './src/config';
import {createAppContainer, createSwitchNavigator} from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';

import Feed from './src/components/Feed'
import Main from './src/components/Main'
import myMap from './src/components/myMap'


credentials();

const AppStack = createStackNavigator({
<<<<<<< HEAD

  TitleRoute: Title,
  FeedRoute: Feed,
  MainRoute: Main,


=======
  FeedRoute: Feed,
  MainRoute: Main,
  MapRoute: myMap
>>>>>>> 50e42285f8db7c0554b00b06a56468b5ca631f75
})

export default createAppContainer(createSwitchNavigator({

  App: AppStack
}));

<<<<<<< HEAD
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
=======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
>>>>>>> 50e42285f8db7c0554b00b06a56468b5ca631f75
