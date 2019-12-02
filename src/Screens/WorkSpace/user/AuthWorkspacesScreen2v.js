import React, { useEffect , useCallback, useState} from 'react'
import { View, Text, FlatList, Button, Platform, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../../../authentication/component/utilites/HeaderButton'

import WorkSpaceGridTile from '../../../authentication/component/WorkSpaceGridTile'
import * as workspaceActions from '../../../authentication/store/Action/workspace'
import Colors from '../../../constants/Colors'

const UserWorkspacesScreen = props => {
    const workspaces = useSelector(state =>  state.WorkSpaces.authWorkspaces)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] =  useState()
    const [isRefreshing, setIsRefreshing] = useState(false);
    const dispatch =useDispatch();

    const editWorkspaceHandler = id => {
        props.navigation.navigate('AuthEditWorkspaceScreen',{workspaceId: id, functionality: 'Edit Workspace'})
    }

    const deleteHandler = (workspaceId) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this workspace?',
            [{text: 'No', style: 'default'},
             {text:"Yes", style: 'destructive',
             onPress: () => {
                 dispatch(workspaceActions.deleteWorkSpace(workspaceId))
             }}])
    }

    const addMembersHandler = id => {
        props.navigation.navigate('AuthEditWorkspaceScreen', {workspaceId: id,functionality: 'Add Members'})
    }

    const createHandler = useCallback(async()=> {
        props.navigation.navigate('AuthEditWorkspaceScreen',{functionality: 'Create Workspace'})
    }, [])

    useEffect(( ) => {
        props.navigation.setParams({ create: createHandler });
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
        console.log("item Data",  itemData)
        return (
            <WorkSpaceGridTile
                workspaceTitle = {itemData.item.workspaceTitle}
                image = {itemData.item.imageUrl}
                color = {itemData.item.color}
                pickedImage = {itemData.item.imageUri}
                onSelect = {() => {editWorkspaceHandler(itemData.item.id)}}>

                <Button
                    color= {Colors.workSpaceNavigationPrimaryColor}
                    title= "Add Members"
                    onPress={() => {addMembersHandler(itemData.item.id)}}/>

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
                <Text> No WorkSpace found. Join or Create One! </Text>
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
    const workSpaceCreator = navigationData.navigation.getParam('create')
    return {
        headerTitle: 'Workspace Management',
        headerRight:(
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Create Workspace"
                    iconName={
                        Platform.OS === 'android' ? 'md-add' : 'ios-add'
                    }
                    onPress={workSpaceCreator}
                />
            </HeaderButtons>
        )
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