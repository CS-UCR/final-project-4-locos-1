import React, { useSelector } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'

import { WORKSPACES } from '../../data/dummy-data'
import WorkSpaceItem from '../../authentication/component/WorkSpaceItem'
import { HeaderTitle } from 'react-navigation-stack'


const WorkspaceScreen = props => {
    const renderWorkspace = itemData => {
        return(
            <WorkSpaceItem
            workspaceTitle = {itemData.item.workspaceTitle}
            color = {itemData.item.color}
            onSelectWorkSpace= {() => {}}
            />
        )
    }

    const workspaceId = props.navigation.getParam('workspaceId')
    const displayedWorkspace = WORKSPACES.filter(workspace => workspace.id === workspaceId);

    return(
        <View style={styles.screen}>
            <FlatList
                data={displayedWorkspace}
                keyExtractor={(item, index) => item.id}
                renderItem={renderWorkspace}
                style={{ width: '100%' }}
            />
        </View>
    )

    
}


WorkspaceScreen.navigationOptions =  navigationData => {
    const workspaceTitle = navigationData.navigation.getParam('workspaceTitle');
    
    return{headerTitle: workspaceTitle}
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15
    }
  });
  

export default WorkspaceScreen
