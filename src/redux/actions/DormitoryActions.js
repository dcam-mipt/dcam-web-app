/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
export default {
    setDormitories: (data) => {
        return {
            type: types.SET_DORMITORIES,
            data: data
        }
    },
    setSelectedDormitory: (data) => {
        localStorage.setItem(`selected_dormitory`, data)
        return {
            type: types.SET_SELECTED_DORMITORY,
            data: data
        }
    },
}
/*eslint-enable no-unused-vars*/