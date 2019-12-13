import Workspace from "../../../models/workspace";
import email from 'react-native-email'
import * as firebase from 'firebase'

export const CREATE_WORKSPACE = 'CREATE_WORKSPACE';
export const DELETE_WORKSPACE = 'DELETE_WORKSPACE';
export const UPDATE_WORKSPACE = 'UPDATE_WORKSPACE';
export const SET_WORKSPACE = 'SET_WORKSPACE'
export const ADD_MEMBERS = 'ADD_MEMBERS'
export const REMOVE_MEMBERS = 'REMOVE_MEMBERS'

const makeId = (length) => {
  let result = '';
  let characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


export const fetchWorkspace = () => {
    return async (dispatch, getState)=> {
      const userId = getState().userAuth.userId
        try{
            const response = await fetch('https://lokos-studybuddy.firebaseio.com/workspaces.json',
            );

            if(!response.ok){
                throw new Error('Something went wrong!')
            }
            const resData = await response.json();
            const loadedWorkspace = []
            for( const key in resData){
                loadedWorkspace.push(new Workspace(
                    key,
                    resData[key].workspaceTitle,
                    resData[key].authID,
                    resData[key].color,
                    resData[key].imageUri,
                    resData[key].accessCode,
                    resData[key].members))
            }

            const userWorkspaces = []

            for(const key in loadedWorkspace){
              if(loadedWorkspace[key].members.includes(userId)){
                userWorkspaces.push(loadedWorkspace[key])
              }
            }


            dispatch({type: SET_WORKSPACE, 
                      workspaces: loadedWorkspace,
                      authWorkspaces: loadedWorkspace.filter(workspace => workspace.authId === userId),
                      userWorkspaces: userWorkspaces
                    });
        }
        catch(err){
            throw err
        }
    }
}

export const deleteWorkSpace = workspaceId =>{
    return async (dispatch, getState) => {
        const token =  getState().userAuth.token;
        await fetch(
            `https://lokos-studybuddy.firebaseio.com/workspaces/${workspaceId}.json`,
            {
              method: 'DELETE'
            }
          );

          dispatch({ type: DELETE_WORKSPACE, workspaceId: workspaceId})
    };
}


export const deleteJoinWorkspace = workspaceId =>{
  return async (dispatch, getState) => {
      const authID =  getState().userAuth.userId;




      await firebase.database().ref(`/Users/${authID}/workspaces/`).once('value').then(async function(snapshot){
        let userWorkspaces = snapshot.val()
        let updatedWorkspace = []


        for( key in userWorkspaces){
          if(userWorkspaces[key] !== workspaceId){
            console.log("key")
            updatedWorkspace.push(userWorkspaces[key])
          }
        }

        await firebase.database().ref(`/Users/${authID}/workspaces/`).set(updatedWorkspace)
      })

      dispatch({ type: DELETE_WORKSPACE, workspaceId: workspaceId})
  };
}

export const removeMemberWorkspace = (workspaceId, memberId )=>{
  return async (dispatch) => {
      console.log("MemberID: ", workspaceId)

      await firebase.database().ref(`/Users/${memberId}/workspaces/`).once('value').then(async function(snapshot){
        let userWorkspaces = snapshot.val()
        let updatedWorkspace = []

        if(userWorkspaces){
          for( key in userWorkspaces){
            if(userWorkspaces[key] !== workspaceId){
              updatedWorkspace.push(userWorkspaces[key])
            }
          }

          await firebase.database().ref(`/Users/${memberId}/workspaces/`).set(updatedWorkspace)

        }
      })

      await firebase.database().ref(`/workspaces/${workspaceId}/members/`).once('value').then(async function(snapshot){
        let memberList = snapshot.val()
        let updatedMemberList = []

        for( key in memberList){
          if(memberList[key] !== memberId){
            console.log("key")
            updatedMemberList.push(memberList[key])
          }
        }

        await firebase.database().ref(`/workspaces/${workspaceId}/members/`).set(updatedMemberList)
      })



      // dispatch({})
  };
} 


export const createWorkSpace = (workspaceTitle, color, imageUri) => {
    return async (dispatch, getState )=> {
        const authID =  getState().userAuth.userId
        const accessCode = makeId(5)
        const response = await fetch('https://lokos-studybuddy.firebaseio.com/workspaces.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                workspaceTitle,
                color,
                authID,
                imageUri,
                accessCode,
                members: [authID]
            })


        });

        const resData = await response.json();

          await firebase.database().ref(`/Users/${authID}/workspaces/`).once('value').then(async function(snapshot){
          let userWorkspaces = snapshot.val()
          let updatedWorkspace = []
  
          if(userWorkspaces){
            updatedWorkspace = userWorkspaces
            updatedWorkspace.push(resData.name)
          }
          else{
            updatedWorkspace.push(resData.name)
          }
  
          await firebase.database().ref(`/Users/${authID}/workspaces/`).update(updatedWorkspace)
        })


        dispatch({
            type:CREATE_WORKSPACE,
            workspaceData:{
                id:resData.name,
                workspaceTitle,
                authID,
                color,
                imageUri,
                accessCode,
                members:[authID]
                
            }
        });
    }
};


export const updateWorkSpace = (id, workspaceTitle, color, imageUri) => {
    return async dispatch => {
      const response =  await fetch(`https://lokos-studybuddy.firebaseio.com/workspaces/${id}.json`, 
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            workspaceTitle: workspaceTitle,
            color: color,
            imageUri: imageUri
          })
        }
      );

      if(!response.ok){
        throw new Error('Something went wrong!')
      }
  
      dispatch({
        type:CREATE_WORKSPACE,
            workspaceId: id,
            workspaceData:{
                workspaceTitle,
                authID,
                color,
                imageUri
            }
      });
    };
  };

  export const addMembers = (to ,workspaceTitle, accessCode) => {
    // const to = ['fgall002@ucr.edu', 'kikingallego13@hotmail.com'] // string or array of email addresses
    email(to, {
        subject: 'Studdy Buddy!!!',
        body:`You have been invited to join ${workspaceTitle}. The access code is ${accessCode}`
    }).catch(console.error)
}


export const joinWorkspace = (id,members) => {
  return async (dispatch, getState) => {
    const authID =  getState().userAuth.userId
    const response =  await fetch(`https://lokos-studybuddy.firebaseio.com/workspaces/${id}.json`, 
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          members : members
        })
      }
    );

      await firebase.database().ref(`/Users/${authID}/workspaces/`).once('value').then(async function(snapshot){
        let userWorkspaces = snapshot.val()
        let updatedWorkspace = []

        if(userWorkspaces){
          updatedWorkspace = userWorkspaces
          updatedWorkspace.push(id)
        }
        else{
          updatedWorkspace.push(id)
        }

        await firebase.database().ref(`/Users/${authID}/workspaces/`).update(updatedWorkspace)
      })

    if(!response.ok){
      throw new Error('Something went wrong!')
    }

    dispatch({
      type:ADD_MEMBERS,
          workspaceId: id,
          workspaceData:{
            memberList: members
          }
    });
  };
};


export const deleteMember = (workspaceId, memberId) => {
  console.log("Member")
  return async dispatch => {
    let membersData = []
      await firebase.database().ref(`/workspaces/${workspaceId}/members`).once('value').then(async function(snapshot){
      let retrieveData = snapshot.val()
      console.log("retrieve data: ", retrieveData)
      console.log("workspace ID: ", workspaceId)
      console.log("member ID: ", memberId)
      membersData = retrieveData.filter( member => member !== memberId)

    })

    console.log("member Data: ", membersData)

    const response =  await fetch(`https://lokos-studybuddy.firebaseio.com/workspaces/${id}.json`, 
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workspaceTitle: workspaceTitle,
          color: color,
          imageUri: imageUri
        })
      }
    );

    if(!response.ok){
      throw new Error('Something went wrong!')
    }

    dispatch({
    });
  };
};
