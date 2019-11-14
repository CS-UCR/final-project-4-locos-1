export const CREATE_WORKSPACE = 'CREATE_WORKSPACE';
export const DELETE_WORKSPACE = 'DELETE_WORKSPACE';


// export const deleteWorkSpace = workSpaceID =>{
//     return async (dispatch, getState) => {
//         const token =  getState().userAuth.token;
//         const response = await fetch(
//             `https://lokos-studybuddy.firebaseio.com/workspaces/${workSpaceID}.json?auth=${token}`,
//             {
//               method: 'DELETE'
//             }
//           );
//     };

//     if(!response.ok){
//         throw new Error("Something Wrong with delete Workspace")
//     }
//     dispatchEvent({ type: DELETE_WORKSPACE, workspaceID: workSpaceID})
// }


export const createWorkSpace = (settings) => {
    return async (dispatch, getState )=> {
        const userID =  getState().userAuth.userId
        console.log("user id", userID)
        const response = await fetch('https://lokos-studybuddy.firebaseio.com/workspaces.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                settings: settings,
                addUser:addUser
            })
        });

        const resData = await response.json();
        console.log(resData)

        dispatch({
            type:CREATE_WORKSPACE,
            workspaceData:{
                id:resData.name,
                settings: settings,
                addUser:addUser
            }
        });
    }
};