import React from 'react'
import {createAppContainer, createSwitchNavigator}  from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
import { createDrawerNavigator } from 'react-navigation-drawer';

import { Button, Platform } from 'react-native';
import * as authActions from '../authentication/store/Action/auth'
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors'


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


import UserWorkspacesScreen from '../Screens/WorkSpace/user/UserWorkspacesScreen'
import UserEditWorkspaceScreen from '../Screens/WorkSpace/user/EdithWorkspaceScreen'
import IndividualWorkspaceScreen from '../Screens/WorkSpace/WorkspaceScreen'

 

const Features = createStackNavigator(
    {
        
        
        MainRoute: Menu,
        TitleRoute: Title,
        MainScreenRoute: MainScreen,
        MapRoute: myMap,
        UserInfoRoute: UserInfo,
        FeedRoute: Feed,
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

const WorkSpacesNavigator = createStackNavigator(
    {
        UserWorkSpacesCategories: UserWorkspacesScreen,
        WorkSpace: IndividualWorkspaceScreen,
        UserEditWorkspaceScreen :UserEditWorkspaceScreen,
        CreateWorkspace: CreateWorkspace,
    }, {
        defaultNavigationOptions: {
            headerStyle: {
              backgroundColor: Platform.OS === 'android' ? Colors.workSpaceNavigationPrimaryColor : ''
            },
            headerTintColor:
              Platform.OS === 'android' ? 'white' : Colors.workSpaceNavigationPrimaryColor,
          }
    }
);


const Drawer = createDrawerNavigator(
    {
        MainRoute: Menu,
        TitleRoute: Title,
        FeedRoute: Feed,
        MapRoute: myMap,
        UserInfoRoute: UserInfo,
        CreateWorkspaceRoute: CreateWorkspace,
        MainScreenDrawer: MainScreen,
        WorkspacesDrawer : WorkSpacesNavigator
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
    },
    {
        defaultNavigationOptions: {
            headerTitle: 'Studdy Buddy'
        }
    }
)

const MainNavigator = createSwitchNavigator({
    // UserWorkspacesDrawer : UserWorkspacesScreen, // remove when finish editing workpsaces
    Auth: Authentication,
    DrawerNavigation: Drawer,
    
})


export default createAppContainer(MainNavigator)