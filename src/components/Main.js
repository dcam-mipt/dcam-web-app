/*eslint-disable no-unused-vars*/
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import userActions from '../redux/actions/UserActions'
import machinesActions from '../redux/actions/MachinesActions'
import laundryActions from '../redux/actions/LaundryActions'
import Laundry from './Laundry'
import axios from 'axios'
import styled from 'styled-components'
import mvConsts from '../constants/mvConsts'
import Button from './Button'
import Input from './Input'
import useComponentVisible from './useComponentVisible'

let Main = (props) => {
    useEffect(() => {
        axios.defaults.headers.common.Authorization = props.token
        axios.get(`http://dcam.pro/api/machines/get`)
            .then((d) => { props.setMachines(d.data) })
            .catch((d) => { console.log(d) })
        axios.get(`http://dcam.pro/api/laundry/get`)
            .then((d) => { props.setLaundry(d.data) })
            .catch((d) => { console.log(d) })
        axios.get(`http://dcam.pro/api/user/get_my_info`)
            .then((d) => { props.setUserInfo(d.data) })
            .catch((d) => { console.log(d) })
        axios.get(`http://dcam.pro/api/roles/get_my_roles/`)
            .then((d) => { props.setAdmin(d.data.indexOf(`ADMIN`) > -1) })
            .catch((d) => { console.log(d) })
        return () => { axios.defaults.headers.common.Authorization = undefined }
    })
    let [profileRef, profileVisible, setProfileVisible] = useComponentVisible(false);
    let signOut = () => new Promise((resolve, reject) => {
        axios.get(`http://dcam.pro/api/auth/sign_out`)
            .then((d) => { props.setToken(undefined); resolve(d); })
            .catch((d) => { console.log(d); reject(d) })
    })
    let [value, setValue] = useState(``)
    let [order_id, setOrderId] = useState(0)
    return (
        <Wrapper>
            <PopUp ref={profileRef} visible={profileVisible} >
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
                <Button onClick={() => { signOut() }} >
                    sign out
                </Button>
            </PopUp>
            <Menu>

            </Menu>
            <Workspace>
                <Header>
                    <Button onClick={() => { setProfileVisible(!profileVisible) }} >
                        0р
                    </Button>
                </Header>
                <Space>
                    <Laundry />
                </Space>
            </Workspace>
        </Wrapper>
    )
}

let mapStateToProps = (state) => {
    return {
        token: state.user.token,
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
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main)

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
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 8vh;
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
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 92vh;
}`

const Header = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s;
width: 94vw;
height: 8vh;
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

const PopUp = styled.div`
display: block;
max-height: 92vh;
overflow: scroll;
transition: 0.2s
border-radius: 1vw;
background-color: white;
z-index: 2;
position: absolute;
top: ${props => (props.visible ? 0 : 2) + 1}vw;
right: 1vw;
visibility: ${props => props.visible ? `visible` : `hidden`}
opacity: ${props => +props.visible};
padding: 1vw;
@media (min-width: 320px) and (max-width: 480px) {
    
}`
/*eslint-enable no-unused-vars*/