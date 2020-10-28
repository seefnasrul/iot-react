import {GET_EXAM_DATA,  SET_EXAM_DATA, SET_EXAM_ANSWER,SET_EXAM_ANSWER_TO_SERVER} from './actionTypes'

/* exam data actions */
export const getExamData = (params,onSuccess,onError) => ({
    type:GET_EXAM_DATA,
    params,
    onSuccess,
    onError
});
export const setExamData = (data) => ({
    type:SET_EXAM_DATA,
    data
});

/* exam answers data actions */
export const setExamAnswerToServer = (params,onSuccess,onError) => ({
    type:SET_EXAM_ANSWER_TO_SERVER,
    params,
    onSuccess,
    onError
});
export const setExamAnswer = (data) => ({
    type:SET_EXAM_ANSWER,
    data
});