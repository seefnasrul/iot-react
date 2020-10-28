import { put, call, fork, takeLatest } from 'redux-saga/effects';
import * as types from '../actions/actionTypes';
import { setHomeData } from '../actions/homeActions';
import axios from 'axios';
import Url from '../../constants/Url';
import querystring from 'query-string';


/* create */
function post_create_new_device(payload){
    return axios.post(Url.API+'/device/create-device',payload);
}
export function* create_new_device(action) {
    try {
        const data = yield call(post_create_new_device, action.params)
        action.onSuccess(data.data)
    } catch (error) {
        action.onError(error)
    }
}
export function* watchCreateNewDevice() {
    yield takeLatest(types.CREATE_NEW_DEVICE, create_new_device)
}

/* get by id */
function get_get_device_by_id(payload){
    return axios.get(Url.API+'/device/'+payload);
}
export function* get_device_by_id(action) {
    try {
        const data = yield call(get_get_device_by_id, action.params)
        action.onSuccess(data.data)
    } catch (error) {
        action.onError(error)
    }
}
export function* watchGetDeviceByID() {
    yield takeLatest(types.GET_DEVICE_BY_ID, get_device_by_id)
}

/* update by id */
function post_update_device_by_id(payload){
    return axios.post(Url.API+'/device/update-device',payload);
}
export function* update_device_by_id(action) {
    try {
        const data = yield call(post_update_device_by_id, action.params)
        action.onSuccess(data.data)
    } catch (error) {
        action.onError(error)
    }
}
export function* watchUpdateDeviceByID() {
    yield takeLatest(types.UPDATE_DEVICE_BY_ID, update_device_by_id)
}