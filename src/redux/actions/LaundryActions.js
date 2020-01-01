/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import moment from 'moment';
export default {
    setLaundry: (data) => {
        return {
            type: types.SET_LAUNDRY,
            data: data
        }
    },
}
/*eslint-enable no-unused-vars*/