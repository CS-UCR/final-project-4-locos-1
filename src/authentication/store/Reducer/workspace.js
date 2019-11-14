import { CREATE_WORKSPACE} from '../Action/workspace'

const initialState = {
};

export default(state = initialState, action) => {
    switch(action.type){
        case CREATE_WORKSPACE:
            return state
        default:
            return state
    }
}