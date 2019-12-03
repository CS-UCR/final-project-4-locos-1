import Workspace from "../../../models/workspace";
import email from 'react-native-email'
import { auth } from "firebase";

export const CREATE_WORKSPACE = 'CREATE_WORKSPACE';
export const DELETE_WORKSPACE = 'DELETE_WORKSPACE';
export const UPDATE_WORKSPACE = 'UPDATE_WORKSPACE';
export const SET_WORKSPACE = 'SET_WORKSPACE'
export const ADD_MEMBERS = 'ADD_MEMBERS'

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
            dispatch({type: SET_WORKSPACE, 
                      workspaces: loadedWorkspace,
                      authWorkspaces: loadedWorkspace.filter(workspace => workspace.authId === userId) 
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

export const createWorkSpace = (workspaceTitle, color, imageUri) => {
    return async (dispatch, getState )=> {
        const authID =  getState().userAuth.userId
        const accessCode = makeId(5)
        //console.log("user id", userID)
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
                accessCode
            })
        });

        const resData = await response.json();

        dispatch({
            type:CREATE_WORKSPACE,
            workspaceData:{
                id:resData.name,
                workspaceTitle,
                authID,
                color,
                imageUri,
                accessCode
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

  export const addMembers = (too ,workspaceTitle, accessCode) => {
    const to = ['fgall002@ucr.edu', 'kikingallego13@hotmail.com'] // string or array of email addresses
    email(to, {
        subject: 'Studdy Buddy!!!',
        body:`You have been invited to join ${workspaceTitle}. The access code is ${accessCode}`
    }).catch(console.error)
}


export const joinWorkspace = (id) => {
  return async (dispatch, getState) => {
    const authID =  getState().userAuth.userId
    const getMembers = getState().WorkSpaces.availableWorkspaces
    console.log("Get members ", getMembers)
    const response =  await fetch(`https://lokos-studybuddy.firebaseio.com/workspaces/${id}.json`, 
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          members : authID
        })
      }
    );

    if(!response.ok){
      throw new Error('Something went wrong!')
    }

    dispatch({
      type:ADD_MEMBERS,
          workspaceId: id,
          workspaceData:{
            newMember: authID
          }
    });
  };
};
