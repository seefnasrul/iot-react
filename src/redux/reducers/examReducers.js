import * as types from '../actions/actionTypes';

const initialState = {
    examData:{},
    examAnswers:{},
}

const examReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_EXAM_DATA:
            return { ...state, ...{ examData: action.data } }
        case types.SET_EXAM_ANSWER:
            return { ...state, ...{ examAnswers: action.data } }
        default:
            return state
    }
}
export default examReducer