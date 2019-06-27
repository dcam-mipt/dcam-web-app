/*eslint-disable no-unused-vars*/
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Image } from '../UIKit/styled-templates'
import moment from 'moment'
import mvConsts from '../../constants/mvConsts';

let main = (props) => {
    let { transactions } = props
    return <Flex>
        {
            transactions.sort((a, b) => +moment(b.updatedAt) - +moment(a.updatedAt)).map((transaction, transaction_index) => {
                return <TransactionWrapper key={transaction_index} >
                    <DateWrapper>
                        <Text color={mvConsts.colors.text.support} >{moment(transaction.updatedAt).format(`DD.MM.YYYY HH:mm`)}</Text>
                    </DateWrapper>
                    <Flex row>
                        <Image src={require(`../../assets/images/${transaction.status === `done` ? `done` : `clock`}.svg`)} width={2} />
                        <TextWrapper width={7} ><Text size={1} >{transaction.from_username.split(`@`)[0].split(`.`)[0]}</Text></TextWrapper>
                        <Image src={require(`../../assets/images/arrow.svg`)} width={2} />
                        <TextWrapper width={7} ><Text size={1} >{transaction.to_username.split(`@`)[0].split(`.`)[0]}</Text></TextWrapper>
                        <TextWrapper width={3} ><Text size={1} color={transaction.requested >= 0 ? mvConsts.colors.accept : mvConsts.colors.WARM_ORANGE} >{transaction.requested >= 0 && `+`}{transaction.requested}</Text></TextWrapper>
                    </Flex>
                </TransactionWrapper>
            })
        }
    </Flex>
}

export default main

const TextWrapper = styled(Flex)`
width: ${props => props.width}vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.width * 4}vw;
}`

const DateWrapper = styled(Flex)`
width: 100%;
align-items: flex-start;
padding: 0.5vw 0 0.5vw 1vw;
@media (min-width: 320px) and (max-width: 480px) {
    padding: 2vw 0 2vw 5vw;
}`

const TransactionWrapper = styled(Flex)`
padding: 0.5vw;
border-radius: 0.5vw;
margin-bottom: 0.5vw;
background-color: ${props => props.background.primary};
@media (min-width: 320px) and (max-width: 480px) {
    padding: 2.5vw;
    border-radius: 2.5vw;
    margin: 0.5vw;
}`
/*eslint-enable no-unused-vars*/