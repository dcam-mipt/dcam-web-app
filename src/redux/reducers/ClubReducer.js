/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'

const initialState = {
    loading: false,
    selected_slot: undefined,
};

export default (state = initialState, action) => {
    switch (action.type) {

        case types.OPEN_BOOK_POP_UP:
            return {
                ...state,
                selected_slot: action.data,
            };

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/