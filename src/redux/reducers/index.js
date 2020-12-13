import { combineReducers } from 'redux';
import authReducers from './authReducers';
import homeReducers from './homeReducers';
import examReducers from './examReducers';
import dashboardReducers from './dashboardReducers';
import toastReducers from './toastReducers';

import { REHYDRATE,PURGE } from 'redux-persist/lib/constants'; 

const globalReducer = (state = {}, action) => {
    switch (action.type) {
        case REHYDRATE:
            return { ...state, persistedState: action.payload };
        default:
            return state
    }
}

const allReducers = combineReducers({
    auth:authReducers,
    home:homeReducers,
    exam:examReducers,
    dashboard:dashboardReducers,
    toast:toastReducers,
    ...globalReducer
})
export default allReducers