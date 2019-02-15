/*eslint-disable no-unused-vars*/
import mvConsts from '../../../constants/mvConsts'
import uiActions from '../../../redux/actions/UIActions'
import laundryActions from '../../../redux/actions/LaundryActions'
import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Container from '../../Container'
import cros from '../../../assets/images/cros.svg'
import moment from 'moment'
import Button from '../UI/Button'
import Parse from 'parse'

let unbookLaundry = (book) => {
    new Parse.Query(`Laundry`)
        .equalTo(`objectId`, book.laundryId)
        .first()
        .then((d) => {
            d.destroy()
                // .then((d) => { console.log(d) })
                .catch((d) => { console.log(d) })
        })
        .catch((d) => { console.log(d) })
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
        `
        return (
            <Container className={mvConsts.popUps.RESEVATIONS} extraProps={style} >
                {
                    this.props.laundry.map((item, index) => {
                        return (
                            <Slot key={index} >
                                <Container>
                                    <Container extraProps={`width: 5vw; align-items: flex-start; font-size: 0.8vw; color: ${mvConsts.colors.text.support}`} >
                                        {mvConsts.weekDays.full[moment(item.timestamp).tz(`Europe/Moscow`).day()]}
                                    </Container>
                                    <Container extraProps={`width: 5vw; align-items: flex-start; font-size: 0.8vw; color: ${mvConsts.colors.text.primary}`} >
                                        {moment(item.timestamp).tz(`Europe/Moscow`).format(`DD.MM.YY`)}
                                    </Container>
                                </Container>
                                <Container extraProps={`font-size: 1.5vw; color: ${mvConsts.colors.text.primary} `} >
                                    {moment(item.timestamp).tz(`Europe/Moscow`).format(`HH:mm`)}
                                </Container>
                                <Container extraProps={`width: 2vw; height: 2vw; border-radius: 2vw; background: ${mvConsts.colors.accept}; margin-left: 1vw; color: white;`} >
                                    {this.props.machines.map(i => i.machineId).indexOf(item.machineId) + 1}
                                </Container>
                                <Container extraProps={` border-left: 1px solid ${mvConsts.colors.background.support}; margin-left: 0.5vw; width: 1.5vw; height: 2vw; cursor: pointer; `} >
                                    <img src={cros} alt={``} style={{ width: (1.2) + `vw`, marginLeft: `0.5vw` }} onClick={() => { unbookLaundry(item) }} />
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
        laundry: state.laundry.laundry.filter(i => i.userId === Parse.User.current().id && +moment(i.timestamp) > +moment(state.constants.server_time).startOf(`hour`)).sort((a, b) => a.timestamp - b.timestamp),
        machines: state.machines.machines,
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

export default connect(mapStateToProps, mapDispatchToProps)(Reservations)

const Slot = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
height: 3vw
transition: 0.2s
`

/*eslint-enable no-unused-vars*/