/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import GoogleAPI from '../API/GoogleAPI'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Main from './Main'
import Entry from './Entry'
import { Flex, Image, Text, Rotor } from './UIKit/styled-templates'
import mvConsts from '../constants/mvConsts'
import moment from 'moment-timezone'
import { ThemeWrapper } from './UIKit/styled-templates'

let GoogleWrapper = (props) => {
    let [init, setInit] = useState(false)
    moment.tz.zone(`Europe/Moscow`)
    useEffect(() => {
        GoogleAPI.init()
            .then((d) => { setInit(true) })
            .catch((d) => {
                console.log(`google initialization error`, d)
            })
    })
    return <ThemeWrapper>
        {init ? props.user.token ? <Main /> : <Entry /> : <LoadingPage />}
    </ThemeWrapper>
    // return <Sorry/>
}

let Sorry = () => {
    return (
        <Flex extra={`width: 100vw; height: 100vh; background-color: ${props => props.theme.purple}`} >
            <Text color={`white`} size={1.2} > Извините, сайт временно находится на обслуживании, зайдите утречком ещё раз.</Text>
            <Text color={`white`} bold extra={`margin-top: 2vh;`} >{moment().startOf(`day`).format(`DD.MM.YY`)}</Text>
        </Flex>
    )
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
background-color: ${props => props.theme.background.primary};
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