import { LOGIN, REGISTER, SET_TOKEN_DATA, SET_USER_DATA,PROFILE_UPDATE, UNSET_AUTH} from './actionTypes';

// import { PURGE } from 'redux-persist/lib/constants'; 

export const login = (params, onSuccess, onError) => ({
    type: LOGIN,
    params,
    onSuccess,
    onError
})

export const register = (params, onSuccess, onError) => ({
    type: REGISTER,
    params,
    onSuccess,
    onError
})

export const profileUpdate = (params, onSuccess, onError) => ({
    type: PROFILE_UPDATE,
    params,
    onSuccess,
    onError
})

export const setTokenData = (data) => ({
    type: SET_TOKEN_DATA,
    data,
})


export const setUserData = (data) => ({
    type: SET_USER_DATA,
    data,
})


export const unset_auth = () => ({
    type: UNSET_AUTH,
})

// export const clearPersist = () => ({
//     type:PURGE
// });