/*eslint-disable no-unused-vars*/
import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Image } from './styled-templates'
import moment from 'moment'
import mvConsts from '../constants/mvConsts';

let main = (props) => {
    let { transactions } = props
    return <Flex>
        {
            transactions.sort((a, b) => +moment(b.updatedAt) - +moment(a.updatedAt)).map((transaction, transaction_index) => {
                return <TransactionWrapper key={transaction_index} >
                    <Flex extra={`width: 100%; align-items: flex-start; padding: 0.5vw 0 0.5vw 1vw;`} >
                        <Text color={mvConsts.colors.text.support} >{moment(transaction.updatedAt).format(`DD.MM.YYYY HH:mm`)}</Text>
                    </Flex>
                    <Flex row>
                        <Image src={require(`../assets/images/${transaction.status === `done` ? `done` : `clock`}.svg`)} width={2} />
                        <Text size={1} extra={`width: 7vw;`} >{transaction.from_username}</Text>
                        <Image src={require(`../assets/images/arrow.svg`)} width={2} />
                        <Text size={1} extra={`width: 7vw;`} >{transaction.to_username}</Text>
                        <Text extra={`width: 3vw;`} >{transaction.requested}</Text>
                    </Flex>
                </TransactionWrapper>
            })
        }
    </Flex>
}

export default main

const TransactionWrapper = styled(Flex)`
padding: 0.5vw;
border-radius: 0.5vw;
margin: 0.25vw;
background-color: ${props => props.background.primary};
@media (min-width: 320px) and (max-width: 480px) {
    
}`
/*eslint-enable no-unused-vars*/