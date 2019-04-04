/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import mvConsts from '../../constants/mvConsts'

const initialState = {
    mainAppScreen: undefined,
    is_admin: false,
};

export default (state = initialState, action) => {
    switch (action.type) {

        case types.SET_MAIN_APP_SCREEN:
            return {
                ...state,
                mainAppScreen: action.data,
            };
        case types.SET_ADMIN:
            return {
                ...state,
                is_admin: action.data,
            };

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/