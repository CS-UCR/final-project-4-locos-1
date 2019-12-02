import { DELETE_WORKSPACE, CREATE_WORKSPACE, UPDATE_WORKSPACE, SET_WORKSPACE} from '../Action/workspace'
import Workspace from '../../../models/workspace'

const initialState = {
    userWorkspaces: [],
    authWorkspaces: [],
    availableWorkspaces: []
};

export default(state = initialState, action) => {
    switch(action.type){
        case SET_WORKSPACE:
            return{
                availableWorkspaces: action.workspaces,
                authWorkspaces: action.authWorkspaces
            }
        case DELETE_WORKSPACE:
            return {
                ...state,
                availableWorkspaces: state.availableWorkspaces.filter(
                    workspace => workspace.id !== action.workspaceId
                ),
                authWorkspaces: state.authWorkspaces.filter(
                    workspace => workspace.id !== action.workspaceId
                )
            }
        case CREATE_WORKSPACE:
            const accessCode = action.workspaceData.id.substring(0,5)
            console.log("Access Code: ", accessCode)
            const newWorkSpace = new Workspace(
                action.workspaceData.id,
                action.workspaceData.workspaceTitle,
                action.workspaceData.authID,
                action.workspaceData.color,
                action.workspaceData.imageUri,
                action.workspaceData.accessCode

            );
            console.log("new workspace ", newWorkSpace)
            return{
                ...state,
                availableWorkspaces: state.availableWorkspaces.concat(newWorkSpace),
                authWorkspaces: state.authWorkspaces.concat(newWorkSpace)
            }
        case UPDATE_WORKSPACE:
            const workspaceAuthIndex = state.authWorkspaces.findIndex(
                workspace => workspace.id === action.workspaceId
            )

            const updatedWorkspace = new Workspace(
                action.workspaceId,
                action.workspaceData.workspaceTitle,
                state.authWorkspaces[workspaceAuthIndex].authID,
                action.workspaceData.color,
                action.workspaceData.imageUri,
                state.authWorkspaces[workspaceAuthIndex].accessCode
            );

            const updatedAuthWorkspace = [...state.authWorkspaces];
            updatedAuthWorkspace[workspaceAuthIndex] = updatedWorkspace;

            const availableWorkspacesIndex = state.availableWorkspaces.findIndex(
                workspace => workspace.id === action.workspaceId
            );

            const updatedAvailableWorkspaces = [...state.availableWorkspaces]
            updatedAvailableWorkspaces[availableWorkspacesIndex] = updatedWorkspace;

            return {
                ...state,
                availableWorkspaces: updatedAvailableWorkspaces,
                authWorkspaces: updatedAuthWorkspace
            };
        default:
            return state
    }
}