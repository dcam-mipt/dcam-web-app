/*eslint-disable no-unused-vars*/
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import userActions from '../redux/actions/UserActions'
import machinesActions from '../redux/actions/MachinesActions'
import laundryActions from '../redux/actions/LaundryActions'
import Laundry from './Laundry'
import axios from 'axios'
import styled from 'styled-components'
import mvConsts from '../constants/mvConsts'
import Button from './Button'

let Main = (props) => {
    axios.defaults.headers.common.Authorization = props.user.token
    axios.get(`http://dcam.pro/api/machines/get`)
        .then((d) => { props.setMachines(d.data) })
        .catch((d) => { console.log(d) })
    axios.get(`http://dcam.pro/api/laundry/get`)
        .then((d) => { props.setLaundry(d.data) })
        .catch((d) => { console.log(d) })
    useEffect(() => () => { axios.defaults.headers.common.Authorization = undefined })
    let signOut = () => new Promise((resolve, reject) => {
        axios.get(`http://dcam.pro/api/auth/sign_out`)
            .then((d) => { props.setToken(undefined); resolve(d); })
            .catch((d) => { console.log(d); reject(d) })
    })
    return (
        <Wrapper>
            <Menu>

            </Menu>
            <Workspace>
                <Header>
                    <Button onClick={() => { signOut() }} >
                        sign out
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
        user: state.user,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        setToken: (data) => {
            return dispatch(userActions.setToken(data))
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
/*eslint-enable no-unused-vars*/