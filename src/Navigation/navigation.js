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
import UserInfo from '../components/UserInfo'
import CreateWorkspace from '../components/CreateWorkspace'
import { createDrawerNavigator } from 'react-navigation-drawer';
// import DrawerNavigation from '../Navigation/DrawerNavigation'

const Features = createStackNavigator(
    {
        
        
        MainRoute: Menu,
        TitleRoute: Title,
        MainScreenRoute: MainScreen,
        MapRoute: myMap,
        UserInfoRoute: UserInfo,
        FeedRoute: Feed,
        CreateWorkspaceRoute: CreateWorkspace,
    },{
        defaultNavigationOptions: ({ navigation }) => ({
            headerRight: (
                  <Button
                    title="Logout"
                    onPress={() => navigation.navigate('Auth')}
                  />
            )
    }
    
)
    }
)


const Drawer = createDrawerNavigator(
    {
        MainRoute: Menu,
        TitleRoute: Title,
        FeedRoute: Feed,
        MapRoute: myMap,
        UserInfoRoute: UserInfo,
        CreateWorkspaceRoute: CreateWorkspace,
        MainScreenDrawer: {
            screen: MainScreen,
        }
    },
    {
        initialRouteName: 'MainScreenDrawer',
        drawerPosition: 'right',
        drawerBackgroundColor: '#C0C0C0',
        contentOptions: {
            labelStyle: {
              color: 'white',
            },
            activeBackgroundColor: '#A0A0A0',
        }
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
    DrawerNavigation: Drawer,
    
})


export default createAppContainer(MainNavigator)