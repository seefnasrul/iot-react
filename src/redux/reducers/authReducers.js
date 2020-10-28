import * as types from '../actions/actionTypes';
const initialState = {
    token: {},
    user_data:{}
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_TOKEN_DATA:
            return { ...state, ...{ token: action.data } }
        case types.SET_USER_DATA:
            return { ...state, ...{ user_data: action.data } }
        case types.UNSET_AUTH:
            return { ...state, ...{ user_data: {},token: {}  } }
        default:
            return state
    }
}
export default authReducer