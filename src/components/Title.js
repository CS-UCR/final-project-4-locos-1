import React, {Component} from 'react';
import {View, Text, Button, Platform, TouchableHighlight,StyleSheet} from 'react-native';
import DrawerIcon from '../Navigation/assets/drawerNav/DrawerIcon';

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

export default class Title extends Component {

  constructor(props){

    super(props)
  }
  _onPressLogInButton() {
    alert('Logged in!')
    this.props.navigation.navigate('MainRoute')
  }

  _onPressSignUpButton() {
    alert('Created Account!')
    this.props.navigation.navigate('MainRoute')
  }

  static navigationOptions = () => {
    return {
        headerRight: <DrawerIcon/>,
        headerStyle: {
            backgroundColor: '#E0E0E0',
        },
    };
  };

  render() {
    return (
      <View style={styles.container}>

      <View style={{width: 250, height: 300}}>
        <Text style={styles.titleText}>Study Buddy</Text>
      </View>

        <TouchableHighlight onPress={()=> { alert('Logged in!');this.props.navigation.navigate('LoginRoute');}} underlayColor="white">
          <View style={styles.button}>
            <Text style={styles.buttonText}>Log In</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight onPress={()=> {  alert('Created Account!'); this.props.navigation.navigate('SignUpRoute');}} underlayColor="white">
          <View style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </View>
        </TouchableHighlight>
      </View>


    );
  }
}