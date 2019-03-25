/*eslint-disable no-unused-vars*/

import Button from './Screens/UI/Button'
import Container from './Container'
import EntryScreen from './Screens/EntryScreen'
import GoogleAPI from '../API/GoogleAPI';
import VK from '../API/VKAPI'
import MainScreen from './Screens/MainScreen'
import Parse from 'parse'
import ParseGoogleAuthAdapter from '../API/ParseGoogleAuthAdapter'
import PopUpWrapper from './Screens/PopUps/PopUpWrapper'
import React from 'react'
import config from '../constants/config'
import constantsActions from '../redux/actions/ConstantsActions'
import moment from 'moment-timezone'
import mvConsts from '../constants/mvConsts'
import popUps from './Screens/PopUps/popUps'
import styled, { keyframes } from 'styled-components'
import rotate from '../assets/images/rotate.svg'
import { connect } from 'react-redux'

Parse.initialize(config.PARSE_APP_ID, config.PARSE_JS_KEY);
Parse.serverURL = config.PARSE_SERVER_URL

let popUpsRender = popUps.map((item, index) => {
    return (
        <PopUpWrapper key={index} >
            {item}
        </PopUpWrapper>
    )
})

let sub = (class_name, column_name, value, onRecive) => {
    let q = new Parse.Query(class_name)
    q.equalTo(column_name, value)
    q.first().then((d) => { onRecive(d) })
    let s = q.subscribe()
    s.on(`update`, (d) => { onRecive(d) })
    s.on(`create`, (d) => { onRecive(d) })
    s.on(`delete`, (d) => { q.first().then((d) => { onRecive(d) }) })
}

class App extends React.Component {
    state = {
        auth: Parse.User.current(),
        server_time: 0,
        init: false,
    }
    componentDidMount() {
        let onInit = () => { this.setState({ init: true }) }
        let onAuthChange = () => { this.setState({ auth: Parse.User.current() }) }
        ParseGoogleAuthAdapter(onInit, onAuthChange, onAuthChange)
        sub(`Constants`, `name`, `timestamp`, (d) => { this.props.setServerTime(+moment(+d.get(`value`)).tz(`Europe/Moscow`)) })
        sub(`Constants`, `name`, `laundry_cost`, (d) => { this.props.setLaundryCost(d.get(`value`)) })
        VK.initVK();
    }
    render = () => {
        if (this.state.init) {
            return (
                <Wrapper>
                    {/* <Stub>
                        <img
                            src={rotate}
                            style={{ width: `20vw` }}
                            alt={``}
                        />
                        Переверните телефон
                        <div style={{ fontSize: `3vw` }} >
                            Мобильная версия сайта еще в разработке
                        </div>
                    </Stub> */}
                    {this.state.auth ? <MainScreen /> : <EntryScreen />}
                    {this.state.auth ? popUpsRender : null}
                </Wrapper>
            )
        } else {
            return <TempScreen />
        }
    }
}

const Stub = styled.div`
position: absolute;
z-index: 1000;
display: none;
justify-content: center
align-items: center
flex-direction: column
width: 100vw
height: 100vh
background-color: ${mvConsts.colors.purple}
color: white;
transition: 0.2s;
@media only screen and (max-width: 767px) and (orientation: portrait) {
    display: flex;
}
`

let mapStateToProps = (state) => {
    return {
        server_time: state.constants.server_time,
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        setServerTime: (data) => {
            return dispatch(constantsActions.setServerTime(data))
        },
        setLaundryCost: (data) => {
            return dispatch(constantsActions.setLaundryCost(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

const Wrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 100vw
height: 100vh
background-color: ${mvConsts.colors.background.primary}
transition: 0.2s
`

let TempScreen = () => {
    const Wrapper = styled.div`
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column
    width: 100vw
    height: 100vh
    transition: 0.2s
    `
    const Bottom = styled.div`
    display: flex
    position: absolute
    bottom: 0
    justify-content: center
    align-items: flex-start
    flex-direction: row
    width: 100vw
    padding: 1vw;
    background-color: ${mvConsts.colors.purple}
    @media (min-width: 320px) and (max-width: 480px) {
        flex-direction: column
        align-items: center
    }
    transition: 0.2s
    `
    return (
        <Wrapper>
            <Button short={false} backgroundColor={`transparent`} >
                <Container extraProps={` color: black; flex-direction: row; @media (min-width: 320px) and (max-width: 480px) { font-size: 4vw } `} >
                    Загрузка... <span role="img" aria-label="hand">🙈</span>
                </Container>
            </Button>
            <Bottom>
                <Container extraProps={` width: 80%; height: 3vw; color: white; font-size: 0.8vw; text-align: left; @media (min-width: 320px) and (max-width: 480px) { height: 15vh; font-size: 3vw }`} >
                    Мы используем cookie на сайте для автоматической авторизации через сервисы Google при загрузке страницы. Если эта страница висит достаточно долго - Вы запретили cookie в Вашем браузере или для этой страницы. Разрешите использование cookie в настройках браузера, и обновите страницу.
                </Container>
                <Button short={false} onClick={() => {
                    alert(document.cookie);
                }} >
                    <Container extraProps={`flex-direction: row; @media (min-width: 320px) and (max-width: 480px) { font-size: 4vw; } `} >
                        Просмотреть cookie <span role="img" aria-label="hand">🍪</span>
                    </Container>
                </Button>
            </Bottom>
        </Wrapper>
    )
}

/*eslint-enable no-unused-vars*/