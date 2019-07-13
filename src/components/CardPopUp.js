/*eslint-disable no-unused-vars*/
import React, { useState } from 'react'
import { Flex, Image, Text, Bar, BarWrapper } from './UIKit/styled-templates'
import moment from 'moment'
import Button from './UIKit/Button'
import axios from 'axios'
import mvConsts from '../constants/mvConsts'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Input from './UIKit/Input'

let wallets = {
    beldii: 410018436058863,
    kubrakov: 410019854138095,
}

let images = {
    yandex: `https://avatars.mds.yandex.net/get-pdb/1889030/f9ce64ef-f0cb-41d9-b651-7be193dc4a62/orig`,
    qiwi: `https://corp.qiwi.com/dam/jcr:fbce4856-723e-44a2-a54f-e7b164785f01/qiwi_sign_rgb.png`,
}

let main = (props) => {
    let [value, setValue] = useState(``)
    let [order_id, setOrderId] = useState(0)
    let { user, balance } = props
    return (
        <BarWrapper>
            <Bar row >
                <Image src={require(`../assets/images/card.svg`)} width={2} />
                <Text size={1.5} >Баланс</Text>
            </Bar>
            <Bar>
                <Card>
                    <Text color={`white`} >Стиралка 7ки</Text>
                    <Flex row >
                        <Text bold color={`white`} size={1.2} >{balance}</Text>
                        <Text color={`white`} >р</Text>
                    </Flex>
                    <Flex row >
                        <Input
                            backgroundColor={`rgba(255, 255, 255, 0.5)`}
                            color={`white`}
                            placeholder={`Сумма`}
                            short
                            number
                            pattern={`[0-9]*`}
                            onChange={(d) => { (!isNaN(d.target.value) && d.target.value.length < 5) && setValue(Math.round(d.target.value * 100) / 100) }}
                            value={value}
                        />
                        <form method="POST" action="https://money.yandex.ru/quickpay/confirm.xml">
                            <input type="hidden" name="receiver" value={wallets.beldii} />
                            <input type="hidden" name="label" value={order_id} />
                            <input type="hidden" name="quickpay-form" value="donate" />
                            <input type="hidden" name="targets" value={`Идентификатор транзакции: ${order_id}`} />
                            <input type="hidden" name="sum" value={+value} data-type="number" />
                            <input type="hidden" name="paymentType" value="AC" />
                            <input className={`money_button yandex ${value < 2 ? `un` : ``}active`} type={value < 2 ? `button` : `submit`} value={``} onClick={async () => {
                                if (value >= 2) {
                                    let order_id = Math.random().toString().split(`.`)[1].substring(0, 10)
                                    setOrderId(order_id)
                                    try {
                                        await axios.get(`http://dcam.pro/api/transactions/start_yandex/${+value}/${order_id}`)
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }
                            }} />
                        </form>
                        <input className={`money_button qiwi unactive`} type={value < 2 ? `button` : `submit`} value={``} />
                    </Flex>
                </Card>
            </Bar>
        </BarWrapper>
    )
}

let mapStateToProps = (state) => {
    return {
        balance: state.user.balance,
        user: state.user.user,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(main)

let card_width = 86 * 0.23
const Card = styled(Flex)`
width: ${card_width}vw;
height: ${card_width / 86 * 54}vw;
border-radius: ${card_width / 20}vw;
background-color: ${mvConsts.colors.purple};
justify-content: space-around;
align-items: flex-start;
> * {
    margin-left: 1vw;
}
@media (min-width: 320px) and (max-width: 480px) {
    width: ${4.2 * card_width}vw;
    height: ${4.2 * card_width / 86 * 54}vw;
    border-radius: ${4.2 * card_width / 20}vw;
    > * {
        margin-left: 5vw;
    }
}`

/*eslint-enable no-unused-vars*/