/*eslint-disable no-unused-vars*/

import React from 'react'
import { connect } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import Parse from 'parse'
import Button from './UI/Button'
import GoogleAPI from '../../API/GoogleAPI'
import VK from '../../API/VKAPI'
import mvConsts from '../../constants/mvConsts'
import Container from '../Container'
import uiActions from '../../redux/actions/UIActions'
import clubActions from '../../redux/actions/ClubActions'
import usersActions from '../../redux/actions/UsersActions'
import constantsActions from '../../redux/actions/ConstantsActions'
import screens from './screens'
import axios from 'axios'

let shadeColor2 = (color, percent) => {
    // eslint-disable-next-line
    var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    // eslint-disable-next-line
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

let menuItems = [
    {
        title: `Стирка`,
        image: require('../../assets/images/laundry_selected.svg'),
        color: mvConsts.colors.yellow,
        name: mvConsts.screens.laundry,
        admin: false,
    },
    // {
    //     title: `Клуб и КДС`,
    //     image: require('../../assets/images/laundry_selected.svg'),
    //     color: mvConsts.colors.accept,
    //     name: mvConsts.screens.club,
    //     admin: false,
    // },
    {
        title: `Пользователи`,
        image: require('../../assets/images/laundry_selected.svg'),
        color: mvConsts.colors.purple,
        name: mvConsts.screens.users,
        admin: true,
    },
]

let sub = (class_name, column_name, value, onRecive) => {
    let q = new Parse.Query(class_name)
    if (column_name) {
        q.equalTo(column_name, value)
        q.first().then((d) => { onRecive(d) })
    } else {
        q.find().then((d) => { onRecive(d) })
    }
    let s = q.subscribe()
    s.on(`update`, (d) => { onRecive(d) })
    s.on(`create`, (d) => { onRecive(d) })
    s.on(`delete`, (d) => { q.first().then((d) => { onRecive(d) }) })
    return s
}

class MainScreen extends React.Component {
    balance_sub;
    nfc_sub;
    club_sub;
    users_sub;
    componentDidMount() {
        axios.defaults.headers.common['Accept'] = axios.defaults.headers.common['Accept'] + `, ` + Parse.User.current().getSessionToken();
        axios.get(`http://dcam.pro/api/roles/get_my_roles/`)
            .then((d) => { this.props.setAdmin(d.data.indexOf(`ADMIN`) > -1) })
            .catch((d) => { mvConsts.error(d) })
        this.balance_sub = sub(`Balance`, `userId`, Parse.User.current().id, (d) => { this.props.setBalance(d.get(`money`)) })
        this.nfc_sub = sub(`NFC`, `userId`, Parse.User.current().id, (d) => { this.props.setNfcOwner(d ? true : false) })
        this.club_sub = sub(`Club`, null, null, (d) => { Parse.Cloud.run(`getClubBooks`).then((d) => { this.props.setClubBooks(d) }) })
        this.users_sub = sub(`User`, null, null, (d) => {
            axios.get(`http://dcam.pro/api/users/get_users_list`)
                .then((d) => { this.props.setUsersList(d.data) })
                .catch((d) => { mvConsts.error(d) })
        })
    }
    componentWillUnmount() {
        this.balance_sub.unsubscribe();
        this.nfc_sub.unsubscribe();
        this.club_sub.unsubscribe();
        this.users_sub.unsubscribe();
        axios.defaults.headers.common['Accept'] = axios.defaults.headers.common['Accept'].split(`, r:`)[0];
    }
    render = () => {
        return (
            <Wrapper>
                <Menu>
                    <Logo>
                        <span role="img" aria-label="dcam">🌿</span>
                    </Logo>
                    <MenuItemsRow>
                        {
                            menuItems.filter(i => !i.admin || this.props.is_admin).map((item, index) => {
                                return (
                                    <MenuItem
                                        key={index}
                                        selected={this.props.mainAppScreen === item.name}
                                        color={item.color}
                                        onClick={() => { this.props.setMainAppScreen(item.name) }}
                                        width={100 / menuItems.filter(i => !i.admin || this.props.is_admin).length}
                                    >
                                        <MenuIcon
                                            src={item.image}
                                            alt={item.title}
                                        />
                                        {/* {item.title} */}
                                    </MenuItem>
                                )
                            })
                        }
                    </MenuItemsRow>
                </Menu>
                <RightPart>
                    <Header>
                        <MoneyBalance
                            width={4}
                            selected={this.props.popUpWindow === mvConsts.popUps.TOP_BALANCE_WINDOW}
                        // onClick={() => { this.props.setPopUpWindow(mvConsts.popUps.TOP_BALANCE_WINDOW) }}
                        >
                            <Container extraProps={` width: 3vw; height: 3vw; border-radius: 3vw; background-color: ${this.props.money > 0 ? mvConsts.colors.accept : mvConsts.colors.background.support}; color: white; font-size: 0.8vw; transition: background-color 0.2s; `} >
                                {this.props.money} ₽
                            </Container>
                        </MoneyBalance>
                        <MoneyBalance
                            width={16}
                            selected={this.props.popUpWindow === mvConsts.popUps.TOP_PROFILE_MENU}
                            onClick={() => { this.props.setPopUpWindow(mvConsts.popUps.TOP_PROFILE_MENU) }}
                        >
                            <Container extraProps={` width: 3vw; height: 3vw; border-radius: 3vw; background-color: ${mvConsts.colors.background.support}; `} >
                                <img src={Parse.User.current().get(`avatar`)} alt={``} style={{ width: `3vw`, borderRadius: `3vw`, }} />
                            </Container>
                            <Container alignItems={`flex-start`} extraProps={` width: 9vw; height: 1vw; margin: 0.5vw; color: ${mvConsts.colors.text.primary}; `} >
                                {/* {Parse.User.current().get(`name`).split(` `)[0]} */}
                                {Parse.User.current().get(`username`).split(`@`)[0]}
                            </Container>
                            {/*<img src={require('../../assets/images/arrow_down.svg')} alt={``} style={{ width: `1vw`, }} />*/}
                            🍕
                        </MoneyBalance>
                    </Header>
                    <MainPart>
                        {screens.filter(item => item.props.name === this.props.mainAppScreen)[0]}
                    </MainPart>
                </RightPart>
            </Wrapper>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        mainAppScreen: state.ui.mainAppScreen,
        popUpWindow: state.ui.popUpWindow,
        money: state.constants.money,
        is_admin: state.ui.is_admin,
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        setMainAppScreen: (data) => {
            return dispatch(uiActions.setMainAppScreen(data))
        },
        setPopUpWindow: (data) => {
            return dispatch(uiActions.setPopUpWindow(data))
        },
        setNfcOwner: (data) => {
            return dispatch(constantsActions.setNfcOwner(data))
        },
        setBalance: (data) => {
            return dispatch(constantsActions.setBalance(data))
        },
        setClubBooks: (data) => {
            return dispatch(clubActions.setClubBooks(data))
        },
        setUsersList: (data) => {
            return dispatch(usersActions.setUsersList(data))
        },
        setAdmin: (data) => {
            return dispatch(uiActions.setAdmin(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)

const MenuIcon = styled.img`
width: 2.5vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 10vw;
}
`;

const MenuItemsRow = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 6vw
height: 90vh
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 7vh;
    flex-direction: row;
}
`

const MoneyBalance = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
width: ${props => props.width ? props.width : 4}vw;
height: 4vw;
border-radius: 1vw;
margin: 0.5vw;
cursor: pointer;
&:hover { background-color: ${mvConsts.colors.background.primary}; };
${props => props.selected ? `background-color: ${mvConsts.colors.background.primary};` : null};
transition: 0.2s
`

const MenuItem = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
width: 6vw;
height: 10vh;
background-color: ${props => props.selected ? shadeColor2(props.color, 0.5) : null};
cursor: pointer;
font-size: 0.6vw;
color: ${mvConsts.colors.text.support};
position: relative;
box-sizing: border-box;
border-right: 0.15vw solid ${props => props.selected ? props.color : `transparent`};
:hover {
    background-color: ${props => !props.selected ? mvConsts.colors.background.secondary : shadeColor2(props.color, 0.3)};
}
// transition: 0.2s;
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.width}vw;
    height: 7vh;
    border-right: transparent;
    border-top: 1vw solid ${props => props.selected ? props.color : `transparent`};
}
`

const Logo = styled.div`
display: flex;
justify-content: center;
align-items: center;
width: 6vw;
height: 10vh;
transition: 0.2s;
border-bottom: 0.1vh solid ${mvConsts.colors.background.secondary};
@media (min-width: 320px) and (max-width: 480px) {
    display: none;
}
`

const Header = styled.div`
display: flex;
justify-content: flex-end;
align-items: center;
width: 94vw;
height: 10vh;
z-index: 2;
transition: 0.2s;
@media (min-width: 320px) and (max-width: 480px) {
    display: none;
}
`

const MainPart = styled.div`
display: flex;
justify-content: center;
align-items: center;
width: 94vw;
height: 92vh;
transition: 0.2s;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw
    height: 93vh;
    margin-top: 7vh;
}
`

const Menu = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
width: 6vw;
height: 100vh;
background-color: ${mvConsts.colors.background.primary};
transition: 0.2s;
@media (min-width: 320px) and (max-width: 480px) {
    position: fixed;
    z-index: 10;
    top: 0;
    width: 100vw;
    height: 7vh;
}
`

const RightPart = styled.div`
display: flex;
justify-content: center;
flex-direction: column;
align-items: center;
width: 94vw;
height: 100vh;
background-color: ${mvConsts.colors.background.secondary};
transition: 0.2s;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw
}
`

const Wrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;
width: 100vw;
height: 100vh;
background-color: ${mvConsts.colors.background.primary};
transition: 0.2s;
`

/*eslint-enable no-unused-vars*/