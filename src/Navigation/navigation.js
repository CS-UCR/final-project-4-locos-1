import React from 'react'
import {createAppContainer, createSwitchNavigator}  from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
import { createDrawerNavigator , DrawerNavigatorItems} from 'react-navigation-drawer';

import { Button, Platform, View, SafeAreaView } from 'react-native';
import * as authActions from '../authentication/store/Action/auth'
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors'


import AuthenticationMenu from '../authentication/AuthenticationMenu'
import SignUp from '../authentication/User/SignUpScreen'
import Login from '../authentication/User/LoginScreen'

import MainScreen from '../components/MainScreen'
import Feed from '../components/Feed'
import myMap from '../components/myMap'
import UserInfo from '../components/UserInfo'
import CreateWorkspace from '../components/CreateWorkspace'
// import DrawerNavigation from '../Navigation/DrawerNavigation'
import Dashboard from '../components/dashboardComponents/Dashboard'
import UpdateUserInfo from '../components/UpdateUserInfo'


import AuthWorkspacesScreen from '../Screens/WorkSpace/user/AuthWorkspacesScreen2v'
import AuthEditWorkspaceScreen from '../Screens/WorkSpace/user/AuthEdithWorkspaceScreen'
import AuthListWorkspaceMemberScreen from  '../Screens/WorkSpace/user/AuthListWorkspaceMembersScreen'
import AuthMap from '../components/AuthMap'

import UserWorkspacesScreen from '../Screens/WorkSpace/Member/UserWorkspacesScreen'
import UserJoinWorkspacesScreen from '../Screens/WorkSpace/Member/UserJoinWorkspacesScreen'
// import UserWorkspaceMap from '../components/WorkSpaceMap'

const MainScreenStack = createStackNavigator({
  MainScreenRoute: MainScreen,
})

const UpdateUserInfoStack = createStackNavigator({
  UpdateUserInfoRoute: UpdateUserInfo,
})

const MapStack = createStackNavigator({
  MapRoute: myMap,
});

const DashboardStack = createStackNavigator({
  DashboardRoute: Dashboard,
})

const AuthWorkSpacesNavigator = createStackNavigator(
    {
        
        
        // MainRoute: Menu,
        // TitleRoute: Title,
        AuthWorkspacesScreen: AuthWorkspacesScreen,
        AuthEditWorkspaceScreen :AuthEditWorkspaceScreen,
        AuthMap:AuthMap,
        AuthListWorkspaceMemberScreen: AuthListWorkspaceMemberScreen,
        MainScreenRoute: MainScreenStack,
        MapRoute: MapStack,
        UserInfoRoute: UserInfo,
        UpdateUserInfoRoute: UpdateUserInfoStack,
        FeedRoute: Feed,
        CreateWorkspaceRoute: CreateWorkspace,
        DashboardRoute: DashboardStack,
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

const UserWorkSpacesNavigator = createStackNavigator(
  {
       UserWorkspacesScreen: UserWorkspacesScreen,
       UserJoinWorkspacesScreen:UserJoinWorkspacesScreen
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
      'Main Screen': {
        screen: MainScreenStack,
      },
        'Study Space Map': MapStack,
        'Dashboard': DashboardStack,
        'Update Profile': UpdateUserInfoStack,
        'My Workspaces':UserWorkSpacesNavigator ,
        'Workspaces Management' : AuthWorkSpacesNavigator
    },
    {
        initialRouteName: 'Main Screen',
        drawerPosition: 'right',
        drawerBackgroundColor: Colors.drawerNavigatorBackgroundColor,
        contentOptions: {
            labelStyle: {
              color: Colors.drawerNavigatorTextColor,
            },
            activeBackgroundColor: Colors.drawerNavigatorActivationColor,
        },
        contentComponent: props => {
            const dispatch = useDispatch()
            return (
              <View style={{ flex: 1, paddingTop: 20 }}>
                <SafeAreaView forceInset={{ bottom: 'always', horizontal: 'never' }}>
                  <DrawerNavigatorItems {...props} />
                  <Button
                    title="Logout"
                    color={Colors.drawerNavigatorTextColor}
                    onPress={() => {
                        dispatch(authActions.logout())
                        props.navigation.navigate('AuthenticationMenu')
                    
                    }}
                  />
                </SafeAreaView>
              </View>
            );
          }
    },
)



const Authentication = createStackNavigator(
    {
        AuthenticationMenu: AuthenticationMenu,
        SignUp: SignUp,
        Login:Login,
        UserInfo:UserInfo
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