
export const createWorkSpace = (title, admin, members, setting) => {
    return async dispatch => {
        const response = await fetch('https://lokos-studybuddy.firebaseio.com/workspaces.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                title,
                admin,
                members,
                setting
            })
        });

        const resData = await response.json();
        console.log(resData)

        dispatch({
            type:CREATE_WORKSPACE,
            workspaceData:{
                id:resData.name,
                title,
                admin,
                members,
                setting
            }
        });
    }
};