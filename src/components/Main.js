import React, {Component} from 'react';
import {Alert,View, Text, Button} from 'react-native';
import DrawerIcon from '../Navigation/assets/drawerNav/DrawerIcon';

import{styles} from '../styles/styles';
import * as firebase from 'firebase'
export default class Main extends Component{
    
    constructor(props){
        super(props)

        this.state = {
            currentUser : null,
            userInfo : null,
        }
    }

    static navigationOptions = () => {
        return {
            headerRight: <DrawerIcon/>,
            headerStyle: {
                backgroundColor: '#E0E0E0',
            },
        };
    };

    redirectToProfile(){
        this.props.navigation.navigate('UserInfoRoute')
        Alert.alert('','Update Your Profile!',[{text:'Okay'}])
    }
    async componentDidMount(){

        var self = this;
        await firebase.auth().onAuthStateChanged(function(user){


            if(user){

                //check if user filled profile
                firebase.database().ref('/Users/').child(user.uid).once('value').then(function(snapshot){

                    if (snapshot.exists()){
                        //do nothing
                        console.log("user exists")
                        self.setState({
                            currentUser: user,
                            userInfo: snapshot.val()
                        })

                    }
                    else{
                        console.log("user does not exist")
                        self.redirectToProfile()

                    }


                })

            }
        })
    }
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