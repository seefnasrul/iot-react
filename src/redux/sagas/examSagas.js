import { put, call, fork, takeLatest,select } from 'redux-saga/effects';
import * as types from '../actions/actionTypes';
import { setExamData,setExamAnswer } from '../actions/examActions';
import axios from 'axios';
import Url from '../../constants/Url';
import querystring from 'query-string';


/* exam data */
function getExam (payload) {
    return axios.post(Url.API+'/page/start_exam',querystring.stringify(payload));
}
function reStructureDataExam(data){
    var exam  = {};
    exam.quiz = data.quiz;
    exam.questions = data.questions;
    exam.seconds = data.seconds;
    exam.random_order = data.random_order;
    exam.categories = data.categories;
    for (var index = 0; index < exam.questions.length; index++) {
        exam.questions[index].options = [];
        exam.questions[index].audio_played = false;
        for (var y = 0; y < data.options.length; y++) {
            if(data.options[y].qid == exam.questions[index].qid){
                exam.questions[index].options.push(data.options[y]);
            }
        }
    }

    return exam;
}
export function* startExam(action) {
    try {
        const response = yield call(getExam, action.params)
        const structuredData = yield call(reStructureDataExam,response.data.data)
        action.onSuccess(structuredData)
        yield put(setExamData(structuredData))
    } catch (error) {
        action.onError(error)
    }
}
export function* watchStartExam() {
    yield takeLatest(types.GET_EXAM_DATA, startExam)
}



function prepareExamAnswerPayload(params){
    var {currentState,addState} = params;
    currentState[addState.qid] = addState;
    return currentState;
}
function postAnswer(payload){
    
    var answer = {};
    Object.keys(payload).forEach((key,index)=>{
        answer[key] = [];
        answer[key].push(payload[key]);
    });

    var params = {answer:answer};
    console.log('post answer payload:',querystring.stringify(params));
    return axios.post(Url.API+'/page/save_answer',querystring.stringify(payload));
}
export function* saveExamAnswer(action){
    try {
        let examAnswers = yield select((state)=>state.examAnswers)
        let postPayload = yield call(prepareExamAnswerPayload,{currentState:examAnswers,addState:action.params})
        const response = yield call(postAnswer, action.params)
        action.onSuccess(response)
        yield put(setExamAnswer(postPayload))
    } catch (error) {
        action.onError(error)
    }
}
export function* watchSaveExamAnswer() {
    yield takeLatest(types.SET_EXAM_ANSWER_TO_SERVER, saveExamAnswer)
}