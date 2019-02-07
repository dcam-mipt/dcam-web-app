let VK = {

    VK: undefined,

    initVK: () => {
        window.VK.init({
            apiId: 6652742
        });
    },

    login: (callback) => {
        if (!callback) {
            callback = () => { }
        }
        window.VK.Auth.login(r => callback(r))
    },

    logout: (callback) => {
        if (!callback) {
            callback = () => { }
        }
        let { VK } = window
        VK.Auth.logout(r => callback(r))
    },

    getLoginStatus: (callback) => {
        if (!callback) {
            callback = () => { }
        }
        let { VK } = window
        VK.Auth.getLoginStatus(r => callback(r))
    },

    getAvatar: (id, callback) => {
        if (!callback) {
            callback = () => { }
        }
        window.VK.Api.call('users.get', {
            user_ids: id,
            v: "5.73",
            fields: `photo_200`
        }, (r) => {
            if (r.response) {
                callback(r.response[0].photo_200)
            }
        });
    },

    getUserIsDeactivated: (id, callback) => {
        if (!callback) {
            callback = () => { }
        }
        window.VK.Api.call('users.get', {
            user_ids: id,
            v: "5.89",
        }, (r) => {
            if (r.response) {
                callback(r.response)
            }
        });
    },

    observeSubscribe: (event, callback) => {
        if (!callback) {
            callback = () => { }
        }
        window.VK.Observer.subscribe(event, r => callback(r));
    },

    getUser: (id, callback) => {
        if (!callback) {
            callback = () => { }
        }
        window.VK.Api.call('users.get', {
            user_ids: id,
            v: "5.89",
            fields: `photo_200`
        }, (r) => {
            if (r.response) {
                callback(r.response)
            }
        });
    }

}

export default VK