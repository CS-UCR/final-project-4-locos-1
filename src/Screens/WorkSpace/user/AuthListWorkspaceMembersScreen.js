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
    console.log("Edith WOrkspace ", editedWorkspace)
    const [memberList, setMemberList] = useState()
    const dispatch = useDispatch();

    let TouchableCmp = TouchableOpacity

    if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableCmp = TouchableNativeFeedback;
    }

    const listWorkspace = async(workspaceId) => {
        await firebase.database().ref(`/workspaces/${workspaceId}/members`).once('value').then(async function(snapshot){
            workspaceMembers = snapshot.val()
            let membersInfo = []
            if(workspaceMembers){
                for(member in workspaceMembers){
                    await firebase.database().ref(`/Users/${member}`).once('value').then(async function(snapshot){
                        let userList = snapshot.val()
                        console.log("userList: ", userList)
                        console.log("before key")
                        for( key in userList){
                            if(userList[key].profile){
                                console.log("inside key")
                                membersInfo.push({key:key,profile:userList[key].profile})
                            }
                        }
                    })
                }
            }
            console.log("member info: ", membersInfo)
            setMemberList(membersInfo)

        })


        // await firebase.database().ref(`/Users/`).once('value').then(async function(snapshot){
        //     let userList = snapshot.val()
        //     let memberInfo = []

        //     for( key in userList){
        //         if(userList[key].profile){
        //             memberInfo.push({key:key,profile:userList[key].profile})
        //         }
        //     }

        //     const workspaceMembers = await firebase.database().ref(`/workspaces/${workspaceId}/`).once('value')

        //     setMemberList(memberInfo)
        // })
    }

    const deleteMemberHandler = async (memberId) =>{
        Alert.alert('Are you sure?', 'Do you really want to delete this member?',
        [{text: 'No', style: 'default'},
         {text:"Yes", style: 'destructive',
         onPress: () => { 
             dispatch(workspaceActions.deleteMember(editedWorkspace,memberId))
         }}])
    }


    const renderMembers = itemData => {
        return(
            <View style={styles.centered}>
                <TouchableCmp onPress={deleteMemberHandler.bind(this,itemData.item.key)}> 
                    <Text style={styles.textSize}> {itemData.item.profile.firstname + ' ' + itemData.item.profile.lastname}</Text>
                </TouchableCmp>
            </View>
        )
    }

    useEffect(() => {
        listWorkspace(editedWorkspace)
      }, []);

    return(

        <FlatList
            data={memberList}
            keyExtractor={(item) => item.id}
            renderItem = {renderMembers}
            numColumns = {1}/>
    )
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