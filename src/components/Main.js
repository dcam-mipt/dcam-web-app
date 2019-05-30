/*eslint-disable no-unused-vars*/

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import userActions from '../redux/actions/UserActions'
import uiActions from '../redux/actions/UiActions'
import machinesActions from '../redux/actions/MachinesActions'
import laundryActions from '../redux/actions/LaundryActions'
import Laundry from './Laundry/Laundry'
import axios from 'axios'
import styled from 'styled-components'
import mvConsts from '../constants/mvConsts'
import useComponentVisible from './useComponentVisible'
import AdminTools from './AdminTools';
import GoogleAPI from '../API/GoogleAPI'
import { Flex, Image, Text, PopUp } from './styled-templates'
import ProfilePopUp from './ProfilePopUp';
import CardPopUp from './CardPopUp';
import io from 'socket.io-client';
const socket = io('http://dcam.pro:3000');

let screens = [
    {
        image: require('../assets/images/laundry_selected.svg'),
        name: mvConsts.screens.laundry,
        admin: false,
        component: <Laundry />,
    },
    {
        image: require('../assets/images/admin.svg'),
        name: mvConsts.screens.admin,
        admin: true,
        component: <AdminTools />,
    },
]

let get_laundry = () => new Promise((resolve, reject) => { axios.get(`http://dcam.pro/api/laundry/get`).then((d) => { resolve(d) }) })
let get_machines = () => new Promise((resolve, reject) => { axios.get(`http://dcam.pro/api/machines/get`).then((d) => { resolve(d) }) })
let get_my_roles = () => new Promise((resolve, reject) => { axios.get(`http://dcam.pro/api/roles/get_my_roles/`).then((d) => { resolve(d) }) })
let get_my_balance = () => new Promise((resolve, reject) => { axios.get(`http://dcam.pro/api/balance/get_my_balance`).then((d) => { resolve(d) }) })

let Main = (props) => {
    useEffect(() => { document.title = `dcam.${screens.filter(i => i.name === props.main_screen)[0].name.toLocaleLowerCase()}`; })
    useEffect(() => {
        axios.defaults.headers.common.Authorization = props.token
        axios.get(`http://dcam.pro/api/user/get_my_info`)
            .then((d) => {
                props.setUserInfo(Object.assign(GoogleAPI.getCurrentUser().w3, d.data))
                axios.post(`http://dcam.pro/api/user/set_my_avatar`, { url: GoogleAPI.getCurrentUser().w3.Paa })

                get_machines().then((d) => { props.setMachines(d.data) })
                get_laundry().then((d) => { props.setLaundry(d.data) })
                get_my_roles().then((d) => { props.setAdmin(d.data.indexOf(`ADMIN`) > -1) })
                get_my_balance().then((d) => { props.setBalance(+d.data) })
            })
            .catch((d) => { signOut() })
        return () => { axios.defaults.headers.common.Authorization = undefined }
    })
    let [profileRef, profileVisible, setProfileVisible] = useComponentVisible(false);
    let [cardRef, cardVisible, setCardVisible] = useComponentVisible(false);
    let signOut = () => new Promise((resolve, reject) => {
        props.setToken(undefined);
        axios.get(`http://dcam.pro/api/auth/sign_out`)
            .then((d) => { resolve(d); })
            .catch((d) => { console.log(d); reject(d) })
    })
    useEffect(() => {
        socket.on('Laundry', (msg) => { get_laundry().then((d) => { props.setLaundry(d.data) }) })
        socket.on('Balance', (msg) => { msg === (props.user && props.user.objectId) && get_my_balance().then((d) => { props.setBalance(+d.data) }) })
    })
    return (
        <Wrapper>
            <PopUp top={3} ref={profileRef} visible={profileVisible} >
                <ProfilePopUp signOut={signOut} />
            </PopUp>
            <PopUp top={3} right={4.5} ref={cardRef} visible={cardVisible} >
                <CardPopUp />
            </PopUp>
            <Menu>
                {screens.filter(i => i.admin ? props.is_admin : true).map((item, index) => <MenuItemImage onClick={() => { props.setMainScreen(item.name) }} src={item.image} key={index} />)}
                <MenuItemImage only_mobile onClick={() => { setProfileVisible(!profileVisible) }} src={require(`../assets/images/menu.svg`)} />
            </Menu>
            <Workspace>
                <Header row extra={`justify-content: flex-end;`} >
                    <MenuButton selected={cardVisible} onClick={() => { setCardVisible(!cardVisible) }} >
                        <Circle any_money={props.balance > 0} ><Text color={`white`} >{props.balance}</Text></Circle>
                    </MenuButton>
                    <MenuButton selected={profileVisible} onClick={() => { setProfileVisible(!profileVisible) }} >
                        <Image src={require('../assets/images/menu.svg')} width={3} round />
                    </MenuButton>
                </Header>
                <Space>
                    {screens.filter(i => i.name === props.main_screen)[0].component}
                </Space>
            </Workspace>
        </Wrapper>
    )
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

const Circle = styled(Flex)`
width: 2.5vw;
height: 2.5vw;
background-color: ${props => props.any_money ? mvConsts.colors.accept : mvConsts.colors.background.support};
border-radius: 2.5vw;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const Wrapper = styled(Flex)`
flex-direction: row;
width: 100vw;
height: 100vh;
@media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
    height: 100vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 85vh;
}`

const Menu = styled(Flex)`
width: 6vw;
height: 100vh;
background-color: ${mvConsts.colors.background.primary};
z-index: 2;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 6vh;
    bottom: 0;
    position: fixed;
    flex-direction: row
    justify-content: space-around;
    border-top: 1px solid ${mvConsts.colors.background.support};
    // box-shadow: 0 0 5vh rgba(0, 0, 0, 0.2);
}`

const MenuItemImage = styled.img`;
width: 3vw;
height: 3vw;
padding: 1.5vw;
cursor: pointer;
display: ${props => props.only_mobile ? `none` : `block`}
@media (min-width: 320px) and (max-width: 480px) {
    width: 5vh;
    height: 5vh;
    display: block;
}`

const Workspace = styled(Flex)`
width: 94vw;
height: 100vh;
background-color: ${mvConsts.colors.background.secondary};
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
background-color: ${props => props.selected && `white`};
&:hover { background-color: white; }
@media (min-width: 320px) and (max-width: 480px) {
    
}`
/*eslint-enable no-unused-vars*/