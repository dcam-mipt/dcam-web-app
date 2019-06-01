/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import GoogleAPI from '../API/GoogleAPI'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Main from './Main'
import Entry from './Entry'
import { Flex, Image, Text, Rotor } from './styled-templates'
import mvConsts from '../constants/mvConsts'

let theme = mvConsts.colors

let GoogleWrapper = (props) => {
    let [init, setInit] = useState(false)
    useEffect(() => {
        GoogleAPI.init()
            .then((d) => { setInit(true) })
            .catch((d) => {
                console.log(`google initialization error`)
            })
    })
    return init ? props.user.token ? <Main /> : <Entry /> : <LoadingPage />
}

let LoadingPage = (props) => {
    return (
        <LoadingPageWrapper>
            <Flex>
                <Rotor><Image src={require(`../assets/images/menu.svg`)} width={5} /></Rotor>
                <Text>Подключаем почту</Text>
            </Flex>
        </LoadingPageWrapper>
    )
}

const LoadingPageWrapper = styled(Flex)`
width: 100vw;
height: 100vh;
background-color: ${props => props.background.primary};
@media (min-width: 320px) and (max-width: 480px) {
    
}`

let mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

connect(mapStateToProps)(LoadingPage)
export default connect(mapStateToProps)(GoogleWrapper)
/*eslint-enable no-unused-vars*/