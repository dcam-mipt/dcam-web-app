/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'

let transformMachines = (d) => {
    return d.map(i => {
        return ({
            machineId: i.id,
            isBroken: i.get(`isBroken`),
            isDisabled: i.get(`isDisabled`),
            comment: i.get(`comment`),
        })
    })
}

export default {
    loadMachines: (data) => {
        return ({
            type: types.LOAD_MACHINES_SUCCESS,
            data: transformMachines([].concat(data))
        })
    }
}
/*eslint-enable no-unused-vars*/