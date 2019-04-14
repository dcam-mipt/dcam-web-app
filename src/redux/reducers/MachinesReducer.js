/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import mvConsts from '../../constants/mvConsts'

const initialState = {
    machines: [],
};

export default (state = initialState, action) => {
    switch (action.type) {

        case types.SET_MACHINES:
            return {
                ...state,
                machines: action.data,
            };

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/