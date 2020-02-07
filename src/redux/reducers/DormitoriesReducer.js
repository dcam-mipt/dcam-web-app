/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'

const initialState = {
    dormitories: [],
    selected_dormitory: localStorage.getItem(`selected_dormitory`),
};

export default (state = initialState, action) => {
    switch (action.type) {

        case types.SET_DORMITORIES:
            return {
                ...state,
                dormitories: action.data,
            };
        case types.SET_SELECTED_DORMITORY:
            return {
                ...state,
                selected_dormitory: action.data,
            };

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/