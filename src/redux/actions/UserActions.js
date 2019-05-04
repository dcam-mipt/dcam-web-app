/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
export default {
    setUserInfo: (data) => {
        return {
            type: types.SET_USER_INFO,
            data: data
        }
    },
    setToken: (data) => {
        if (data) {
            localStorage.setItem(`dcam_token`, data)
        } else {
            localStorage.removeItem(`dcam_token`)
        }
        return {
            type: types.SET_TOKEN,
            data: data
        }
    },
    setAdmin: (data) => {
        return {
            type: types.SET_ADMIN,
            data: data
        }
    },
    setBalance: (data) => {
        return {
            type: types.SET_BALANCE,
            data: data
        }
    },
}
/*eslint-enable no-unused-vars*/