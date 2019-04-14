/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
export default {
    setMachines: (data) => {
        return {
            type: types.SET_MACHINES,
            data: data
        }
    },
}
/*eslint-enable no-unused-vars*/