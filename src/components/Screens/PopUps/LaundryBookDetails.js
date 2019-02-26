/*eslint-disable no-unused-vars*/
import mvConsts from '../../../constants/mvConsts'
import uiActions from '../../../redux/actions/UIActions'
import laundryActions from '../../../redux/actions/LaundryActions'
import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Container from '../../Container'
import cros from '../../../assets/images/cros.svg'
import vk_logo from '../../../assets/images/vk_logo.svg'
import moment from 'moment'
import Button from '../UI/Button'
import Parse from 'parse'
import VK from '../../../API/VKAPI'
import axios from 'axios';

class LaundryBookDetails extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.book_details) {
            console.log(nextProps.book_details)
            // axios.get(`http://dcam.pro/api/club/create_book/`, {user_id: nextProps.book_details.user_id})
        }
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
        return (
            <Container className={mvConsts.popUps.LAUNDRY_BOOK_DETAILS} extraProps={style} >
                {
                    this.props.book_details
                        ? <Container>
                            <Container extraProps={`flex-direction: row`} >
                                <Container extraProps={`width: 4vw; height: 4vw; background-color: ${mvConsts.colors.background.support}; border-radius: 3vw;`} >
                                    {

                                    }
                                </Container>
                                <Container extraProps={`width: 9.5vw; align-items: flex-start; margin-left: 1vw; font-size: 1vw; `} >
                                    {this.props.book_details.name}
                                </Container>
                                <Container extraProps={`width: 2.5vw; height: 2.5vw; border-radius: 0.5vw; background-color: ${mvConsts.colors.vk}; cursor: pointer;`} >
                                    <img
                                        src={vk_logo}
                                        style={{ width: `1vw` }}
                                        alt={``}
                                    />
                                </Container>
                            </Container>
                            <Button short={false} onClick={() => { this.props.setPopUpWindow(mvConsts.popUps.EMPTY) }} >
                                Закрыть
                            </Button>
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

/*eslint-enable no-unused-vars*/