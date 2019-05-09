/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import mvConsts from '../../constants/mvConsts'

const initialState = {
    main_screen: mvConsts.screens.laundry,
};

export default (state = initialState, action) => {
    switch (action.type) {

        case types.SET_MAIN_SCREEN:
            return {
                ...state,
                main_screen: action.data,
            };

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/