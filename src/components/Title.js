import React, {Component} from 'react';
import {View, Text, Button, Platform, TouchableHighlight,} from 'react-native';

import{styles} from '../styles/styles';

export default class Title extends Component {
  _onPressLogInButton() {
    alert('Logged in!')
    props.navigation.navigate('MainRoute')
  }

  _onPressSignUpButton() {
    alert('Created Account!')
    props.navigation.navigate('MainRoute')
  }

  render() {
    return (
      <View style={styles.container}>

      <View style={{width: 250, height: 300}}>
        <Text style={styles.titleText}>Study Buddy</Text>
      </View>

        <TouchableHighlight onPress={this._onPressLogInButton} underlayColor="white">
          <View style={styles.button}>
            <Text style={styles.buttonText}>Log In</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={this._onPressSignUpButton} underlayColor="white">
          <View style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </View>
        </TouchableHighlight>
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 430,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  titleText:{
      fontSize: 55,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  button: {
    marginBottom: 30,
    width: 130,
    alignItems: 'center',
    backgroundColor: '#feccc1'
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: '#505050'
  }
});