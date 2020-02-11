/*eslint-disable no-unused-vars*/

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import userActions from '../redux/actions/UserActions'
import uiActions from '../redux/actions/UiActions'
import machinesActions from '../redux/actions/MachinesActions'
import dormitoryActions from '../redux/actions/DormitoryActions'
import laundryActions from '../redux/actions/LaundryActions'
import Laundry from './Laundry/Laundry'
// import EventSpaces from './EventSpaces/EventSpaces'
import EventSpaces from './EventSpaces/EventSpaces'
import axios from 'axios'
import styled from 'styled-components'
import mvConsts from '../constants/mvConsts'
import useComponentVisible from './UIKit/useComponentVisible'
import AdminTools from './AdminTools/AdminTools';
import GoogleAPI from '../API/GoogleAPI'
import { Flex, Image, Text, PopUp, convertHex } from './UIKit/styled-templates'
import ProfilePopUp from './ProfilePopUp';
import DormitoryPopUp from './DormitoryPopUp';
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

let get_laundry = () => new Promise((resolve, reject) => { axios.get(`${mvConsts.api}/laundry/get`).then((d) => { resolve(d) }).catch(e => console.log(e)) })
let get_machines = () => new Promise((resolve, reject) => { axios.get(`${mvConsts.api}/machines/get`).then((d) => { resolve(d) }).catch(e => console.log(e)) })
let get_my_roles = () => new Promise((resolve, reject) => { axios.get(`${mvConsts.api}/roles/get_my_roles/`).then((d) => { resolve(d) }).catch(e => console.log(e)) })
let get_my_balance = () => new Promise((resolve, reject) => { axios.get(`${mvConsts.api}/balance/get_my_balance`).then((d) => { resolve(d) }).catch(e => console.log(e)) })
let get_dormitories = () => new Promise((resolve, reject) => { axios.get(`${mvConsts.api}/dormitory/get`).then((d) => { resolve(d) }).catch(e => console.log(e)) })

let Main = (props) => {
    let [axios_is_ready, set_axios_is_ready] = useState(false)
    let [profileRef, profileVisible, setProfileVisible] = useComponentVisible(false);
    let [dormitoryRef, dormitoryVisible, setDormitoryVisible] = useComponentVisible(false);
    dormitoryVisible = dormitoryVisible || props.selected_dormitory < 1
    let signOut = () => new Promise((resolve, reject) => {
        props.setToken(undefined);
        axios.get(`${mvConsts.api}/auth/sign_out`)
            .then((d) => { resolve(d); })
            .catch((d) => { console.log(d); reject(d) })
    })
    useEffect(() => { document.title = `psamcs.${screens.filter(i => i.name === props.main_screen)[0].name.toLocaleLowerCase()}`; })
    useEffect(() => {
        axios.defaults.headers.common.Authorization = props.token
        set_axios_is_ready(true)
        axios.get(`${mvConsts.api}/user/get_my_info`)
            .then((d) => {
                props.setUserInfo(Object.assign(GoogleAPI.getCurrentUser().w3, d.data))
                axios.post(`${mvConsts.api}/user/set_my_avatar`, { url: GoogleAPI.getCurrentUser().w3.Paa })

                get_machines().then((d) => { props.setMachines(d.data) })
                get_laundry().then((d) => { props.set_laundry(d.data) })
                get_my_roles().then((d) => { props.setAdmin(d.data.indexOf(`ADMIN`) > -1) })
                get_my_balance().then((d) => { props.setBalance(+d.data) })
                get_dormitories().then(d => { props.setDormitories(d.data) })
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
                <PopUp extra={`top: ${dormitoryVisible ? 12 : 15}vh; left: 6vw; @media (min-width: 320px) and (max-width: 480px) { top: 0; left: 0;};`} ref={dormitoryRef} visible={dormitoryVisible} >
                    <DormitoryPopUp />
                </PopUp>
                <PopUp extra={`bottom: ${profileVisible ? 1 : 2}vw; left: 6vw; @media (min-width: 320px) and (max-width: 480px) { top: 0; left: 0;};`} ref={profileRef} visible={profileVisible} >
                    <ProfilePopUp signOut={signOut} />
                </PopUp>
                <Wrapper>
                    <Menu>
                        <Flex only_desktop >
                            <MenuItemImage only_desktop src={require(`../assets/images/psamcs_logo_colored.svg`)} />
                            <DormitoryButton error={props.selected_dormitory === 0} onClick={() => { setDormitoryVisible(true) }} >
                                <Flex>
                                    <Text text_color={`white`} bold size={1} >{props.selected_dormitory === 0 ? `!` : props.selected_dormitory}</Text>
                                </Flex>
                            </DormitoryButton>
                        </Flex>
                        <Flex>
                            {screens.filter(i => i.admin ? props.is_admin : true).map((item, index) => <Link key={index} to={item.path}><MenuItemImage onClick={() => { props.setMainScreen(item.name) }} src={item.image} /></Link>)}
                            <MenuItemImage only_mobile onClick={() => { setProfileVisible(!profileVisible) }} src={require(`../assets/images/menu.svg`)} />
                        </Flex>
                        <MenuItemImage only_desktop onClick={() => { setProfileVisible(!profileVisible) }} src={require(`../assets/images/menu.svg`)} />
                    </Menu>
                    <Workspace blur={dormitoryVisible || profileVisible} >
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
        selected_dormitory: state.dormitories.dormitories.length ? state.dormitories.dormitories.filter(i => i.objectId === state.dormitories.selected_dormitory).length && state.dormitories.dormitories.filter(i => i.objectId === state.dormitories.selected_dormitory)[0].number : null,
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
        set_laundry: (data) => {
            return dispatch(laundryActions.set_laundry(data))
        },
        setMainScreen: (data) => {
            return dispatch(uiActions.setMainScreen(data))
        },
        setBalance: (data) => {
            return dispatch(userActions.setBalance(data))
        },
        setDormitories: (data) => {
            return dispatch(dormitoryActions.setDormitories(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main)

const Error = styled(Flex).attrs(props => ({
    only_mobile: true,
}))`
position: fixed;
top: 0;
width: 100vw;
padding: 5vw 0 5vw 0;
z-index: 2;
background: ${props => props.theme.WARM_ORANGE};
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const DormitoryButton = styled(Flex)`
width: 3vw;
height: 3vw;
background: ${props => convertHex(props.error ? props.theme.WARM_ORANGE : props.theme.yellow, 0.3)};
cursor: pointer;
border-radius: 1vw;
&:hover { transform: scale(1.2); }
> * {
    width: 2.25vw;
    height: 2.25vw;
    background: ${props => props.error ? props.theme.WARM_ORANGE : props.theme.yellow};
    border-radius: ${2.25 / 3}vw;
}
`

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
z-index: 4;
justify-content: space-between;
@media (min-width: 320px) and (max-width: 480px) {
    width: 96vw;
    height: 8vh;
    border-radius: ${8 / 3}vh;
    bottom: 0.5vh;
    position: fixed;
    margin: 0;
    flex-direction: row
    justify-content: space-around;
    box-shadow: 0 0 8vw rgba(0, 0, 0, 0.1);
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
    &:hover { width: 5vh; height: 5vh; margin: 0.25vw; }
}`

const Workspace = styled(Flex)`
width: 94vw;
height: 100vh;
overflow; hidden;
filter: blur(${props => +props.blur * 8}px);
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 100vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 85vh;
}`
/*eslint-enable no-unused-vars*/