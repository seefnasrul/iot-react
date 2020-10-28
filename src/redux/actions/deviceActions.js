import { CREATE_NEW_DEVICE, GET_DEVICE_BY_ID, UPDATE_DEVICE_BY_ID} from './actionTypes';

export const create_new_device = (params, onSuccess, onError) => ({
    type: CREATE_NEW_DEVICE,
    params,
    onSuccess,
    onError
});

export const get_device_by_id = (params, onSuccess, onError) => ({
    type: GET_DEVICE_BY_ID,
    params,
    onSuccess,
    onError
});

export const update_device_by_id = (params, onSuccess, onError) => ({
    type: UPDATE_DEVICE_BY_ID,
    params,
    onSuccess,
    onError
});

