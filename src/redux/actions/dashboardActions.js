import {SAVE_DASHBOARD,SET_DASHBOARD_DATA,GET_DASHBOARD_DATA,SET_DASHBOARD_TIMERANGE,SAVE_DASHBOARD_TIMERANGE} from './actionTypes';

export const save_dashboard = (params, onSuccess, onError) => ({
    type: SAVE_DASHBOARD,
    params,
    onSuccess,
    onError
});

export const get_dashboard_data = (onSuccess, onError) => ({
    type: GET_DASHBOARD_DATA,
    onSuccess,
    onError
});


export const setDashboardData = (data) => ({
    type: SET_DASHBOARD_DATA,
    data,
})

export const setDashboardTimerage = (data) => ({
    type: SET_DASHBOARD_TIMERANGE,
    data,
})

export const save_dashboard_timerange = (params, onSuccess, onError) => ({
    type: SAVE_DASHBOARD_TIMERANGE,
    params,
    onSuccess,
    onError
});