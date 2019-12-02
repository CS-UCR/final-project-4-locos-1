import { DELETE_WORKSPACE, CREATE_WORKSPACE, UPDATE_WORKSPACE, SET_WORKSPACE} from '../Action/workspace'
import Workspace from '../../../models/workspace'

const initialState = {
    userWorkspaces: [],
    authWorkspaces: []
    // userWorkspaces: WORKSPACES.filter(workspace => workspace.ownerId === ' ' )
};

export default(state = initialState, action) => {
    switch(action.type){
        case SET_WORKSPACE:
            return{
                userWorkspaces: action.workspaces,
                authWorkspaces: action.authWorkspaces
            }
        case DELETE_WORKSPACE:
            return {
                ...state,
                userWorkspaces: state.userWorkspaces.filter(
                    workspace => workspace.id !== action.workspaceId
                ),
                authWorkspaces: state.authWorkspaces.filter(
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
                userWorkspaces: state.userWorkspaces.concat(newWorkSpace),
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
                action.workspaceData.imageUri
            );

            const updatedAuthWorkspace = [...state.authWorkspaces];
            updatedAuthWorkspace[workspaceAuthIndex] = updatedWorkspace;

            const userWorkspacesIndex = state.userWorkspaces.findIndex(
                workspace => workspace.id === action.workspaceId
            );

            const updatedUserWorkspaces = [...state.userWorkspaces]
            updatedUserWorkspaces[userWorkspacesIndex] = updatedWorkspace;

            return {
                ...state,
                userWorkspaces: updatedUserWorkspaces,
                authWorkspaces: updatedAuthWorkspace
            };
        default:
            return state
    }
}