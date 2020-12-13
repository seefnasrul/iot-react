import * as types from '../actions/actionTypes';
const initialState = {
    dashboard_data: {data:[],time_start:null,time_end:null,realtime:0}
}

const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_DASHBOARD_DATA:
            return { 
                ...state, 
                ...{ 
                    dashboard_data: {...action.data},
                } 
            }
        case types.SET_DASHBOARD_TIMERANGE:
            return { 
                ...state, 
                ...{ 
                    dashboard_data: {data:state.dashboard_data.data,...action.data}
                } 
            }
        default:
            return state
    }
}
export default dashboardReducer