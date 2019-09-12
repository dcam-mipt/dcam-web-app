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


let EventTargets = (props) => {
    let { is_admin } = props
    let [create_voting_ref, create_voting_visible, set_create_voting_visible] = useComponentVisible(false);
    return (
        <Flex row extra={`@supports (-webkit-overflow-scrolling: touch) { height: 75vh; }`} >
            <Flex extra={`width: 20vw; height: 90vh; justify-content: flex-start;`} >
                {
                    is_admin && <Button backgroundColor={mvConsts.colors.accept} short={false} onClick={() => { set_create_voting_visible(true) }} >
                        Создать
                        <PopUp extra={`top: ${create_voting_visible ? 4 : 3}vw; left: 0vw;`} ref={create_voting_ref} visible={create_voting_visible} >
                            <CreateVotingPopUp />
                        </PopUp>
                    </Button>
                }
                <Flex extra={`padding: 1vw; border-radius: 1vw; background: ${mvConsts.colors.background.primary}; margin: 0.5vw;`} >
                    <Text bold size={1.2} extra={`margin: 0.5vw;`} >
                        Текущие голосования
                    </Text>
                </Flex>
                <Flex extra={`padding: 1vw; border-radius: 1vw; background: ${mvConsts.colors.background.primary}; margin: 0.5vw;`} >
                    <Text bold size={1.2} extra={`margin: 0.5vw;`} >
                        Грядщие голосования
                    </Text>
                </Flex>
            </Flex>
            <Flex extra={`width: 70vw;`} >

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