import * as FileSystem from 'expo-file-system'

export const ADD_IMAGE = 'ADD_IMAGE'

export const addImage = ( workspaceId,image) => {
    return async dispatch => {
        const fileName = image.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName;

        try {
            await FileSystem.moveAsync({
                from: image,
                to : newPath
            });
        } catch(error){
            console.log(error);
            throw error
        }

        dispatch({type: ADD_IMAGE, placeData: {workspaceId: workspaceId, image:newPath}})
    }
}