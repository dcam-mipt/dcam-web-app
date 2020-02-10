/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import { Flex, Image, Text, Bar, BarWrapper, PopUp } from './UIKit/styled-templates'
import Switcher from './UIKit/Switcher'
import moment from 'moment-timezone'
import styled from 'styled-components'
import { connect } from 'react-redux'
import dormitoryActions from '../redux/actions/DormitoryActions'

let get_user_status = (timestamp) => {
    if (+moment().tz(`Europe/Moscow`) - +timestamp < 5 * 6000) {
        return `онлайн`
    }
    if (+moment().tz(`Europe/Moscow`) - +timestamp < 24 * 3600000) {
        return `сегодня в ${moment(+timestamp).format(`HH:mm`)}`
    }
    return `оффлайн с ${moment(+timestamp).format(`DD.MM.YY`)}`
}


let main = (props) => {
    let { dormitories, selected_dormitory, set_selected_dormitory } = props
    return <BarWrapper>
        <Bar row >
            <Text size={1.5} bold >Общежитие</Text>
        </Bar>
        <ErrorText error={selected_dormitory === null} >Выберите общежитие</ErrorText>
        <Switcher
            width={80}
            reversed={true}
            array={dormitories.map(i => i.number)}
            onChange={(index) => { set_selected_dormitory(dormitories[index].objectId) }}
            selected={dormitories.map(i => i.objectId).indexOf(selected_dormitory)}
        />
    </BarWrapper >
}

let mapStateToProps = (state) => {
    return {
        dormitories: state.dormitories.dormitories || [],
        selected_dormitory: state.dormitories.selected_dormitory,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        set_selected_dormitory: (data) => {
            return dispatch(dormitoryActions.setSelectedDormitory(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(main)

const ErrorText = styled(Text).attrs(props => ({
    bold: true,
    text_color: props.theme.WARM_ORANGE
}))`
font-size: ${props => props.error ? 0.8 : 0.0001}vw;
`

/*eslint-enable no-unused-vars*/