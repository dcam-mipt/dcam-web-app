/*eslint-disable no-unused-vars*/
import Parse, { LiveQuerySubscription } from 'parse'
import GoogleAPI from './GoogleAPI'
let signInOrUpParse = async () => {
    let user = GoogleAPI.getCurrentUser().w3
    let q = new Parse.Query(`User`)
    q.equalTo(`email`, user.U3)
    return q.first()
        .then((d) => {
            // check if user is signed up
            if (d) {
                // sign in
                return Parse.User.logIn(user.U3, user.Eea)
                    .then((d) => { return Parse.User.current(); })
                    .catch((d) => { console.log(d) })
            } else {
                // sign up
                var parse_user = new Parse.User();
                parse_user.set("username", user.U3);
                parse_user.set("password", user.Eea);
                parse_user.set("email", user.U3);
                parse_user.set("name", user.ig);
                parse_user.set("avatar", user.Paa);
                return parse_user.signUp()
                    .then(d => Parse.User.current())
                    .catch((d) => { console.log(d); GoogleAPI.signOut() })
            }
        })
        .catch((d) => { console.log(d) })
}

export default (onInit = () => { }, onSignIn = () => { }, onSignOut = () => { }) => {
    GoogleAPI.initGoogle()
        .then(() => {
            GoogleAPI.initClient()
                .then(() => {
                    onInit()
                    // check for auth conflicts
                    if (GoogleAPI.isAuthorized()) {
                        if (Parse.User.current()) {
                            let q = new Parse.Query(`User`)
                            q.equalTo(`objectId`, Parse.User.current().id)
                            q.first()
                            	.then((d) => {
                                    // all right
                                })
                                .catch((d) => {
                                    // user is deleted
                                    console.log(`user is deleted`)
                                    Parse.User.logOut();
                                    GoogleAPI.signOut();
                                })
                        } else {
                            // try to sign in or sign up parse
                            signInOrUpParse()
                                .then((d) => { onSignIn(d) })
                        }
                    } else {
                        if (GoogleAPI.isAuthorized()) {
                            // sign out parse
                            Parse.User.logOut()
                        } else {
                            // all right
                            Parse.User.logOut()
                        }
                    }
                    GoogleAPI.subscribeSignIn((isSignedIn) => {
                        if (isSignedIn) {
                            if (Parse.User.current()) {
                                // sign out old parse session
                                Parse.User.logOut()
                                // try to sign in or sign up parse
                                signInOrUpParse()
                                    .then((d) => { onSignIn() })
                            } else {
                                // try to sign in or sign up parse
                                signInOrUpParse()
                                    .then((d) => { onSignIn() })
                            }
                        } else {
                            // sign out parse
                            Parse.User.logOut()
                                .then((d) => { onSignOut() })
                                .catch((d) => { console.log(d) })
                        }
                    })
                })
                .catch((e) => { console.log(e) })
        })
        .catch((e) => { console.log(e) })
}
/*eslint-enable no-unused-vars*/