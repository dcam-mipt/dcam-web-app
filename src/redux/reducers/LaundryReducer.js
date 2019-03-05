/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import mvConsts from '../../constants/mvConsts'

const initialState = {
    loading: false,
    selected_slots: [],
    laundry: [],
    book_details: undefined,
};

export default (state = initialState, action) => {
    switch (action.type) {

        case types.SELECT_SLOT:
            let isInState = state.selected_slots.filter(i => JSON.stringify(i) === JSON.stringify(action.data)).length
            let reduceSlot = () => state.selected_slots.filter(i => JSON.stringify(i) !== JSON.stringify(action.data))
            let selectSlot = () => [...state.selected_slots, action.data]
            return {
                ...state,
                selected_slots: isInState ? reduceSlot() : selectSlot(),
            };

        case types.LOAD_LAUNDRY_SUCCESS:
            return {
                ...state,
                laundry: action.data,
                selected_slots: state.selected_slots
                    // convert selected_slots to array of strings
                    .map(i => JSON.stringify(i))
                    .filter(i =>
                        // convert action.data to array of strings with the same format as selected_slots
                        action.data.map(i => JSON.stringify({ timestamp: i.timestamp, machineId: i.machineId }))
                            // filter only those which are not in selected_slots
                            .indexOf(i) < 0)
                    // convert strings to object in revert
                    .map(i => JSON.parse(i)),
            };
        case types.OPEN_LAUNDRY_BOOK_DETAIL:
            return {
                ...state,
                book_details: action.data
            }
        case types.SET_POP_UP_WINDOW:
            return {
                ...state,
                book_details: undefined
            }

        default:
            return state;
    }
}
/*eslint-enable no-unused-vars*/