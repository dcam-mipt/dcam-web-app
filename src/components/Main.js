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
import Button from './Button'
import Input from './Input'
import useComponentVisible from './useComponentVisible'
import AdminTools from './AdminTools';
import GoogleAPI from '../API/GoogleAPI'
import { Flex, Image, Extra, PopUp } from './styled-templates'

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

let Main = (props) => {
    useEffect(() => { document.title = `dcam.${screens.filter(i => i.name === props.main_screen)[0].name.toLocaleLowerCase()}`; })
    useEffect(() => {
        axios.defaults.headers.common.Authorization = props.token
        axios.get(`http://dcam.pro/api/user/get_my_info`)
            .then((d) => {
                props.setUserInfo(Object.assign(GoogleAPI.getCurrentUser().w3, d.data))
                axios.post(`http://dcam.pro/api/user/set_my_avatar`, { url: GoogleAPI.getCurrentUser().w3.Paa })
                    .catch((d) => { console.log(d) })
                axios.get(`http://dcam.pro/api/machines/get`)
                    .then((d) => { props.setMachines(d.data) })
                    .catch((d) => { console.log(d) })
                axios.get(`http://dcam.pro/api/laundry/get`)
                    .then((d) => { props.setLaundry(d.data) })
                    .catch((d) => { console.log(d) })
                axios.get(`http://dcam.pro/api/roles/get_my_roles/`)
                    .then((d) => { props.setAdmin(d.data.indexOf(`ADMIN`) > -1) })
                    .catch((d) => { console.log(d) })
                axios.get(`http://dcam.pro/api/balance/get_my_balance`)
                    .then((d) => { props.setBalance(+d.data) })
                    .catch((d) => { console.log(d) })
            })
            .catch((d) => {
                signOut()
                    .then((d) => { console.log(d) })
                    .catch((d) => { console.log(d) })
            })
        return () => { axios.defaults.headers.common.Authorization = undefined }
    })
    let [profileRef, profileVisible, setProfileVisible] = useComponentVisible(false);
    let signOut = () => new Promise((resolve, reject) => {
        props.setToken(undefined);
        axios.get(`http://dcam.pro/api/auth/sign_out`)
            .then((d) => { resolve(d); })
            .catch((d) => { console.log(d); reject(d) })
    })
    let [value, setValue] = useState(``)
    let [order_id, setOrderId] = useState(0)
    return (
        <Wrapper>
            <PopUp top={3} ref={profileRef} visible={profileVisible} >
                <Flex row >
                    <Image src={props.user && props.user.avatar} width={3} round />
                    <NameBlock>{props.user && props.user.username.split(`@`)[0]}</NameBlock>
                    <Button backgroundColor={mvConsts.colors.WARM_ORANGE} onClick={() => { signOut() }} >Выйти</Button>
                </Flex>
                <Flex>На счету: {props.balance}р</Flex>
                <Flex>
                    <Input
                        placeholder={`Сумма`}
                        short={true}
                        onChange={(d) => { !isNaN(d.target.value) && setValue(d.target.value) }}
                        value={value}
                        // validator={(d) => validator.isInt(d)}
                        number={true}
                    />
                    <form method="POST" action="https://money.yandex.ru/quickpay/confirm.xml">
                        <input type="hidden" name="receiver" value="410018436058863" />
                        <input type="hidden" name="label" value={order_id} />
                        <input type="hidden" name="quickpay-form" value="donate" />
                        <input type="hidden" name="targets" value={`Идентификатор транзакции: ${order_id}`} />
                        <input type="hidden" name="sum" value={+value} data-type="number" />
                        <input type="hidden" name="paymentType" value="AC" />
                        <input id={"yandex_money_button"} type="submit" value={`Далее`} style={{ display: `none` }} />
                        <Button
                            disabled={value < 2}
                            backgroundColor={mvConsts.colors.accept}
                            onClick={() => {
                                axios.get(`http://dcam.pro/api/transactions/start_yandex/${+value}`)
                                    .then((d) => {
                                        setOrderId(d.data)
                                        document.getElementById(`yandex_money_button`).click()
                                    })
                            }}
                        >
                            Пополнить
                        </Button>
                    </form>
                </Flex>
            </PopUp>
            <Menu>
                {screens.filter(i => i.admin ? props.is_admin : true).map((item, index) => <MenuItemImage onClick={() => { props.setMainScreen(item.name) }} src={item.image} key={index} />)}
                <MenuItemImage only_mobile onClick={() => { setProfileVisible(!profileVisible) }} src={require(`../assets/images/menu.svg`)} />
            </Menu>
            <Workspace>
                <Header>
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

const NameBlock = styled.div`
${Flex};
font-size: 1vw;
margin: 0 0.5vw 0 0.5vw;
@media (min-width: 320px) and (max-width: 480px) {
    font-size: 6vw;
    margin: 0 2vw 0 2vw;
}`

const Wrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row;
transition: 0.2s
width: 100vw;
height: 100vh;
@media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
    height: 100vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 85vh;
}`

const Menu = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
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
    justify-content: space-around
}`

const MenuItemImage = styled.img`
transition: 0.2s;
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

const Workspace = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
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

const Header = styled.div`
display: flex
justify-content: center
align-items: flex-end
flex-direction: column
transition: 0.2s;
width: 94vw;
height: 8vh;
padding: 0 2vw 0 0;
@media (min-width: 320px) and (max-width: 480px) {
    display: none;
}`

const Space = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s;
width: 94vw;
height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
}`

const MenuButton = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 3.5vw;
height: 3.5vw;
border-radius: 0.5vw;
background-color: ${props => props.selected && `white`};
&:hover { background-color: white; }
@media (min-width: 320px) and (max-width: 480px) {
    
}`
/*eslint-enable no-unused-vars*/