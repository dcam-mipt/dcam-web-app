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

let m = mvConsts.mobile_media_query

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
                .catch((d) => { mvConsts.error(d) })
        }
    }
    componentDidMount() {
        new Parse.Query(`Roles`)
            .equalTo(`userId`, Parse.User.current().id)
            .equalTo(`role`, `ADMIN`)
            .first()
            .then((d) => { this.setState({ is_admin: d ? true : false }) })
            .catch((d) => { mvConsts.error(d) })
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
            @media (min-width: 320px) and (max-width: 480px) {
                border-radius: 4vw;
                top: ${visible ? 10 : 14}vh;
                right: 2vw;
                width: 96vw;
                padding: 2vw 2vw 2vw 2vw;
            }
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
                                <Container extraProps={`width: 3vw; height: 3vw; background-color: ${mvConsts.colors.background.support}; border-radius: 3vw; ${m(`width: 15vw; height: 15vw; border-radius: 15vw;`)}`} >
                                    {this.state.user
                                        ? <Avatar
                                            src={this.state.user.avatar}
                                            alt={``}
                                        />
                                        : null}
                                </Container>
                                <Container>
                                    <Container extraProps={`width: 10.5vw; align-items: flex-start; margin-left: 1vw; font-size: 1vw; color: ${mvConsts.colors.text.primary}; ${m(`width: 52.5vw; font-size: 4vw; margin-left: 5vw;`)} `} >
                                        {this.state.user ? this.state.user.username.split(`@`)[0] : null}
                                    </Container>
                                    <Container extraProps={`width: 10.5vw; align-items: flex-start; margin-left: 1vw; color: rgba(0, 0, 0, 0.4); ${m(`width: 52.5vw; font-size: 4vw; margin-left: 5vw;`)} `} >
                                        {/* {this.state.user ? this.state.user.name.split(` `)[0] : null} */}
                                        {`...`}
                                    </Container>
                                </Container>
                                <Container
                                    extraProps={`width: 2.5vw; height: 2.5vw; border-radius: 0.5vw; background-color: ${mvConsts.colors.vk}; cursor: pointer; visibility: ${(this.state.user ? this.state.user.vk : false) ? `visible` : `hidden`}; ${m(`width: 12.5vw; height: 12.5vw; border-radius: 2.5vw;`)} `}
                                    onClick={() => {
                                        if (this.state.user) {
                                            window.open(this.state.user.vk)
                                        }
                                    }}
                                >
                                    <Image
                                        width={1}
                                        src={vk_logo}
                                        alt={``}
                                    />
                                </Container>
                            </Container>
                            <Container extraProps={`flex-direction: row; padding: 0.5vw 0 0.5vw 0; ${m(`padding: 2.5vw 0 2.5vw 0;`)}`} >
                                <Container>
                                    <Container extraProps={`width: 5vw; align-items: flex-start; font-size: 0.8vw; color: ${mvConsts.colors.text.support}; ${m(`width: 25vw; font-size: 4vw;`)}`} >
                                        {mvConsts.weekDays.full[moment(book_details.timestamp).tz(`Europe/Moscow`).day()]}
                                    </Container>
                                    <Container extraProps={`width: 5vw; align-items: flex-start; font-size: 0.8vw; color: ${mvConsts.colors.text.primary}; ${m(`width: 25vw; font-size: 4vw;`)}`} >
                                        {moment(book_details.timestamp).tz(`Europe/Moscow`).format(`DD.MM.YY`)}
                                    </Container>
                                </Container>
                                <Container extraProps={`font-size: 1.5vw; width: 8.5vw; color: ${mvConsts.colors.text.primary}; ${m(`font-size: 7.5vw; width: 42.5vw;`)} `} >
                                    {moment(book_details.timestamp).tz(`Europe/Moscow`).format(`HH:mm`)}
                                </Container>
                                <Container extraProps={`width: 2vw; height: 2vw; margin: 0 0.25vw 0 0.25vw; border-radius: 2vw; background: ${mvConsts.colors.accept}; margin-left: 1vw; color: white; ${m(`width: 10vw; height: 10vw; margin: 0 1.25vw 0 1.25vw; border-radius: 10vw; margin-left: 5vw; font-size: 3vw;`)}`} >
                                    {this.props.machines.map(i => i.objectId).indexOf(book_details.machineId) + 1}
                                </Container>
                            </Container>
                            <Container extraProps={`width: 17vw; flex-direction: row; justify-content: flex-start; ${m(`width: 85vw;`)}`} >
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
                                                    .then((d) => { this.props.openLaundryBookDetails(undefined) })
                                                    .catch((d) => { mvConsts.error(d) })
                                            }}
                                        >
                                            <Image
                                                width={2}
                                                src={require('../../../assets/images/money.svg')}
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
        openLaundryBookDetails: (data) => {
            return dispatch(laundryActions.openLaundryBookDetails(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaundryBookDetails)

const Avatar = styled.img`
width: 3vw;
border-radius: 3vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 15vw;
    border-radius: 15vw;
}`

const Image = styled.img`
width: ${props => props.width}vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.width * 5}vw;
}`

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
@media (min-width: 320px) and (max-width: 480px) {
    width: 15vw;
    height: 15vw;
    margin: 1.25vw;
    border-radius: 2.5vw;
}`

/*eslint-enable no-unused-vars*/