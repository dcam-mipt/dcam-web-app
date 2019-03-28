/*eslint-disable no-unused-vars*/
import mvConsts from '../../../constants/mvConsts'
import actions from '../../../redux/actions/UIActions'
import GoogleAPI from '../../../API/GoogleAPI'
import Parse from 'parse'
import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Container from '../../Container'
import Button from '../UI/Button'
import Input from '../UI/Input'
import validator from 'validator'
import axios from 'axios'
import VK from '../../../API/VKAPI'
import vk_logo from '../../../assets/images/vk_logo.svg'
import cros from '../../../assets/images/cros.svg'

let m = mvConsts.mobile_media_query

class TopProfileMenu extends React.Component {
    static defaultProps = {
        visible: false,
    }
    state = {
        value: ``,
        order_id: ``,
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
        return (
            <Wrapper visible={this.props.visible} className={mvConsts.popUps.TOP_PROFILE_MENU} >
                <Container extraProps={`padding: 0.5vw; border-radius: 1vw; background-color: ${mvConsts.colors.background.primary}; ${m(`padding: 2.5vw; border-radius: 5vw;`)}`} >
                    <Container extraProps={`font-family: Lato-Bold; color: ${mvConsts.colors.text.primary}; width: 100%; padding: 0.5vw; font-size: 1.2vw; margin: 0 0 0.5vw 0.5vw; align-items: flex-start; ${m(`font-size: 6vw; margin: 2.5vw 0 2.5vw 5vw;`)}`} >
                        Профиль
                    </Container>
                    <Container extraProps={`flex-direction: row; justify-content: space-between; width: 96%;`} >
                        <Container extraProps={`flex-direction: row;`} >
                            <Container extraProps={`width: 3vw; height: 3vw; border-radius: 3vw; background-color: ${mvConsts.colors.background.support}; color: white; font-size: 0.8vw; margin-right: 0.5vw; ${m(`width: 15vw; height: 15vw; border-radius: 15vw; font-size: 4vw; margin-right: 2.5vw;`)}; `} >
                                <Image
                                    src={Parse.User.current().get(`avatar`)}
                                    width={3}
                                    extraProps={`border-radius: 15vw; `}
                                />
                            </Container>
                            <Container extraProps={`width: 9vw; color: ${mvConsts.colors.text.primary}; margin-left: 0.5vw; align-items: flex-start; ${m(`width: 45vw; margin-left: 2.5vw; font-size: 5vw;`)}`} >
                                {Parse.User.current().get(`username`).split(`@`)[0]}
                            </Container>
                        </Container>
                        <Container extraProps={` width: 3vw; height: 3vw; border-radius: 3vw; background-color: ${this.props.money > 0 ? mvConsts.colors.accept : mvConsts.colors.background.support}; color: white; font-size: 0.8vw; margin-right: 0.5vw; ${m(`width: 15vw; height: 15vw; border-radius: 15vw; font-size: 4vw; margin-right: 2.5vw;`)}; `} >
                            {this.props.money} ₽
                        </Container>
                    </Container>
                    <Container extraProps={`width: 100%; align-items: flex-start; margin-top: 1vw;`} >
                        <Button short={true} shaped={true} backgroundColor={mvConsts.colors.WARM_ORANGE} onClick={() => {
                            GoogleAPI.signOut()
                            this.props.setPopUpWindow(mvConsts.popUps.EMPTY)
                        }} >
                            Выйти
                        </Button>
                    </Container>
                    <Container extraProps={`font-family: Lato-Bold; color: ${mvConsts.colors.text.primary}; width: 100%; padding: 0.5vw; font-size: 1.2vw; margin: 0 0 0.5vw 0.5vw; align-items: flex-start; ${mvConsts.mobile_media_query(`font-size: 6vw; margin: 2.5vw 0 2.5vw 5vw;`)}`} >
                        Пополнение счета
                    </Container>
                    <Container extraProps={`flex-direction: row; width: 100%; justify-content: flex-start;`} >
                        <Input
                            placeholder={`Сумма`}
                            short={true}
                            onChange={(d) => { this.setState({ value: d }) }}
                            value={this.state.value}
                            validator={(d) => validator.isInt(d)}
                            number={true}
                        />
                        <form method="POST" action="https://money.yandex.ru/quickpay/confirm.xml">
                            <input type="hidden" name="receiver" value="410018436058863" />
                            <input type="hidden" name="label" value={this.state.order_id} />
                            <input type="hidden" name="quickpay-form" value="donate" />
                            <input type="hidden" name="targets" value={`Идентификатор транзакции: ${this.state.order_id}`} />
                            <input type="hidden" name="sum" value={+this.state.value} data-type="number" />
                            <input type="hidden" name="paymentType" value="AC" />
                            <input id={"yandex_money_button"} type="submit" value={`Далее`} style={{ display: `none` }} />
                            <Button
                                visible={this.props.visible}
                                disabled={this.state.value < 2}
                                backgroundColor={mvConsts.colors.accept}
                                onClick={() => {
                                    axios.get(`http://dcam.pro/api/transactions/start_yandex/${+this.state.value}`)
                                        .then((d) => {
                                            this.setState({ order_id: d.data })
                                            document.getElementById(`yandex_money_button`).click()
                                        })
                                }}
                            >
                                Далее
                            </Button>
                        </form>
                    </Container>
                </Container>
            </Wrapper>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        visible: state.ui.popUpWindow === mvConsts.popUps.TOP_PROFILE_MENU,
        money: state.constants.money,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setEntryScreen: (screenName) => {
            return dispatch(actions.setEntryScreen(screenName))
        },
        setPopUpWindow: (screenName) => {
            return dispatch(actions.setPopUpWindow(screenName))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopProfileMenu)

const Wrapper = styled.div`
border-radius: 1vw;
flex-direction: column
position: absolute;
top: ${props => props.visible ? 10 : 12}vh;
right: 1.5vw;
z-index: 2;
opacity: ${props => props.visible ? 1 : 0};
visibility: ${props => props.visible ? `visible` : `hidden`};
transition: 0.2s;
${mvConsts.mobile_media_query(`
    border-radius: 4vw;
    top: 10vh;
    right: 2vw;
    width: 92vw;
    padding: 2vw 2vw 2vw 2vw;
    transition: 0s;
`)}`

const Image = styled.img`
width: ${props => props.width}vw;
${props => props.extraProps}
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.width * 5}vw;
}`

/*eslint-enable no-unused-vars*/