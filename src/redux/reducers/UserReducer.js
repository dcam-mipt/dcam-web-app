/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import mvConsts from '../../constants/mvConsts'

const initialState = {
    user: undefined,
    is_admin: false,
    token: localStorage.getItem(`dcam_token`),
    balance: 0,
};

export default (state = initialState, action) => {
    switch (action.type) {

        case types.SET_USER_INFO:
            return {
                ...state,
                user: action.data,
            };
        case types.SET_TOKEN:
            return {
                ...state,
                token: action.data,
            };
        case types.SET_ADMIN:
            return {
                ...state,
                is_admin: action.data,
            };
        case types.SET_BALANCE:
            return {
                ...state,
                balance: action.data,
            };

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/