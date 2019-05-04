/*eslint-disable no-unused-vars*/
import React from 'react'
import styled from 'styled-components'
import mvConsts from '../constants/mvConsts'

let Button = (props) => {
    return (
        <Wrapper
            {...props}
            visible={props.visible === undefined ? true : props.visible}
            short={props.short === undefined ? true : props.short}
            onClick={() => { if (!props.disabled) { props.onClick && props.onClick() } }}
        >
            {props.children ? props.children : `button`}
        </Wrapper>
    )
}

export default Button

const Wrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: ${props => props.short ? 6.25 : 15}vw;
height: ${props => +props.visible}vw;
padding: ${props => +props.visible}vw;
border-radius: 0.5vw;
background-color: ${props => props.shaped ? `transparent` : props.disabled ? mvConsts.colors.background.support : props.backgroundColor ? props.backgroundColor : mvConsts.colors.yellow};
margin: ${props => +props.visible / 4}vw;
color: ${props => props.shaped ? props.backgroundColor : `white`};
font-size: 0.8vw;
cursor: ${props => props.disabled ? null : `pointer`};
visibility: ${props => props.visible ? `visible` : `hidden`};
opacity: ${props => +props.visible};
transition: 0.2s;
transition-delay: ${props => props.visible ? -1 : 0.2}s;
border: ${props => +props.shaped * 0.1}vw solid ${props => props.backgroundColor}
outline-offset: 0.25vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.short ? 33 : 68}vw;
    height: ${props => +props.visible * 12}vw;
    padding: ${props => +props.visible * 0.4}vw;
    border-radius: 2vw;
    margin: ${props => +props.visible}vw;
    border: ${props => +props.shaped * 0.4}vw solid ${props => props.backgroundColor}
    outline-offset: 1vw;
font-size: 4vw;
}
`
/*eslint-enable no-unused-vars*/