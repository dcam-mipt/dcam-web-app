/*eslint-disable no-unused-vars*/
import React from 'react'
import { connect } from 'react-redux'
import GoogleAPI from '../API/GoogleAPI'
import userActions from '../redux/actions/UserActions'
import axios from 'axios'
import styled from 'styled-components'
import mvConsts from '../constants/mvConsts'
import Button from './UIKit/Button'
import { Flex, Text, Image } from './UIKit/styled-templates'

let Entry = (props) => {
    let signIn = () => new Promise((resolve, reject) => {
        GoogleAPI.signIn()
            .then((d) => {
                axios.get(`https://dcam.pro/api/auth/${d.w3.U3}/${d.w3.Eea}/${d.w3.ig}`)
                    .then((d) => { props.setToken(d.data); resolve(d); })
                    .catch((d) => { console.log(d); reject(d); })
            })
            .catch((d) => { console.log(d) })
    })
    return (
        <Wrapper>
            <Left>
                <Flex extra={`width: 100%; height: 100%; align-items: flex-start; justify-content: flex-end;`} >
                    <Flex row extra={`margin-left: 1vw;`} >
                        <Text extra={`margin-right: 0.5vw;`} >Это open source проект, вот наш</Text>
                        <Text ><a href="https://github.com/dcam-mipt" target="_blank">GitHub.</a></Text>
                    </Flex>
                    <Flex row extra={`margin: 0 0 1vw 1vw;`} >
                        <Text extra={`margin-right: 0.5vw;`} >Если у Вас возникли проблемы при работе с сайтом - пишите</Text>
                        <Text ><a href="https://vk.com/mityabeldii" target="_blank">eму.</a></Text>
                    </Flex>
                </Flex>
            </Left>
            <Right>
                <Flex extra={`margin-bottom: 10%;`} ><Image src={require(`../assets/images/menu.svg`)} width={3} /></Flex>
                <Flex extra={`align-items: flex-start;`} >
                    <Text size={2} bold>Войти</Text>
                    <Text>при помощи почты @phystech.edu</Text>
                    <MarginWrapper>
                        <Button backgroundColor={mvConsts.colors.purple} onClick={() => { signIn() }} >Авторизация</Button>
                    </MarginWrapper>
                </Flex>
            </Right>
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
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Entry)

const MarginWrapper = styled(Flex)`
margin: 2vw 0  2vw 0;
@media (min-width: 320px) and (max-width: 480px) {
    margin: 10vw 0  10vw 0;
}`

const Wrapper = styled(Flex)`
flex-direction: row
width: 100vw;
height: 100vh;
@media (min-width: 320px) and (max-width: 480px) {
    height: 100vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 85vh;
}`

const Left = styled(Flex)`
width: 70vw;
height: 100vh;
background-color: ${mvConsts.colors.yellow};
@media (min-width: 320px) and (max-width: 480px) {
    display: none;
}`
const Right = styled(Flex)`
width: 30vw;
height: 100vh;
background-color: ${mvConsts.colors.background.primary};
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 100vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 85vh;
}`
/*eslint-enable no-unused-vars*/