import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';

import{styles} from '../styles/styles';

export default class Main extends Component{
    
    render(){

        return(
            <View style={styles.center}>
                <Text> Main Menu </Text>
                <Button title = 'Go to Feed' onPress = {()=> this.props.navigation.navigate('FeedRoute')} />
                <Button title = 'Go to Map' onPress = {()=> this.props.navigation.navigate('MapRoute')} />
                <Button title = 'Go to Title' onPress = {()=> this.props.navigation.navigate('TitleRoute')} />
                <Button title = 'Go to MainScreen' onPress = {()=> this.props.navigation.navigate('MainScreenRoute')} />
                <Button title = 'Go to UserInfo' onPress = {()=> this.props.navigation.navigate('UserInfoRoute')} />
                <Button title = 'Go to CreateWorkspace' onPress = {()=> this.props.navigation.navigate('CreateWorkspaceRoute')} />
            </View>

        )
    }

}