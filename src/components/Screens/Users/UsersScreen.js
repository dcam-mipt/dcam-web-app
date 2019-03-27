/*eslint-disable no-unused-vars*/

import React from 'react'
import { connect } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import axios from 'axios'
import mvConsts from '../../../constants/mvConsts'
import Container from '../../Container'
import Button from '../UI/Button'
import Input from '../UI/Input'
import usersActions from '../../../redux/actions/UsersActions'
import Parse from 'parse'
import moment from 'moment'

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

class UsersScreen extends React.Component {
    state = {
        filter: ``,
        selected_user: undefined,
        promotion: 0,
        penalty: 0,
    }
    users_sub;
    componentDidMount() {
        this.users_sub = sub(`Balance`, null, null, (d) => { this.getUsersList() })
    }
    componentWillUnmount() {
        this.users_sub.unsubscribe();
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.selected_user) {
            this.setState({ selected_user: nextProps.users_list.filter(i => i.objectId === this.state.selected_user.objectId)[0] })
        }
    }
    getUsersList = () => {
        axios.get(`http://dcam.pro/api/users/get_users_list`)
            .then((d) => { this.props.setUsersList(d.data) })
            .catch((d) => { mvConsts.error(d) })
    }
    render = () => {
        if (this.props.is_admin) {
            return (
                <Wrapper>
                    <Container extraProps={`display: block; width: 20vw; max-height: 90vh; overflow: scroll;`} >
                        <Container extraProps={`align-items: flex-start; justify-content: flex-start;`} >
                            <Container extraProps={`padding: 0.2vw; border-radius: 0.5vw; background-color: ${mvConsts.colors.background.primary}`} >
                                <Input placeholder={`Поиск`} value={this.state.filter} onChange={(e) => { this.setState({ filter: e }) }} />
                            </Container>
                            {
                                this.props.users_list
                                    .filter(i => i.username.split(`@`)[0].indexOf(this.state.filter) > -1)
                                    .sort((a, b) => +moment(b.last_seen) - +moment(a.last_seen))
                                    .map((i, index) => {
                                        let is_online = +moment() - i.last_seen < 120000
                                        let was_today = +moment().startOf(`day`) === +moment(i.last_seen).startOf(`day`) && i.last_seen !== undefined
                                        return (
                                            <User onClick={() => { this.setState({ selected_user: this.state.selected_user && this.state.selected_user.objectId === i.objectId ? undefined : i, promotion: 0, penalty: 0 }) }} key={index} >
                                                <Container extraProps={`width: 3vw; height: 3vw; border-radius: 3vw; position: relative; background-color: ${mvConsts.colors.background.secondary}`} >
                                                    <img
                                                        src={i.avatar}
                                                        style={{ width: `3vw`, borderRadius: `3vw` }}
                                                        alt={``}
                                                    />
                                                    {
                                                        is_online
                                                            ? <Container extraProps={`position: absolute; width: 1vw; height: 1vw; top: 0vw; right: 0vw; border: 0.2vw solid ${mvConsts.colors.background.primary}; background-color: ${mvConsts.colors.accept}; border-radius: 1vw;`} >

                                                            </Container>
                                                            : null
                                                    }
                                                </Container>
                                                <Container extraProps={`margin-left: 1vw; align-items: flex-start;`} >
                                                    <Container extraProps={`font-size: 1vw`} >
                                                        {i.username.split(`@`)[0]}
                                                    </Container>
                                                    <Container extraProps={`color: ${mvConsts.colors.text.support}`} >
                                                        {is_online ? `онлайн` : `оффлайн с ` + (was_today ? `сегодгня в ` + moment(i.last_seen).format(`HH:mm`) : moment(i.last_seen).format(`DD.MM.YY HH:mm`))}
                                                    </Container>
                                                </Container>
                                            </User>
                                        )
                                    })
                            }
                        </Container>
                    </Container>
                    <Container extraProps={`width: 70vw; align-items: flex-start;`} >
                        {
                            this.state.selected_user
                                ? <Container>
                                    <Container extraProps={`padding: 0.5vw; border-radius: 0.5vw; margin-bottom: 0.5vw; background-color: ${mvConsts.colors.background.primary};`} >
                                        <Container extraProps={`width: 17vw; align-items: flex-start; font-size: 1vw;`} >
                                            {this.state.selected_user.username.split(`@`)[0]}
                                        </Container>
                                        <Container extraProps={`width: 17vw; align-items: flex-start; font-size: 1vw;`} >
                                            {this.state.selected_user.money} ₽
                                        </Container>
                                    </Container>
                                    <Container extraProps={`padding: 0.5vw; border-radius: 0.5vw; margin-bottom: 0.5vw; background-color: ${mvConsts.colors.background.primary};`} >
                                        <Container extraProps={`flex-direction: row;`} >
                                            <Input placeholder={`Сумма`} short={true} value={this.state.promotion} onChange={(e) => { this.setState({ promotion: e }) }} />
                                            <Button backgroundColor={mvConsts.colors.accept} onClick={() => {
                                                if (!isNaN(this.state.promotion)) {
                                                    axios.get(`http://dcam.pro/api/balance/edit/${this.state.selected_user.objectId}/${this.state.promotion}`)
                                                        .then((d) => { })
                                                        .catch((d) => { mvConsts.error(d) })
                                                }
                                            }} >
                                                Поощрить
                                            </Button>
                                        </Container>
                                        <Container extraProps={`flex-direction: row;`} >
                                            <Input placeholder={`Сумма`} short={true} value={this.state.penalty} onChange={(e) => { this.setState({ penalty: e }) }} />
                                            <Button backgroundColor={mvConsts.colors.WARM_ORANGE} onClick={() => {
                                                if (!isNaN(this.state.penalty)) {
                                                    axios.get(`http://dcam.pro/api/balance/edit/${this.state.selected_user.objectId}/${-this.state.penalty}`)
                                                        .then((d) => { })
                                                        .catch((d) => { mvConsts.error(d) })
                                                }
                                            }} >
                                                Штраф
                                            </Button>
                                        </Container>
                                    </Container>
                                </Container>
                                : null
                        }
                    </Container>
                </Wrapper>
            )
        } else {
            return null
        }
    }
}

let mapStateToProps = (state) => {
    return {
        users_list: state.users.users_list,
        is_admin: state.ui.is_admin,
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        setUsersList: (data) => {
            return dispatch(usersActions.setUsersList(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersScreen)

const Wrapper = styled.div`
display: flex
justify-content: flex-start
align-items: flex-start
flex-direction: row;
padding: 1vw;
width: 94vw
height: 90vh;
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    flex-direciton: column;
}
`

const User = styled.div`
display: flex;
justify-content: center;
align-items: center;
justify-content: flex-start;
flex-direction: row;
padding: 0.5vw;
border-radius: 0.5vw;
margin: 0.25vw 0 0.25vw 0;
cursor: pointer;
width: 17vw;
background-color: ${mvConsts.colors.background.primary};
&:hover {
    background-color: rgba(0, 0, 0, 0.1)
}
transition: 0.2s
`

/*eslint-enable no-unused-vars*/