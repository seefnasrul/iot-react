import { put, call, fork, takeLatest,select } from 'redux-saga/effects';
import * as types from '../actions/actionTypes';
import { setDashboardData, setDashboardTimerage} from '../actions/dashboardActions';
import axios from 'axios';
import Url from '../../constants/Url';
import querystring from 'query-string';
export const getDashboardData = (state) => state.dashboard.dashboard_data;
/* get dashboard */
function get_get_dashboard(){
    return axios.get(Url.API+'/dashboard/get-dashboard');
}
export function* get_dashboard(action) {
    try {
        const data = yield call(get_get_dashboard)
        // let dashboard_data = yield select(getDashboardData);
        yield put(setDashboardData(data.data.data))
        action.onSuccess(data.data)
    } catch (error) {
        action.onError(error)
    }
}
export function* watchGetDashboardData() {
    yield takeLatest(types.GET_DASHBOARD_DATA, get_dashboard)
}

/* save dashboard */
function post_save_dashboard(payload){
    return axios.post(Url.API+'/dashboard/save-dashboard',{data:payload});
}
export function* save_dashboard(action) {
    try {
        const data = yield call(post_save_dashboard, action.params)
        let dashboard_data = yield select(getDashboardData);
        console.log('dashboard_data saga',dashboard_data);
        yield put(setDashboardData({...dashboard_data,data:action.params}))
        action.onSuccess(data.data)
    } catch (error) {
        action.onError(error)
    }
}
export function* watchSaveDashboard() {
    yield takeLatest(types.SAVE_DASHBOARD, save_dashboard)
}

/* save dashboard timerange*/
function post_save_dashboard_timerange(payload){
    return axios.post(Url.API+'/dashboard/save-timerange',payload);
}

export function* save_dashboard_timerange(action) {
    try {
        const data = yield call(post_save_dashboard_timerange, action.params)
        yield put(setDashboardTimerage(action.params))
        action.onSuccess(data.data)
    } catch (error) {
        action.onError(error)
    }
}

export function* watchSaveDashboardTimerange() {
    yield takeLatest(types.SAVE_DASHBOARD_TIMERANGE, save_dashboard_timerange)
}



