import React, {Component} from 'react';
import {View, Text, Button, Platform, TouchableHighlight,StyleSheet, Picker, Image} from 'react-native';


export default class SpaceCard extends Component{

    constructor(props){
        super(props)
        this.state = {
            item: this.props.item,
        }

        console.log("item")
        console.log(this.state.item)
        console.log("key")
        console.log(this.state.key)
    }

    render(props){

       
        return(

        <TouchableHighlight onPress= {()=>{console.log("pushing button")}}>
          <View style = {{flexDirection: 'row'}}>
          <Image style = {{width : 25, height : 25}} source = {require("../../assets/location-symbol.jpg")}/>
          <Text> </Text>
          </View>
          </TouchableHighlight>
        )
    }
}