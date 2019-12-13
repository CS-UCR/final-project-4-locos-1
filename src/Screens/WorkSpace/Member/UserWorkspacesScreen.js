import React, { useEffect , useCallback, useState} from 'react'
import { View, Text, FlatList, Button, Platform, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../../../authentication/component/utilites/HeaderButton'

import WorkSpaceGridTile from '../../../authentication/component/WorkSpaceGridTile'
import DrawerIcon from '../../../Navigation/assets/drawerNav/DrawerIcon'
import * as workspaceActions from '../../../authentication/store/Action/workspace'
import Colors from '../../../constants/Colors'

const UserWorkspacesScreen = props => {
    const workspaces = useSelector(state =>  state.WorkSpaces.userWorkspaces)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] =  useState()
    const [isRefreshing, setIsRefreshing] = useState(false);
    const dispatch =useDispatch();

    console.log("Workspaces user :, ", workspaces)


    const editWorkspaceHandler = id => {
        props.navigation.navigate('AuthMap',{workspaceId: id, functionality: 'Study Spaces'})
    }

    const deleteHandler = (workspaceId) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this workspace?',
            [{text: 'No', style: 'default'},
             {text:"Yes", style: 'destructive',
             onPress: () => {
                 dispatch(workspaceActions.deleteJoinWorkspace(workspaceId))
             }}])
    }

    const createHandler = useCallback(async()=> {
        props.navigation.navigate('UserJoinWorkspacesScreen',{functionality: 'Join Workspace'})
    }, [])

    useEffect(( ) => {
        props.navigation.setParams({ join: createHandler });
    }, [createHandler])

    const loadWorkspaces = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(workspaceActions.fetchWorkspace())
        } catch (error) {
          setError(error.message);
        }
        setIsRefreshing(false);
      }, [dispatch, setIsRefreshing, setError]);

      useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadWorkspaces)
    
        return () => {
          willFocusSub.remove();
        };
      }, [loadWorkspaces]);
    
      useEffect(() => {
        setIsLoading(true);
        loadWorkspaces().then(() => {
          setIsLoading(false);
        });
      }, [dispatch, loadWorkspaces]);



    const renderGridItem = itemData => {
        return (
            <WorkSpaceGridTile
                workspaceTitle = {itemData.item.workspaceTitle}
                image = {itemData.item.imageUrl}
                color = {itemData.item.color}
                pickedImage = {itemData.item.imageUri}
                onSelect = {() => {editWorkspaceHandler(itemData.item.id)}}>

                {/* <Button
                    color= {Colors.workSpaceNavigationPrimaryColor}
                    title= "Add Members"
                    onPress={() => {addMembersHandler(itemData.item.id)}}/> */}

                <Button
                    color= {Colors.workSpaceNavigationPrimaryColor}
                    title= "Delete"
                    onPress={deleteHandler.bind(this,itemData.item.id)}/> 
            </WorkSpaceGridTile>
        )
    }


    if(isLoading){
        return(
            <View style ={styles.centered}>
                <ActivityIndicator size='large' color={Colors.LoadIndicatorColor} />
            </View>
        )
    }

    if(!isLoading && workspaces.length === 0){
        return(
            <View style ={styles.centered}>
                <Text> No WorkSpace found. Join One! </Text>
            </View>
        )
    }

    return (
        <FlatList
            onRefresh={loadWorkspaces}
            refreshing={isRefreshing}
            data={workspaces}
            keyExtractor={(item) => item.id}
            renderItem = {renderGridItem}
            numColumns = {1}/>
    )
};


UserWorkspacesScreen.navigationOptions = navigationData =>{
    const workSpaceCreator = navigationData.navigation.getParam('join')
    return {
        headerTitle: 'My Workspaces',
        headerRight: <DrawerIcon/>,
        headerLeft:(
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Join Workspace"
                    iconName={
                        Platform.OS === 'android' ? 'md-add' : 'ios-add'
                    }
                    onPress={workSpaceCreator}
                />
            </HeaderButtons>
        ),
        headerStyle: {
            backgroundColor: Colors.headerBackgoundColor,
        },
        headerTitleStyle:{
          color: Colors.headerTitleColor,
        },
    }
}

const styles = StyleSheet.create({
    centered: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
  });

export default UserWorkspacesScreen;