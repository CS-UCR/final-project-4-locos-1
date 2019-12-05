import React from 'react'
import { FlatList ,Text, View, Button, Alert} from 'react-native'
import { useSelector} from 'react-redux'
import { useDispatch } from 'react-redux';
import * as workspaceAction from '../authentication/store/Action/workspace'
import workspace from '../authentication/store/Reducer/workspace'

const WorkSpaceInfo = props => {
    const dispatch = useDispatch();
    const userWorkspaces = useSelector( state => state.WorkSpace.userWorkspaces)

    const deleteHandler = (id) => {
        let action = workspaceAction.deleteWorkSpace(
            id
        )
        try{
            dispatch(action)
        }catch(err){
            alert(err)
        }
    }

    return<FlatList data={userWorkspaces}
     keyExtractor={workspace => workspace.id} 
      renderItem={workspaceData => 
      <View>
      <Text>{workspaceData.description}</Text>
      <Button title="Edit" onPress={() => {}}/>
      <Button title="Delete" onPress={deleteHandler(workspaceData.item.id)}/>
      </View>}
      />
}

export default WorkSpaceInfo