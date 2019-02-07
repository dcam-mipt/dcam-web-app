/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
export default {
    setEntryScreen: (data) => {
        return {
            type: types.SET_ENTRY_SCREEN,
            data: data
        }
    },

    setMobileVersion: (data) => {
        return {
            type: types.SET_MOBILE_VERSION,
            data: data
        }
    },

    setMainAppScreen: (data) => {
        return {
            type: types.SET_MAIN_APP_SCREEN,
            data: data
        }
    },

    setPopUpWindow: (data) => {
        return {
            type: types.SET_POP_UP_WINDOW,
            data: data
        }
    },
}
/*eslint-enable no-unused-vars*/