/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
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
                axios.get(`${mvConsts.api}/auth/${d.Qt.zu}/${d.Qt.dV}/${d.Qt.Ad}`)
                // axios.get(`${mvConsts.api}/auth/${d.w3.U3}/${d.w3.Eea}/${d.w3.ig}`)
                    .then((d) => { props.setToken(d.data); resolve(d); })
                    .catch((d) => { console.log(d); reject(d); })
            })
            .catch((d) => { console.log(d) })
    })
    let [photos, set_photos] = useState([])
    let [current_photo, set_current_photo] = useState(0)
    useEffect(() => {
        window.VK.api("photos.get", { "owner_id": "-46253638", "album_id": "267290657", "count": "1000", "v": "5.103" }, (data) => {
            set_photos(data.response.items.filter(i => i.sizes[0].width > i.sizes[0].height).map(i => i.sizes.pop().url))
            set_current_photo(Math.round(Math.random() * data.response.items.length))
            setInterval(() => {
                set_current_photo(Math.round(Math.random() * data.response.items.length))
            }, 5000)
        });
    }, [])
    return (
        <Wrapper>
            <Left>
                <Flex extra={`width: 100%; height: 100%;`} >
                    {
                        photos.length > 0 && <Image extra={`height: 110%;`} src={photos[current_photo]} />
                    }
                    <Overlay>
                        <Image src={require(`../assets/images/psamcs_logo.svg`)} width={30} />
                    </Overlay>
                </Flex>
            </Left>
            <Right>
                <Flex extra={`margin-bottom: 10%;`} ><Image src={require(`../assets/images/menu.svg`)} width={3} /></Flex>
                <Flex extra={`align-items: flex-start;`} >
                    <Text size={2} bold>Войти</Text>
                    <Text>при помощи почты @phystech.edu</Text>
                    <MarginWrapper>
                        <Button background={props => props.theme.purple} onClick={() => { signIn() }} >Авторизация</Button>
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

const Overlay = styled(Flex)`
width: 70vw;
height: 100%;
background: rgba(0, 0, 0, 0.5);
position: absolute;
z-index: 1;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

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
    height: 88vh;
}`

const Left = styled(Flex)`
width: 70vw;
height: 100vh;
background: rgba(0, 0, 0, 0.02);
@media (min-width: 320px) and (max-width: 480px) {
    display: none;
}`
const Right = styled(Flex)`
width: 30vw;
height: 100vh;
background: ${props => props.theme.background.primary};
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 100vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 88vh;
}`
/*eslint-enable no-unused-vars*/