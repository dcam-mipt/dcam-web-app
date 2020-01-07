/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
export default {
    setMainScreen: (data) => {
        return {
            type: types.SET_MAIN_SCREEN,
            data: data
        }
    },
    setTheme: (data) => {
        localStorage.setItem(`theme`, data)
        return {
            type: types.SET_THEME,
            data: data
        }
    },
    setThemeShift: (data) => {
        localStorage.setItem(`theme_shift`, data)
        return {
            type: types.SET_THEME_SHIFT,
            data: data
        }
    },
}
/*eslint-enable no-unused-vars*/