/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'

export default {
    loadMachines: (data) => {
        return ({
            type: types.LOAD_MACHINES_SUCCESS,
            data: data
        })
    }
}
/*eslint-enable no-unused-vars*/