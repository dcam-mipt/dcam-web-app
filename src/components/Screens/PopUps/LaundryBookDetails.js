/*eslint-disable no-unused-vars*/
import mvConsts from '../../../constants/mvConsts'
import uiActions from '../../../redux/actions/UIActions'
import laundryActions from '../../../redux/actions/LaundryActions'
import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Container from '../../Container'
import cros from '../../../assets/images/cros.svg'
import money from '../../../assets/images/money.svg'
import vk_logo from '../../../assets/images/vk_logo.svg'
import moment from 'moment'
import Button from '../UI/Button'
import Parse from 'parse'
import VK from '../../../API/VKAPI'
import axios from 'axios';

class LaundryBookDetails extends React.Component {
    state = {
        user: undefined,
        is_admin: false,
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.book_details) {
            // console.log(nextProps.book_details)
            axios.get(`http://dcam.pro/api/users/get_user/${nextProps.book_details.userId}`)
                .then((d) => { this.setState({ user: d.data }) })
                .catch((d) => { console.log(d) })
        }
    }
    componentDidMount() {
        new Parse.Query(`Roles`)
            .equalTo(`userId`, Parse.User.current().id)
            .equalTo(`role`, `ADMIN`)
            .first()
            .then((d) => { this.setState({ is_admin: d ? true : false }) })
            .catch((d) => { console.log(d) })
    }
    render = () => {
        let visible = this.props.popUpWindow === mvConsts.popUps.LAUNDRY_BOOK_DETAILS
        let style = `
            border-radius: 1vw;
            padding: 1vw 1vw 1vw 1vw
            background-color: ${mvConsts.colors.background.primary};
            flex-direction: column
            position: absolute;
            top: ${visible ? 19 : 21}vh;
            right: 2vw;
            box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
            z-index: 2;
            opacity: ${visible ? 1 : 0};
            visibility: ${visible ? `visible` : `hidden`};
            display: block;
            max-height: 70vh;
            overflow-y: scroll;
            transition: 0.2s;
        `
        let { book_details } = this.props
        let is_my_book = book_details ? book_details.userId === Parse.User.current().id : false
        let little_time_to = book_details ? book_details.timestamp - +moment() < 7200000 : false
        return (
            <Container className={mvConsts.popUps.LAUNDRY_BOOK_DETAILS} extraProps={style} >
                {
                    book_details
                        ? <Container>
                            <Container extraProps={`flex-direction: row`} >
                                <Container extraProps={`width: 3vw; height: 3vw; background-color: ${mvConsts.colors.background.support}; border-radius: 3vw;`} >
                                    {this.state.user
                                        ? <img
                                            src={this.state.user.avatar}
                                            style={{ width: `3vw`, borderRadius: `2vw` }}
                                            alt={``}
                                        />
                                        : null}
                                </Container>
                                <Container>
                                    <Container extraProps={`width: 10.5vw; align-items: flex-start; margin-left: 1vw; font-size: 1vw; color: ${mvConsts.colors.text.primary}; `} >
                                        {this.state.user ? this.state.user.username.split(`@`)[0] : null}
                                    </Container>
                                    <Container extraProps={`width: 10.5vw; align-items: flex-start; margin-left: 1vw; color: rgba(0, 0, 0, 0.4); `} >
                                        {/* {this.state.user ? this.state.user.name.split(` `)[0] : null} */}
                                        {`...`}
                                    </Container>
                                </Container>
                                <Container
                                    extraProps={`width: 2.5vw; height: 2.5vw; border-radius: 0.5vw; background-color: ${mvConsts.colors.vk}; cursor: pointer; visibility: ${(this.state.user ? this.state.user.vk : false) ? `visible` : `hidden`} `}
                                    onClick={() => {
                                        if (this.state.user) {
                                            window.open(this.state.user.vk)
                                        }
                                    }}
                                >
                                    <img
                                        src={vk_logo}
                                        style={{ width: `1vw` }}
                                        alt={``}
                                    />
                                </Container>
                            </Container>
                            <Container extraProps={`flex-direction: row; padding: 0.5vw 0 0.5vw 0`} >
                                <Container>
                                    <Container extraProps={`width: 5vw; align-items: flex-start; font-size: 0.8vw; color: ${mvConsts.colors.text.support}`} >
                                        {mvConsts.weekDays.full[moment(book_details.timestamp).tz(`Europe/Moscow`).day()]}
                                    </Container>
                                    <Container extraProps={`width: 5vw; align-items: flex-start; font-size: 0.8vw; color: ${mvConsts.colors.text.primary}`} >
                                        {moment(book_details.timestamp).tz(`Europe/Moscow`).format(`DD.MM.YY`)}
                                    </Container>
                                </Container>
                                <Container extraProps={`font-size: 1.5vw; width: 8.5vw; color: ${mvConsts.colors.text.primary} `} >
                                    {moment(book_details.timestamp).tz(`Europe/Moscow`).format(`HH:mm`)}
                                </Container>
                                <Container extraProps={`width: 2vw; height: 2vw; margin: 0 0.25vw 0 0.25vw; border-radius: 2vw; background: ${mvConsts.colors.accept}; margin-left: 1vw; color: white;`} >
                                    {this.props.machines.map(i => i.machineId).indexOf(book_details.machineId) + 1}
                                </Container>
                            </Container>
                            <Container extraProps={`width: 17vw; flex-direction: row; justify-content: flex-start; `} >
                                {/* {
                                    this.state.is_admin
                                        ? <MiniButton>
                                            <img
                                                src={require('../../../assets/images/trash.svg')}
                                                style={{ width: `1.5vw` }}
                                                alt={``}
                                            />
                                        </MiniButton>
                                        : null
                                } */}
                                {
                                    (this.state.is_admin || is_my_book)
                                    //  && !little_time_to
                                        ? <MiniButton
                                            onClick={() => {
                                                axios.get(`http://dcam.pro/api/laundry/unbook/${book_details.objectId}`)
                                                    .then((d) => { this.props.setPopUpWindow(mvConsts.popUps.EMPTY) })
                                                    .catch((d) => { console.log(d) })
                                            }}
                                        >
                                            <img
                                                src={require('../../../assets/images/money.svg')}
                                                style={{ width: `2vw` }}
                                                alt={``}
                                            />
                                        </MiniButton>
                                        : null
                                }
                            </Container>
                            {/* <Button short={false} onClick={() => { this.props.setPopUpWindow(mvConsts.popUps.EMPTY) }} >
                                Закрыть
                            </Button> */}
                        </Container>
                        : null
                }
            </Container>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        popUpWindow: state.ui.popUpWindow,
        laundry: state.laundry.laundry.filter(i => i.userId === Parse.User.current().id && +moment(i.timestamp) > +moment(state.constants.server_time).startOf(`hour`)).sort((a, b) => a.timestamp - b.timestamp),
        machines: state.machines.machines,
        book_details: state.laundry.book_details,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setPopUpWindow: (data) => {
            return dispatch(uiActions.setPopUpWindow(data))
        },
        selectSlot: (data) => {
            return dispatch(laundryActions.selectSlot(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaundryBookDetails)

const MiniButton = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
width: 3vw;
height: 3vw;
margin: 0.25vw;
background-color: ${mvConsts.colors.background.secondary};
border-radius: 0.5vw;
cursor: pointer;
transition: 0.2s;
`

/*eslint-enable no-unused-vars*/