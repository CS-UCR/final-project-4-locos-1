import React, { useEffect , useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    FlatList,
    StyleSheet,
    ActivityIndicator,
    View,
    Text,
    Button,
    Alert,
} from 'react-native'

import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../authentication/component/utilites/HeaderButton'

import WorkSpaceGridTile from '../authentication/component/WorkSpaceGridTile'
import * as workspaceActions from '../authentication/store/Action/workspace'
import Colors from '../constants/Colors'

const WorkspacesScreen = props => {
    const [isLoading, setIsLoading ] = useState(false)
    const [error, setError] =  useState()
    const workspaces = useSelector(state =>  state.WorkSpaces.userWorkspaces)
    const dispatch =useDispatch();

    const deleteHandler = (workspaceId) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this workspace?',
            [{text: 'No', style: 'default'},
             {text:"Yes", style: 'destructive',
             onPress: () => {
                 dispatch(workspaceActions.deleteWorkSpace(workspaceId))
             }}])
    }

    const editHandler = (workspaceId) => {
        props.navigation.navigate('UserEditWorkspaceScreen',{workspaceId: workspaceId})
    }

    const addMembersHandler = (workspaceId) => {
        props.navigation.navigate('UserEditWorkspaceScreen',{workspaceId: workspaceId, functionality: 'Add Members'})
    }

    const createHandler = useCallback(async() => {
        console.log("Create Handlers")
        props.navigation.navigate('UserEditWorkspaceScreen',{functionality: 'Create Workspace' })
    },[])

    const loadWorkspaces = useCallback(async () => {
        setError(null)
        setIsLoading(true)
        try{
            await dispatch(workspaceActions.fetchWorkspace())
        } catch(err){
            setError(err.message)
        }
        setIsLoading(false)
    }, [dispatch, setIsLoading, setError]);

    useEffect(()=> {
        const willFocusSub = props.navigation.addListener('willFocus', loadWorkspaces)

        return () => {
            willFocusSub.remove()
        }
    }, [loadWorkspaces])

    useEffect(()=> {
        loadWorkspaces()
    }, [dispatch, loadWorkspaces])

    useEffect(( ) => {
        props.navigation.setParams({ create: createHandler });
    }, [createHandler])

    const renderGridItem = itemData => {
        return (
            <WorkSpaceGridTile
                workspaceTitle = {itemData.item.workspaceTitle}
                image = {itemData.item.imageUrl}
                color = {itemData.item.color}
                pickedImage = {itemData.item.imageUri}
                onSelect = {editHandler(itemData.item.id)}>

                <Button
                    color= {Colors.workSpaceNavigationPrimaryColor}
                    title= "Add Members"
                    onPress={addMembersHandler(itemData.item.id)}/>

                <Button
                    color= {Colors.workSpaceNavigationPrimaryColor}
                    title= "Delete"
                    onPress={deleteHandler.bind(this,itemData.item.id)}/>    
            </WorkSpaceGridTile>
        )
    }

    if(error){
        return(
            <View style ={styles.centered}>
                <Text> An error occurred!</Text>
                <Button title="Try again" onPress={loadWorkspaces} color={Colors.LoadIndicatorColor}/>
            </View>
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
            keyExtractor={(item, index) => item.id}
            data={workspaces}
            renderItem = {renderGridItem}
            numColumns = {1}/>
    )
};

WorkspacesScreen.navigationOptions = navigationData =>{
    const workSpaceCreator = navigationData.navigation.getParam('create')
    return {
        headerTitle: 'Workspace Categories',
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
};

const styles = StyleSheet.create({
    centered: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
  });

  export default WorkspacesScreen;