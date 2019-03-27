/*eslint-disable no-unused-vars*/
import mvConsts from '../../../constants/mvConsts'
import uiActions from '../../../redux/actions/UIActions'
import laundryActions from '../../../redux/actions/LaundryActions'
import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Container from '../../Container'
import cros from '../../../assets/images/cros.svg'
import arrow from '../../../assets/images/arrow.svg'
import moment from 'moment'
import Button from '../UI/Button'
import Parse from 'parse'
import axios from 'axios'

let unbookLaundry = (book) => {
    axios.get(`http://dcam.pro/api/laundry/unbook/${book.laundryId}`)
        .then((d) => { console.log(d) })
        .catch((d) => { mvConsts.error(d) })
}

class Reservations extends React.Component {
    render = () => {
        let visible = this.props.popUpWindow === mvConsts.popUps.RESEVATIONS
        let style = `
            border-radius: 1vw;
            padding: 1vw 1vw 1vw 1vw
            background-color: ${mvConsts.colors.background.primary};
            flex-direction: column
            position: absolute;
            top: ${visible ? 19 : 21}vh;
            right: 39.5vw;
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
        return (
            <Container className={mvConsts.popUps.RESEVATIONS} extraProps={style} >
                <Container extraProps={`font-family: Lato-Bold; font-size: 1.2vw; margin: 0 0 0.5vw 0vw; align-items: flex-start; ${mvConsts.mobile_media_query(`font-size: 6vw; margin: 2.5vw 0 2.5vw 11vw;`)}`} >
                    Мои стирки
                </Container>
                {
                    this.props.laundry.map((item, index) => {
                        return (
                            <Slot key={index} >
                                <Container>
                                    <Container extraProps={`width: 5vw; align-items: flex-start; font-size: 0.8vw; color: ${mvConsts.colors.text.support}; ${mvConsts.mobile_media_query(`width: 30vw; font-size: 4vw;`)}`} >
                                        {mvConsts.weekDays.full[moment(item.timestamp).tz(`Europe/Moscow`).day()]}
                                    </Container>
                                    <Container extraProps={`width: 5vw; align-items: flex-start; font-size: 0.8vw; color: ${mvConsts.colors.text.primary}; ${mvConsts.mobile_media_query(`width: 30vw; font-size: 4vw;`)}`} >
                                        {moment(item.timestamp).tz(`Europe/Moscow`).format(`DD.MM.YY`)}
                                    </Container>
                                </Container>
                                <Container extraProps={`font-size: 1.5vw; color: ${mvConsts.colors.text.primary}; ${mvConsts.mobile_media_query(`font-size: 6vw;`)}`} >
                                    {moment(item.timestamp).tz(`Europe/Moscow`).format(`HH:mm`)}
                                </Container>
                                <Container extraProps={`width: 2vw; height: 2vw; border-radius: 2vw; background: ${mvConsts.colors.accept}; margin-left: 1vw; color: white; ${mvConsts.mobile_media_query(`width: 10vw; height: 10vw; border-radius: 10vw; margin-left: 5vw; font-size: 3vw;`)}`} >
                                    {this.props.machines.map(i => i.objectId).indexOf(item.machineId) + 1}
                                </Container>
                                <Container extraProps={` margin-left: 0.5vw; height: 2vw; cursor: pointer; `} >
                                    <Arrow
                                        src={arrow}
                                        alt={``}
                                        onClick={() => { this.props.openLaundryBookDetails(item) }}
                                    />
                                </Container>
                            </Slot>
                        )
                    })
                }
            </Container>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        popUpWindow: state.ui.popUpWindow,
        laundry: state.laundry.laundry.filter(i => i.userId === Parse.User.current().id && +moment(i.timestamp) > +moment(state.constants.server_time).add(-2, `hour`).startOf(`hour`)).sort((a, b) => a.timestamp - b.timestamp),
        machines: state.machines.machines,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setPopUpWindow: (data) => {
            return dispatch(uiActions.setPopUpWindow(data))
        },
        openLaundryBookDetails: (data) => {
            return dispatch(laundryActions.openLaundryBookDetails(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reservations)

const Slot = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
height: 3vw
transition: 0.2s
${mvConsts.mobile_media_query(`
    height: 12vw;
`)}
`

const Arrow = styled.img`
width: 1.2vw;
margin-left: 0.5vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 6vw;
    margin-left: 2.5vw;
}`

/*eslint-enable no-unused-vars*/