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
import Form from './UIKit/Form'

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
            <Form array={[{ type: `title`, text: `Баланс` }]} />
            <Bar>
                <Card>
                    <Text color={`white`} >Стиралка</Text>
                    <Flex row >
                        <Text bold color={`white`} size={1.2} >{balance}</Text>
                        <Text color={`white`} >р</Text>
                    </Flex>
                    <Flex row >
                        <Input
                            backgroundColor={`rgba(255, 255, 255, 0.5)`}
                            color={`white`}
                            placeholder={`Введите сумму`}
                            short
                            number
                            pattern={`[0-9]*`}
                            onChange={(d) => { (!isNaN(d.target.value) && d.target.value.length < 5) && setValue(Math.round(d.target.value * 100) / 100) }}
                            value={value}
                            extra={`::-webkit-input-placeholder {
                                font-size: 0.8vw;
                                @media (min-width: 320px) and (max-width: 480px) {
                                    font-size: 3vw;
                                };
                            }`}
                        />
                        {
                            user && <form method="POST" action="https://money.yandex.ru/quickpay/confirm.xml">
                                <input type="hidden" name="receiver" value={wallets.beldii} />
                                <input type="hidden" name="label" value={`${user.objectId} ${Math.random().toString(36).split(`.`)[1].substr(0, 10)}`} />
                                <input type="hidden" name="quickpay-form" value="donate" />
                                <input type="hidden" name="targets" value={`dcam.laundry`} />
                                <input type="hidden" name="sum" value={+value} datatype="number" />
                                <input type="hidden" name="paymentType" value="AC" />
                                <input style={{ display: `flex` }} id={`yandex`} className={`money_button yandex ${value < 2 ? `un` : ``}active`} type={value < 2 ? `button` : `submit`} value={``} />
                            </form>
                        }
                        {/* <input className={`money_button qiwi unactive`} type={value < 2 ? `button` : `submit`} value={``} /> */}
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
background-color: ${props => props.theme.purple};
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