/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import mvConsts from '../../constants/mvConsts'

const initialState = {
    main_screen: mvConsts.screens.laundry,
    theme: localStorage.getItem(`theme`),
    theme_shift: localStorage.getItem(`theme_shift`),
};

export default (state = initialState, action) => {
    switch (action.type) {

        case types.SET_MAIN_SCREEN:
            return {
                ...state,
                main_screen: action.data,
            };
        case types.SET_THEME:
            return {
                ...state,
                theme: action.data,
            };
        case types.SET_THEME_SHIFT:
            return {
                ...state,
                theme_shift: action.data,
            };

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/