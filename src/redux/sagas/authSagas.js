import { put, call, fork, takeLatest } from 'redux-saga/effects';
import * as types from '../actions/actionTypes';
import { setTokenData, setUserData } from '../actions/authActions';
import axios from 'axios';
import Url from '../../constants/Url';
import querystring from 'query-string';



/* register */
function postRegister(params = {}){
    return axios.post(Url.API+'/auth/register',querystring.stringify(params));
}
export function* register(action) {
    try {
        const data = yield call(postRegister, action.params)
        action.onSuccess(data.data)
        yield put(setTokenData(data.data.token))
        yield put(setUserData(data.data.data))
    } catch (error) {
        action.onError(error)
    }
}
export function* watchRegister() {
    yield takeLatest(types.REGISTER, register)
}


/* login */
function postLogin(params){
    return axios.post(Url.API+'/auth/login',querystring.stringify(params));
}

function getProfile(){
    return axios.post(Url.API+'/auth/me');
}
export function* login(action) {
    try {
        const data = yield call(postLogin, action.params)

        console.log('saga login:',data.data.access_token)
        yield put(setTokenData(data.data))
        const user_data = yield call(getProfile)
        yield put(setUserData(user_data.data))

        action.onSuccess(data.data)
    } catch (error) {
        action.onError(error)
    }
}
export function* watchLogin() {
    yield takeLatest(types.LOGIN, login)
}

/* profile update */
function postProfile(params){
    console.log('sagaparam:',params);
    return axios({
        url: Url.API+'/page/profile',
        method: 'POST',
        data: params,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data; boundary=' + Math.random().toString().substr(2)
        }
    });
}
export function* profileUpdate(action) {
    try {
        const data = yield call(postProfile, action.params)
        action.onSuccess(data.data)
        yield put(setUserData(data.data.data))
    } catch (error) {
        action.onError(error)
    }
}
export function* watchProfileUpdate() {
    yield takeLatest(types.PROFILE_UPDATE, profileUpdate)
}