/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
export default {
    set_laundry: (data) => {
        return {
            type: types.SET_LAUNDRY,
            data: data
        }
    },
}
/*eslint-enable no-unused-vars*/