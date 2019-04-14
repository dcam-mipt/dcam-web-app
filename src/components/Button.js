/*eslint-disable no-unused-vars*/
import React from 'react'
import styled from 'styled-components'
import mvConsts from '../constants/mvConsts'

let Button = (props) => {
    return (
        <Wrapper
            {...props}
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
width: 8vw;
height: 3vw;
border-radius: 0.5vw;
background-color: ${props => props.disabled ? `grey` : props.backgroundColor ? props.backgroundColor : mvConsts.colors.yellow};
cursor: ${props => props.disabled ? `default` : `pointer`};
font-size: 0.8vw;
color: white;
margin: 0.125vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 40vw;
    height: 15vw;
    border-radius: 2.5vw;
    font-size: 4vw;
}`
/*eslint-enable no-unused-vars*/