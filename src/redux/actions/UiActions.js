/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
export default {
    setMainScreen: (data) => {
        return {
            type: types.SET_MAIN_SCREEN,
            data: data
        }
    },
}
/*eslint-enable no-unused-vars*/