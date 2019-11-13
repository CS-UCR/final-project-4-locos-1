import React from 'react'
import {createAppContainer, createSwitchNavigator}  from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
import { SafeAreaView, Button, View } from 'react-native';

import * as authActions from '../authentication/store/Action/auth'
import { useDispatch } from 'react-redux';


import AuthenticationMenu from '../authentication/AuthenticationMenu'
import SignUp from '../authentication/User/SignUpScreen'
import Login from '../authentication/User/LoginScreen'
import MainScreen from '../components/MainScreen'

import Title from '../components/Title'
import Feed from '../components/Feed'
import Menu from '../components/Main'
import myMap from '../components/myMap'

const Features = createStackNavigator(
    {
        MainRoute: Menu,
        TitleRoute: Title,
        FeedRoute: Feed,
        MainScreenRoute: MainScreen,
        MapRoute: myMap,
    },{
        defaultNavigationOptions: ({ navigation }) => ({
            headerRight: (
                <View style={{ flex: 1, paddingBottom: 20 }}>
                <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                  <Button
                    title="Logout"
                    onPress={() => navigation.navigate('Parametres')}
                    onPress={() => {
                      dispatch(authActions.logout());
                    }}
                  />
                </SafeAreaView>
              </View>
            )
    }
    
)
    }
)



const Authentication = createStackNavigator(
    {
        AuthenticationMenu: AuthenticationMenu,
        SignUp: SignUp,
        Login:Login
    }
)

const MainNavigator = createSwitchNavigator({
    Auth: Authentication,
    Features: Features
})


export default createAppContainer(MainNavigator)