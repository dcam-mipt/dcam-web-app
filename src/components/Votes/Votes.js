/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp } from '../UIKit/styled-templates'
import Input from '../UIKit/Input'
import Button from '../UIKit/Button'
import mvConsts from '../../constants/mvConsts';
import moment from 'moment'
import useComponentVisible from '../UIKit/useComponentVisible'
import { connect } from 'react-redux'
import axios from 'axios'
import CreateVotingPopUp from './CreateVotingPopUp';

{/* <Button onClick={() => { set_create_voting_visible(true) }}>
    Открыть
    <PopUp extra={`top: ${create_voting_visible ? 4 : 3}vw; left: 0vw;`} ref={create_voting_ref} visible={create_voting_visible} >
        <CreateVotingPopUp close={() => { close() }} />
    </PopUp>
</Button> */}

let array = [`Иванов`, `Петров`, `Сидоров`, `Белов`]

let EventTargets = (props) => {
    let { is_admin } = props
    let [create_voting_ref, create_voting_visible, set_create_voting_visible, close] = useComponentVisible(false);
    return (
        <Flex row extra={`@supports (-webkit-overflow-scrolling: touch) { height: 75vh; }`} >
            <Flex extra={`align-items: flex-start;`} >
                <Text>Расставьте претендентов в порядке приоритета</Text>
                {
                    array.map((item, index) => {
                        return (
                            <Flex key={index} row extra={`margin: 0.25vw; cursor: pointer; &:hover{transform: scale(1.05)}`} onClick={() => { }} >
                                <Flex extra={`width: 3vw; height: 3.5vw; border-radius: 0.5vw 0 0 0.5vw; background: ${mvConsts.colors.background.support};`} >
                                    <Text color={`white`} size={1} >{index + 1}</Text>
                                </Flex>
                                <Flex extra={`width: 9vw; height: 3.5vw; border-radius: 0 0.5vw 0.5vw 0; background: white; align-items: flex-start; padding-left: 1vw;`} >
                                    <Text size={1} >{item}</Text>
                                </Flex>
                            </Flex>
                        )
                    })
                }
            </Flex>
        </Flex>
    )
}

let mapStateToProps = (state) => {
    return {
        is_admin: state.user.is_admin,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        // setToken: (data) => {
        //     return dispatch(userActions.setToken(data))
        // }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EventTargets)

/*eslint-enable no-unused-vars*/