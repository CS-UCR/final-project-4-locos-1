import {createAppContainer,} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import Title from '../components/Title'
import Feed from '../components/Feed'
import Menu from '../components/Main'
import UserInfo from '../components/UserInfo';
import CreateWorkspace from '../components/CreateWorkspace';
import MainScreen from '../components/MainScreen'
import { createStackNavigator } from 'react-navigation-stack';
const MenuStack = createStackNavigator({
    MenuRoute: Menu,
});

const TitleStack = createStackNavigator({
    TitleRoute: Title,
});

const FeedStack = createStackNavigator({
    FeedRoute: Feed,
});

const UserInfoStack = createStackNavigator({
    UserInfoRoute: UserInfo,
});

const CreateWorkspaceStack = createStackNavigator({
    CreateWorkspaceRoute: CreateWorkspace,
});

const MainScreenStack = createStackNavigator({
    MainScreenRoute: MainScreen,
});

const DrawerNavigation = createDrawerNavigator(
    {
        MenuDrawer: MenuStack,
        TitleDrawer: TitleStack,
        FeedDrawer: FeedStack,
        UserInfoDrawer: UserInfoStack,
        CreateWorkspaceDrawer: CreateWorkspaceStack,
        MainScreenDrawer: {
            screen: MainScreenStack,
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
);

export default createAppContainer(DrawerNavigation);