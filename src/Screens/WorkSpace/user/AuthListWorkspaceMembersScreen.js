import React , { useEffect, useState } from 'react'
import * as firebase from 'firebase'
import * as workspaceActions from '../../../authentication/store/Action/workspace'
import { useSelector, useDispatch } from 'react-redux';
import {
    TouchableOpacity,
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    Platform,
    Alert,
    TouchableNativeFeedback
  } from 'react-native';

const listWorkspaceMember = (props) => {
    const editedWorkspace = props.navigation.getParam('workspaceId').id
    const authID = useSelector(state =>  state.userAuth.userId)
    const [memberList, setMemberList] = useState([])
    const dispatch = useDispatch();

    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }

    const listWorkspace = async(workspaceId) => {
        await firebase.database().ref(`/workspaces/${workspaceId}/members/`).once('value').then(async function(snapshot){
            workspaceMembers = snapshot.val()

            let users  = []

            await firebase.database().ref(`/Users/`).once('value').then(async function(snapshot){
                users = snapshot.val()
            })
            let membersInfo = []
            if(workspaceMembers){
                for(member in workspaceMembers){
                    for(user in users){
                        if(workspaceMembers[member] === user && user !== authID){
                            membersInfo.push({userID: user, userInfo: users[user]})
                        }
                    }

                }
            }
            setMemberList(membersInfo)

        })
    }

    const deleteMemberHandler = async (memberId) =>{
        console.log("Member id: ", memberId)
        Alert.alert('Are you sure?', 'Do you really want to delete this member?',
        [{text: 'No', style: 'default'},
         {text:"Yes", style: 'destructive',
         onPress: () => { 
             dispatch(workspaceActions.removeMemberWorkspace(editedWorkspace,memberId))
         }}])
    }


    const renderMembers = itemData => {
        console.log("ItemData: ", itemData.item.userID)
        return(
            <View style={styles.centered}>
                <TouchableCmp onPress={deleteMemberHandler.bind(this,itemData.item.userID,)}> 
                    <Text style={styles.textSize}> {itemData.item.userInfo.profile.firstname + ' ' + itemData.item.userInfo.profile.lastname}</Text>
                </TouchableCmp>
            </View>

        )
    }

    useEffect(() => {
        listWorkspace(editedWorkspace)
      }, []);


    if(memberList.length === 0){
        return( <View style={styles.centered}>
            <Text> No member in workspace yet!</Text>
        </View>)
    }
    else{

        return(
            <FlatList
                data={memberList}
                keyExtractor={(item) => item.id}
                renderItem = {renderMembers}
                numColumns = {1}/>
        )
    }
}


const styles = StyleSheet.create({
    centered: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textSize:{
        fontSize: '20'
    }
})

export default listWorkspaceMember