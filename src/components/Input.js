/*eslint-disable no-unused-vars*/
import React from 'react'
import styled from 'styled-components'
import mvConsts from '../constants/mvConsts'

let Button = (props) => <Input visible={props.visible === undefined ? true : props.visible} {...props} />

export default Button

const Input = styled.input`
    outline: none;
    border: none;
    text-align: center;
    font-size: 0.8vw;
    text-align: ${props => props.textAlign ? props.textAlign : `left`};
    width: ${props => props.short ? 6.25 : 15}vw;
    height: ${props => +props.visible}vw;
    padding: ${props => +props.visible}vw;
    border-radius: 0.5vw;
    background-color: ${props => props.backgroundColor ? props.backgroundColor : mvConsts.colors.background.secondary};
    margin: ${props => +props.visible * 0.25}vw;
    color: ${props => props.color ? props.color : mvConsts.colors.text.primary};
    font-size: 1vw;
    visibility: ${props => props.visible ? `visible` : `hidden`};
    opacity: ${props => +props.visible};
    transition: visibility 0.2s, opaicty 0.2s, height 0.2s; 
    ::placeholder {
        color: ${mvConsts.colors.text.support};
    }
    @media (min-width: 320px) and (max-width: 480px) {
        width: ${props => props.short ? 27 : 68}vw;
        height: ${props => +props.visible * 5}vw;
        padding: ${props => +props.visible * 4}vw;
        border-radius: 2vw;
        margin: ${props => +props.visible}vw;
        font-size: 4vw;
    }
    &::-webkit-input-placeholder {
        ${props => props.placeholderColor === undefined ? null : `color: ${props => props.placeholderColor}`}
    }
    
    ${props => props.extraProps === undefined ? null : props.extraProps}
`
/*eslint-enable no-unused-vars*/