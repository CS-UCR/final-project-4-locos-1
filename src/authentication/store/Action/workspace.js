import Workspace from "../../../models/workspace";
import { auth } from "firebase";

export const CREATE_WORKSPACE = 'CREATE_WORKSPACE';
export const DELETE_WORKSPACE = 'DELETE_WORKSPACE';
export const UPDATE_WORKSPACE = 'UPDATE_WORKSPACE';
export const SET_WORKSPACE = 'SET_WORKSPACE'


export const fetchWorkspace = () => {
    return async (dispatch)=> {
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
                    resData[key].imageUri))
            }
            dispatch({type: SET_WORKSPACE, workspaces: loadedWorkspace})
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
        // console.log("user id", userID)
        const response = await fetch('https://lokos-studybuddy.firebaseio.com/workspaces.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                workspaceTitle,
                color,
                authID,
                imageUri
            })
        });

        const resData = await response.json();
        // console.log(resData)

        dispatch({
            type:CREATE_WORKSPACE,
            workspaceData:{
                id:resData.name,
                workspaceTitle,
                authID,
                color,
                imageUri
            }
        });
    }
};


export const updateWorkSpace = (id, workspaceTitle, color, imageUri) => {
    return async dispatch => {
        await fetch(`https://lokos-studybuddy.firebaseio.com/workspaces/${id}.json`, 
        {
          method: 'PUT',
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
