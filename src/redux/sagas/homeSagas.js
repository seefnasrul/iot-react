import { put, call, fork, takeLatest } from 'redux-saga/effects';
import * as types from '../actions/actionTypes';
import { setHomeData } from '../actions/homeActions';
import axios from 'axios';
import Url from '../../constants/Url';
import querystring from 'query-string';


/* home */
function getHome(payload){
    return axios.get(Url.API+'/page/home',{params:payload});
}
export function* home(action) {
    try {
        const data = yield call(getHome, action.params)
        action.onSuccess(data.data)
        yield put(setHomeData(data.data.token))
    } catch (error) {
        action.onError(error)
    }
}
export function* watchHome() {
    yield takeLatest(types.GET_HOME_DATA, home)
}