import {SET_HOME_DATA,GET_HOME_DATA} from './actionTypes'

export const getHomeData = (params,onSuccess,onError) => ({
    type:GET_HOME_DATA,
    params,
    onSuccess,
    onError
});

export const setHomeData = (data) => ({
    type:SET_HOME_DATA,
    data
});