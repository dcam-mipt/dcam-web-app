/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import mvConsts from '../../constants/mvConsts'
import moment from 'moment'

const initialState = {
    loading: false,
    error: undefined,
    machines: [],
    subscription: false,
};

const startLoading = (state, action) => {
    return { ...state, loading: true, error: undefined}
}

const stopLoading = (state, action) => {
    return { ...state, loading: false, error: action.error}
}

export default (state = initialState, action) => {
    switch (action.type) {

        case types.MACHINES_SUBSCRIPTION_ENABLED:
            return {
                ...state,
                subscription: true,
            };
        case types.MACHINES_SUBSCRIPTION_DISABLED:
            return {
                ...state,
                subscription: false,
            };

        case types.LOAD_MACHINES_START:
            return startLoading(state, action);
            
        case types.LOAD_MACHINES_FAIL:
            return stopLoading(state, action);
            

        case types.LOAD_MACHINES_SUCCESS:
            return {
                ...state,
                machines: action.data,
            };

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/