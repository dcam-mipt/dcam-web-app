/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import mvConsts from '../../constants/mvConsts'
import moment from 'moment-timezone'

const initialState = {
    loading: false,
    server_time: +moment(),
    laundry_cost: 0,
    is_nfc_owner: false,
    money: 0,
    mobile: false,
};

export default (state = initialState, action) => {
    switch (action.type) {

        case types.SET_SERVER_TIME:
            return {
                ...state,
                server_time: action.data,
            };
        case types.SET_LAUNDRY_COST:
            return {
                ...state,
                laundry_cost: action.data,
            };
        case types.SET_NFC_OWNER:
            return {
                ...state,
                is_nfc_owner: action.data,
            };
        case types.SET_MONEY:
            return {
                ...state,
                money: action.data,
            };

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/