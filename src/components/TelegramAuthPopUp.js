/*eslint-disable no-unused-vars*/
import React, { useState } from 'react'
import { Flex, Image, Text, Bar, BarWrapper } from './styled-templates'
import moment from 'moment'
import axios from 'axios'
import mvConsts from '../constants/mvConsts'
import styled from 'styled-components'
import { connect } from 'react-redux'

let main = (props) => {
    return (
        <Wrapper>
            
        </Wrapper>
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

const Wrapper = styled(Flex)`
width: 30vw;
height: 30vw;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

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