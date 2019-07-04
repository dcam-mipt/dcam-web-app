/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import mvConsts from '../../constants/mvConsts'

const initialState = {
    laundry: null,
};

export default (state = initialState, action) => {
    switch (action.type) {

        case types.SET_LAUNDRY:
            return {
                ...state,
                laundry: action.data,
            };

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/