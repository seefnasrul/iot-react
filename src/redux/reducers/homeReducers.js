import * as types from '../actions/actionTypes';

const initialState = {
    homeData: {}
}

const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_HOME_DATA:
            return { ...state, ...{ homeData: action.data } }
        default:
            return state
    }
}
export default homeReducer