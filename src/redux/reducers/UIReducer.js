/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import mvConsts from '../../constants/mvConsts'

const initialState = {
    loading: false,
    mainAppScreen: mvConsts.screens.laundry,
    popUpWindow: mvConsts.popUps.EMPTY,
};

export default (state = initialState, action) => {
    switch (action.type) {

        case types.SET_MAIN_APP_SCREEN:
            return {
                ...state,
                mainAppScreen: action.data,
            };
        case types.SET_POP_UP_WINDOW:
            return {
                ...state,
                popUpWindow: action.data,
            };
        case types.OPEN_BOOK_POP_UP:
            return {
                ...state,
                popUpWindow: action.data ? mvConsts.popUps.CLUB_BOOK : mvConsts.popUps.EMPTY,
            };
        case types.SET_NFC_OWNER:
            return {
                ...state,
                popUpWindow: action.data ? mvConsts.popUps.EMPTY : state.popUpWindow,
            };
        case types.OPEN_LAUNDRY_BOOK_DETAIL:
            return {
                ...state,
                popUpWindow: action.data ? mvConsts.popUps.LAUNDRY_BOOK_DETAILS : mvConsts.popUps.EMPTY,
            };

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/