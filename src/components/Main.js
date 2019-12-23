/*eslint-disable no-unused-vars*/

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import userActions from '../redux/actions/UserActions'
import uiActions from '../redux/actions/UiActions'
import machinesActions from '../redux/actions/MachinesActions'
import laundryActions from '../redux/actions/LaundryActions'
import Laundry from './Laundry/Laundry'
import EventSpaces from './EventSpaces/EventSpaces'
import axios from 'axios'
import styled from 'styled-components'
import mvConsts from '../constants/mvConsts'
import useComponentVisible from './UIKit/useComponentVisible'
import AdminTools from './AdminTools/AdminTools';
import GoogleAPI from '../API/GoogleAPI'
import { Flex, Image, Text, PopUp } from './UIKit/styled-templates'
import ProfilePopUp from './ProfilePopUp';
import CardPopUp from './CardPopUp';
import { HashRouter, BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";

let screens = [
    {
        image: require('../assets/images/laundry_selected.svg'),
        name: mvConsts.screens.laundry,
        admin: false,
        component: Laundry,
        path: `/${mvConsts.screens.laundry.toLocaleLowerCase()}`,
    },
    {
        image: require('../assets/images/event_spaces.svg'),
        name: mvConsts.screens.event_spaces,
        admin: true,
        component: EventSpaces,
        path: `/${mvConsts.screens.event_spaces.toLocaleLowerCase()}`,
    },
    {
        image: require('../assets/images/admin.svg'),
        name: mvConsts.screens.admin,
        admin: true,
        component: AdminTools,
        path: `/${mvConsts.screens.admin.toLocaleLowerCase()}`,
    },
]

let get_laundry = () => new Promise((resolve, reject) => { axios.get(`https://dcam.pro/api/laundry/get`).then((d) => { resolve(d) }).catch(e => console.log(e)) })
let get_machines = () => new Promise((resolve, reject) => { axios.get(`https://dcam.pro/api/machines/get`).then((d) => { resolve(d) }).catch(e => console.log(e)) })
let get_my_roles = () => new Promise((resolve, reject) => { axios.get(`https://dcam.pro/api/roles/get_my_roles/`).then((d) => { resolve(d) }).catch(e => console.log(e)) })
let get_my_balance = () => new Promise((resolve, reject) => { axios.get(`https://dcam.pro/api/balance/get_my_balance`).then((d) => { resolve(d) }).catch(e => console.log(e)) })

let Main = (props) => {
    let [axios_is_ready, set_axios_is_ready] = useState(false)
    let [profileRef, profileVisible, setProfileVisible] = useComponentVisible(false);
    let signOut = () => new Promise((resolve, reject) => {
        props.setToken(undefined);
        axios.get(`https://dcam.pro/api/auth/sign_out`)
            .then((d) => { resolve(d); })
            .catch((d) => { console.log(d); reject(d) })
    })
    useEffect(() => { document.title = `psamcs.${screens.filter(i => i.name === props.main_screen)[0].name.toLocaleLowerCase()}`; })
    useEffect(() => {
        axios.defaults.headers.common.Authorization = props.token
        set_axios_is_ready(true)
        axios.get(`https://dcam.pro/api/user/get_my_info`)
            .then((d) => {
                props.setUserInfo(Object.assign(GoogleAPI.getCurrentUser().w3, d.data))
                axios.post(`https://dcam.pro/api/user/set_my_avatar`, { url: GoogleAPI.getCurrentUser().w3.Paa })

                get_machines().then((d) => { props.setMachines(d.data) })
                get_laundry().then((d) => { props.setLaundry(d.data) })
                get_my_roles().then((d) => { props.setAdmin(d.data.indexOf(`ADMIN`) > -1) })
                get_my_balance().then((d) => { props.setBalance(+d.data) })
            })
            .catch((d) => { signOut() })
        return () => { axios.defaults.headers.common.Authorization = undefined }
    }, [])
    useEffect(() => {
        let i = setInterval(() => { get_my_balance().then((d) => { props.setBalance(+d.data) }) }, 1000)
        return () => { clearInterval(i) }
    }, [])
    if (axios_is_ready) {
        return (
            <HashRouter>
                <Wrapper>
                    <PopUp extra={`bottom: ${profileVisible ? 1 : 2}vw; left: 6vw;`} ref={profileRef} visible={profileVisible} >
                        <ProfilePopUp signOut={signOut} />
                    </PopUp>
                    <Menu>
                        <MenuItemImage only_desktop src={require(`../assets/images/psamcs_logo_colored.svg`)} />
                        <Flex>
                            {screens.filter(i => i.admin ? props.is_admin : true).map((item, index) => <Link key={index} to={item.path}><MenuItemImage onClick={() => { props.setMainScreen(item.name) }} src={item.image} /></Link>)}
                            <MenuItemImage only_mobile onClick={() => { setProfileVisible(!profileVisible) }} src={require(`../assets/images/menu.svg`)} />
                        </Flex>
                        <MenuItemImage only_desktop onClick={() => { setProfileVisible(!profileVisible) }} src={require(`../assets/images/menu.svg`)} />
                    </Menu>
                    <Workspace>
                        <Switch>
                            <Route path="/" exact component={Laundry} />
                            {
                                screens.map((item, index) => <Route key={index} exact path={item.path} component={item.component} />)
                            }
                        </Switch>
                    </Workspace>
                </Wrapper>
            </HashRouter>

        )
    } else {
        return null
    }
}

let mapStateToProps = (state) => {
    return {
        token: state.user.token,
        is_admin: state.user.is_admin,
        main_screen: state.ui.main_screen,
        balance: state.user.balance,
        user: state.user.user,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        setToken: (data) => {
            return dispatch(userActions.setToken(data))
        },
        setAdmin: (data) => {
            return dispatch(userActions.setAdmin(data))
        },
        setUserInfo: (data) => {
            return dispatch(userActions.setUserInfo(data))
        },
        setMachines: (data) => {
            return dispatch(machinesActions.setMachines(data))
        },
        setLaundry: (data) => {
            return dispatch(laundryActions.setLaundry(data))
        },
        setMainScreen: (data) => {
            return dispatch(uiActions.setMainScreen(data))
        },
        setBalance: (data) => {
            return dispatch(userActions.setBalance(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main)

const Wrapper = styled(Flex)`
flex-direction: row;
width: 100vw;
height: 100vh;
background: ${props => props.theme.background.secondary};
@media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
    height: 100vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 85vh;
}`

const Menu = styled(Flex)`
width: 5vw;
height: calc(100vh - 1vw);
border-radius: 1.5vw;
margin: 0.5vw;
background: ${props => props.theme.background.primary};
box-shadow: 0 0 2vw rgba(0, 0, 0, 0.1);
z-index: 2;
justify-content: space-between;
@media (min-width: 320px) and (max-width: 480px) {
    width: 96vw;
    height: 6vh;
    border-radius: 1.2vh;
    bottom: 0.5vh;
    position: fixed;
    margin: 0;
    flex-direction: row
    justify-content: space-around;
    > * {
        width: 100%;
        flex-direction: row;
        justify-content: space-around;
    }
}`

const MenuItemImage = styled.img`;
width: 2.5vw;
height: 2.5vw;
margin: 0.25vw;
padding: 1.5vw;
cursor: pointer;
display: ${props => props.only_mobile ? `none` : `block`}
&:hover { width: 3vw; height: 3vw; margin: 0; }
transition: 0.2s;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.only_desktop ? `none` : `block`}
    width: 5vh;
    height: 5vh;
}`

const Workspace = styled(Flex)`
width: 94vw;
height: 100vh;
overflow; hidden;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 100vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 85vh;
}`

const Header = styled(Flex)`
width: 94vw;
height: 8vh;
padding: 0 2vw 0 0;
@media (min-width: 320px) and (max-width: 480px) {
    display: none;
}`

const Space = styled(Flex)`
width: 94vw;
height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
}`

const MenuButton = styled(Flex)`
width: 3.5vw;
height: 3.5vw;
border-radius: 0.5vw;
background: ${props => props.selected && props.theme.background.primary};
margin-left: 0.5vw;
position: relative;
&:hover { background-color: ${props => props.theme.background.primary}; }
@media (min-width: 320px) and (max-width: 480px) {
    
}`
/*eslint-enable no-unused-vars*/