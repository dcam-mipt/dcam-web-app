/*eslint-disable no-unused-vars*/

let { gapi } = window,
    GoogleAuth,
    SCOPE = 'https://www.googleapis.com/auth/userinfo.email',
    GoogleAPI = {}

let appOptions = {
    'apiKey': 'AIzaSyCSGE3JZpVhBKSAHYJXkuzopFOJhx67F4w',
    'clientId': '914233098415-eqgtkp13ai5lb3ba0m8i8an5h1lir93k.apps.googleusercontent.com',
    'scope': SCOPE,
    'hosted_domain': 'phystech.edu'
}

let initClient = () => {
    return gapi.client.init(appOptions)
        .then((d) => {
            GoogleAuth = gapi.auth2.getAuthInstance();
            setSigninStatus();
        });
}

let initGoogle = (userId) => {
    return new Promise((resolve, reject) => {
        gapi.load('client:auth2', resolve, reject)
    });
}

let signIn = () => {
    GoogleAuth.signIn();
}

let signOut = () => {
    GoogleAuth.signOut();
}

let revokeAccess = () => {
    GoogleAuth.disconnect();
}

let setSigninStatus = (isSignedIn) => {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
}

let updateSigninStatus = (isSignedIn) => {
    setSigninStatus();
    getCurrentUser();
}

let getCurrentUser = () => {
    let user = GoogleAuth.currentUser.get();
    // console.log(user);
    return user;
}

let isAuthorized = () => {
    if (GoogleAuth !== undefined) {
        var user = GoogleAuth.currentUser.get();
        var isAuthorized = user.hasGrantedScopes(SCOPE);
        return isAuthorized;
    } else {
        return false
    }
}

let subscribeSignIn = (callback) => {
    GoogleAuth.isSignedIn.listen(() => { callback(isAuthorized()) });
}

GoogleAPI = {
    initGoogle: initGoogle,
    initClient: initClient,
    signIn: signIn,
    signOut: signOut,
    getCurrentUser: getCurrentUser,
    isAuthorized: isAuthorized,
    GoogleAuth: GoogleAuth,
    subscribeSignIn: subscribeSignIn,
    // initGoogleAsync: initGoogleAsync,
}

export default GoogleAPI