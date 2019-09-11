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


let EventTargets = (props) => {
    let { is_admin } = props
    return (
        <Flex row extra={`@supports (-webkit-overflow-scrolling: touch) { height: 75vh; }`} >
            
        </Flex>
    )
}

let mapStateToProps = (state) => {
    return {
        // is_admin: state.user.is_admin,
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