import * as types from '../actions/actionTypes';

const initialState = {
    toast: {}
}

const toastReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_TOAST_NOTIFICATION:
            return { ...state, ...{ toast: action.data } }
        default:
            return state
    }
}
export default toastReducer