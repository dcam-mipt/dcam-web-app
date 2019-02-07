/*eslint-disable no-unused-vars*/
import Button from '../UI/Button'
import Container from '../../Container'
import Parse from 'parse'
import React from 'react';
import VK from '../../../API/VKAPI'
import cross from '../../../assets/images/cros.svg'
import laundryActions from '../../../redux/actions/LaundryActions'
import machinesActions from '../../../redux/actions/MachinesActions'
import moment from 'moment'
import mvConsts from '../../../constants/mvConsts'
import styled, { keyframes } from 'styled-components';
import uiActions from '../../../redux/actions/UIActions'
import { connect } from 'react-redux';

class LaundryOptions extends React.Component {
    state = {
        vk: Parse.User.current().get(`vk`),
    }
    componentDidMount() {
        if (Parse.User.current().get(`vk`)) {
            VK.getUser(Parse.User.current().get(`vk`).split(`/`).pop(), (d) => {
                this.setState({ vk: d[0] })
            })
        }
    }
    render = () => {
        let visible = this.props.popUpWindow === mvConsts.popUps.LAUNDRY_OPTIONS
        let style = `
            border-radius: 1vw;
            padding: 1vw 1vw 1vw 1vw
            background-color: ${mvConsts.colors.background.primary};
            flex-direction: column
            position: absolute;
            top: ${visible ? 19 : 21}vh;
            right: 48vw;
            box-shadow: 0 0 2vw rgba(0, 0, 0, 0.2);
            z-index: 2;
            opacity: ${visible ? 1 : 0};
            visibility: ${visible ? `visible` : `hidden`};
            transition: 0.2s;
        `
        return (
            <Container className={mvConsts.popUps.LAUNDRY_OPTIONS} extraProps={style} >
                {this.state.vk ? vk_settings(this, visible) : get_vk(this, visible)}
            </Container>
        )
    }
}

let vk_settings = (component, visible) => {
    return (
        <Container extraProps={`flex-direction: row`} >
            <img src={component.state.vk.photo_200} style={{ width: `3vw`, borderRadius: `3vw` }} alt={``} />
            <Container extraProps={`margin: 0 1vw 0 1vw; color: ${mvConsts.colors.text.primary}`} >
                {component.state.vk.first_name} {component.state.vk.last_name}
            </Container>
            <Button visible={visible} backgroundColor={mvConsts.colors.vk} onClick={() => {
                new Parse.Query(`User`).equalTo(`objectId`, Parse.User.current().id).first()
                    .then((user) => {
                        user.set(`vk`, null)
                        user.save()
                            .then((d) => { component.setState({ vk: undefined }) })
                            .catch((d) => { console.log(d) })
                    })
                    .catch((d) => { console.log(d) })
            }} >
                Отвязать ВК
            </Button>
        </Container>
    )
}

let get_vk = (component, visible) => {
    return (
        <Container>
            <Container extraProps={`color: ${mvConsts.colors.text.primary}; width: 13vw; font-size: 0.8vw; text-align: left; margin: 1vw;`} >
                Привжите Ваш профиль ВКонтакте, и Вам станут доступны настройки уведомлений. Вы в любой момент можете удалить эту привязку.
            </Container>
            <Button visible={visible} backgroundColor={mvConsts.colors.vk} onClick={() => {
                VK.login((d) => {
                    new Parse.Query(`User`).equalTo(`objectId`, Parse.User.current().id).first()
                        .then((user) => {
                            user.set(`vk`, d.session.user.href)
                            user.save()
                                .then((d) => { VK.getUser(d.get(`vk`).split(`/`).pop(), (d) => { component.setState({ vk: d[0] }) }) })
                                .catch((d) => { console.log(d) })
                        })
                        .catch((d) => { console.log(d) })
                })
            }} >
                ВКонтакте
            </Button>
        </Container>
    )
}

let mapStateToProps = (state) => {
    return {
        popUpWindow: state.ui.popUpWindow,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setPopUpWindow: (data) => {
            return dispatch(uiActions.setPopUpWindow(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaundryOptions)
/*eslint-enable no-unused-vars*/