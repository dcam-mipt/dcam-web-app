/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
export default {
    setServerTime: (data) => {
        return {
            type: types.SET_SERVER_TIME,
            data: data
        }
    },
    setLaundryCost: (data) => {
        return {
            type: types.SET_LAUNDRY_COST,
            data: data
        }
    },
    setNfcOwner: (data) => {
        return {
            type: types.SET_NFC_OWNER,
            data: data
        }
    },
    setBalance: (data) => {
        return {
            type: types.SET_MONEY,
            data: data
        }
    },
}
/*eslint-enable no-unused-vars*/