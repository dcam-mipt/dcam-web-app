/*eslint-disable no-unused-vars*/
import Container from '../../Container'
import Input from '../UI/Input'
import Button from '../UI/Button'
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

class TopBalanceWindow extends React.Component {
    state = {
        value: ``,
        order_id: ``,
    }
    render = () => {
        let visible = this.props.visible
        let style = `
            padding: 1vw;
            border-radius: 1vw;
            position: absolute;
            top: ${visible ? 10 : 12}vh;
            right: 17.5vw;
            z-index: ${visible ? 3 : -1};
            opacity: ${visible ? 1 : 0};
            visibility: ${visible ? `visible` : `hidden`};
            box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
            background-color: ${mvConsts.colors.background.primary};
            transition: opacity 0.2s, top 0.2s, visibility 0.2s;
            @media (min-width: 320px) and (max-width: 480px) {
                border-radius: 4vw;
                top: ${visible ? 10 : 14}vh;
                right: 2vw;
                padding: 2vw 2vw 2vw 2vw;
            }   
        `
        return (
            <Container className={mvConsts.popUps.TOP_BALANCE_WINDOW} extraProps={style} >
                <Container extraProps={`flex-direction: row; color: ${mvConsts.colors.text.primary}; @media (min-width: 320px) and (max-width: 480px) { font-size: 4vw; };`} >
                    Пополнить <span role="img" aria-label="martini">🍸</span>
                </Container>
                <Input
                    placeholder={`Сумма`}
                    short={true}
                    onChange={(d) => { this.setState({ value: d }) }}
                    value={this.state.value}
                    validator={(d) => validator.isInt(d)}
                />
                <form method="POST" action="https://money.yandex.ru/quickpay/confirm.xml">
                    <input type="hidden" name="receiver" value="410018436058863" />
                    <input type="hidden" name="label" value={this.state.order_id} />
                    <input type="hidden" name="quickpay-form" value="donate" />
                    <input type="hidden" name="targets" value={`Идентификатор транзакции: ${this.state.order_id}`} />
                    <input type="hidden" name="sum" value={+this.state.value} data-type="number" />
                    <input type="hidden" name="paymentType" value="AC" />
                    <input id={"yandex_money_button"} type="submit" value={`Далее`} style={{ display: `none` }} />
                    <Button visible={visible} disabled={this.state.value < 2} backgroundColor={mvConsts.colors.accept} onClick={() => {
                        // Parse.Cloud.run(`saveTransaction`, { value: +this.state.value })
                        axios.get(`http://dcam.pro/api/transactions/start_yandex/${+this.state.value}`)
                            .then((d) => {
                                this.setState({ order_id: d.data })
                                document.getElementById(`yandex_money_button`).click()
                            })
                    }}>
                        Далее
                    </Button>
                </form>
            </Container>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        visible: state.ui.popUpWindow === mvConsts.popUps.TOP_BALANCE_WINDOW,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setPopUpWindow: (data) => {
            return dispatch(uiActions.setPopUpWindow(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBalanceWindow)

/*eslint-enable no-unused-vars*/