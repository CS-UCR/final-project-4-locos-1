import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';

import{styles} from '../styles/styles';

export default class Feed extends Component{

    render(){

        return(
            <View style={styles.center}>
                <Text> This is the feed</Text>
                <Button title = 'Go to Main Menu' 
                        onPress = {()=> this.props.navigation.navigate('MainRoute')} />
            </View>

        )
    }

}