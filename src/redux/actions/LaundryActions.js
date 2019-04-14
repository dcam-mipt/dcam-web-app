/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
export default {
    setLaundry: (data) => {
        return {
            type: types.SET_LAUNDRY,
            data: data
        }
    },
}
/*eslint-enable no-unused-vars*/