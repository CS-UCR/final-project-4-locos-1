import React from 'react';
import {createAppContainer}  from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import MainScreen from '../components/MainScreen';
import myMap from '../components/myMap';

const myMapStack = createStackNavigator({
    myMapRoute: myMap
});

const MainScreenStack = createStackNavigator({
    MainScreenRoute: MainScreen
});

const BottomTabNavigation = createBottomTabNavigator(
    {
        MainScreenTab: MainScreenStack,
        myMapTab: myMapStack,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: () => {
                const { routeName } = navigation.state;
                if (routeName === 'MainScreen') {
                    return (
                        <Icon name='control-play' size={30} color='grey'/>
                    );
                } else {
                    return (
                        <Icon name='map' size={30} color='grey'/>
                    );
                }
            },
        }),
        initialRouteName: 'MainScreenRoute',    
        tabBarOptions: {
            activeTintColor: '#663333',
            inactiveTintColor: '#808080',
        },
    }
);

const BottomTabsStack = createStackNavigator({
    BottomTabsRoute: BottomTabNavigation
});

  export default createStackNavigator({BottomTabNavigation}, {headerMode: 'none'});