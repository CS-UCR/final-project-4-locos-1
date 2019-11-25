import { DELETE_WORKSPACE, CREATE_WORKSPACE, UPDATE_WORKSPACE, SET_WORKSPACE} from '../Action/workspace'
import Workspace from '../../../models/workspace'

const initialState = {
    userWorkspaces: []
    // userWorkspaces: WORKSPACES.filter(workspace => workspace.ownerId === ' ' )
};

export default(state = initialState, action) => {
    switch(action.type){
        case SET_WORKSPACE:
            return{
                ...state,
                userWorkspaces: action.workspaces
            }
        case DELETE_WORKSPACE:
            return {
                ...state,
                userWorkspaces: state.userWorkspaces.filter(
                    workspace => workspace.id !== action.workspaceId
                )
            }
        case CREATE_WORKSPACE:
            const newWorkSpace = new Workspace(
                action.workspaceData.id,
                action.workspaceData.workspaceTitle,
                action.workspaceData.authID,
                action.workspaceData.color,
                action.workspaceData.imageUri

            );
            return{
                ...state,
                userWorkspaces: state.userWorkspaces.concat(newWorkSpace)
            }
        case UPDATE_WORKSPACE:
            Console.log("Update")
            console.log("Update Reducer: ", state.workspaceData)
            return state
        default:
            return state
    }
}