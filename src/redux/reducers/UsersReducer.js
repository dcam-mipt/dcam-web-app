/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'

const initialState = {
    loading: false,
    users_list: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_USERS_LIST:
            return {
                ...state,
                users_list: action.data,
            };

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/