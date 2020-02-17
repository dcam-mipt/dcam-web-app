/*eslint-disable no-unused-vars*/
import React from 'react'
import styled from 'styled-components'
import mvConsts from '../../constants/mvConsts'
import InputMask from 'react-input-mask';

export default (props) => <Input visible={props.visible === undefined ? true : props.visible} {...props} />
// export default (props) => <InputMask {...props} >
//     {(inputProps) => <Input visible={props.visible === undefined ? true : props.visible} {...inputProps} />}
// </InputMask>

const Input = styled.input`
    display: ${props => props.only_mobile ? `none` : `inline`}
    -webkit-appearance: none;
    outline: none;
    border: none;
    text-align: center;
    font-size: 0.8vw;
    text-align: ${props => props.textAlign ? props.textAlign : `left`};
    width: ${props => props.float ? null :  props.short ? 6.25 : 15}vw;
    height: ${props => +props.visible}vw;
    padding: ${props => +props.visible}vw;
    border-radius: 0.5vw;
    background: ${props => props.background ? props.background : props.reversed ? props.theme.background.primary : props.theme.background.secondary};
    margin: ${props => +props.visible * 0.25}vw;
    color: ${props => props.text_color ? props.text_color : props.theme.text.primary};
    font-size: 1vw;
    opacity: ${props => +props.visible};
    transition: visibility 0.2s, opaicty 0.2s, height 0.2s; 
    ::placeholder {
        color: ${props => props.text_color ? props.text_color : props.theme.text.support};
    }
    @media (min-width: 320px) and (max-width: 480px) {
        display: ${props => props.only_mobile ? `inline` : `none`}
        width: ${props => props.float ? null :  props.short ? 27 : 68}vw;
        height: ${props => +props.visible * 5}vw;
        padding: ${props => +props.visible * 4}vw;
        border-radius: 2vw;
        margin: ${props => +props.visible}vw;
        font-size: 4vw;
    }
    &::-webkit-input-placeholder {
        ${props => props.placeholderColor === undefined ? null : `color: ${props => props.placeholderColor}`}
    }
    
    ${props => props.extra === undefined ? null : props.extra}
`
/*eslint-enable no-unused-vars*/