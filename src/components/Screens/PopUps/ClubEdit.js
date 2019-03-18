/*eslint-disable no-unused-vars*/
import Container from '../../Container'
import Input from '../UI/Input'
import Button from '../UI/Button'
import Switch from '../UI/Switch'
import Parse from 'parse'
import React from 'react';
import axios from 'axios'
import cross from '../../../assets/images/cros.svg'
import moment from 'moment'
import mvConsts from '../../../constants/mvConsts'
import styled, { keyframes } from 'styled-components';
import uiActions from '../../../redux/actions/UIActions'
import validator from 'validator'
import yandexMoney from 'yandex-money-sdk'
import { connect } from 'react-redux';

class ClubEdit extends React.Component {
    render = () => {
        let visible = this.props.popUpWindow === mvConsts.popUps.CLUB_EDIT
        let style = `
            padding: 1vw;
            border-radius: 1vw;
            position: absolute;
            top: 1vh;
            right: ${visible ? 1 : -1}vw;
            z-index: ${visible ? 3 : -1};
            opacity: ${visible ? 1 : 0};
            visibility: ${visible ? `visible` : `hidden`};
            // box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
            background-color: ${mvConsts.colors.background.primary};
            display: block;
            max-height: 98vh;
            overflow-y: scroll;
            transition: 0.2s;
        `
        let { books } = this.props
        return (
            <Container className={mvConsts.popUps.CLUB_EDIT} extraProps={style} >
                {
                    books.sort((b, a) => b.start_timestamp - a.start_timestamp).map((i, index) => {
                        return (
                            <Book i={i} key={index} >
                                <Container>
                                    {moment(i.start_timestamp).format(`DD.MM.YY`)} {i.owner.split(` `)[2]}
                                </Container>
                                <Container extraProps={`flex-direction: row; font-size: 1.2vw;`} >
                                    {moment(i.start_timestamp).format(`HH:mm`)}
                                    <Container extraProps={`margin: 0.2vw; width: 1vw; height: 0.1vw; background-color: ${mvConsts.colors.text.primary}`} />
                                    {moment(i.end_timestamp).format(`HH:mm`)}
                                </Container>
                                <Container extraProps={`flex-direction: row; width: 15vw; justify-content: space-between;`} >
                                    Разрешить
                                    <Switch checked={i.is_allowed} onChange={() => {
                                        Parse.Cloud.run(`chengeClubEventResolution`, { event_id: i.event_id })
                                            .then((d) => { console.log(d) })
                                            .catch((d) => { mvConsts.error(d) })
                                    }} />
                                </Container>
                            </Book>
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
        books: state.club.books,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setPopUpWindow: (data) => {
            return dispatch(uiActions.setPopUpWindow(data))
        },
    }
}

const Book = styled.div`
display: flex
justify-content: center
align-items: flex-start
flex-direction: column
padding: 1vw
margin: 0.1vw;
border-radius: 0 0.5vw 0.5vw 0
border-left: 0.2vw solid ${props => props.i.is_allowed ? mvConsts.colors_.HAN_BLUE : `rgba(0, 0, 0, 0.2)`};
background-color: ${mvConsts.colors.background.secondary};
transition: 0.2s
`

export default connect(mapStateToProps, mapDispatchToProps)(ClubEdit)

/*eslint-enable no-unused-vars*/