/*eslint-disable no-unused-vars*/
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text } from '../UIKit/styled-templates'

let Switcher = (props) => {
    let { array, selected, onChange, width = 20 } = props
    return (
        <Wrapper
            {...props}
        >
            <Pointer
                left={width / array.length * selected + 1.2}
                width={selected >= 0 ? width / array.length : 0}
                reversed={props.reversed}
            />
            {
                array.map((item, index) => {
                    return (
                        <Variant
                            key={index}
                            onClick={() => { onChange(index); window.navigator.vibrate(20) }}
                            {...props}
                            width={width / array.length}
                            reversed={props.reversed}
                        >
                            <Text
                                bold={selected === index}
                            >
                                {item}
                            </Text>
                        </Variant>
                    )
                })
            }
        </Wrapper>
    )
}

export default Switcher;

const Variant = styled(Flex)`
width: ${props => props.width / 4}vw;
z-index: 2;
margin: 0.75vw;
border-left: 0.25vw solid ${props => props.index > 0 && Math.abs(props.selected - props.ndex) > 1 ? props.reversed ? `red` : `blue` : `transparent`};
border-right: 0.25vw solid ${props => props.index < props.array.length - 1 && Math.abs(props.selected - props.index) > 1 ? props.theme.background.support : `transparent`};
transition: 1s;
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.width}vw;
    margin: 3vw;
    border-left: 1vw solid ${props => props.index > 0 && Math.abs(props.selected - props.ndex) > 1 ? props.reversed ? `red` : `blue` : `transparent`};
    border-right: 1vw solid ${props => props.index < props.array.length - 1 && Math.abs(props.selected - props.index) > 1 ? props.theme.background.support : `transparent`};
}`

let Wrapper = styled(Flex)`
border-radius: 0.75vw;
margin: 1vw;
width: ${props => props.width / 4}vw;
position: relative;
flex-direction: row;
padding: 0.25vw;
background: ${props => props.reversed ? props.theme.background.secondary : props.theme.background.primary};
@media (min-width: 320px) and (max-width: 480px) {
    border-radius: 3vw;
    margin: 4vw;
    width: ${props => props.width}vw;
    padding: 1vw;
}
`

const Pointer = styled(Flex)`
width: ${props => props.width / 4}vw;
height: 80%;
top: 10%;
left: ${props => props.left / 4}vw;
border-radius: 0.5vw;
position: absolute;
background: ${props => props.reversed ? props.theme.background.primary : props.theme.background.secondary};
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.width}vw;
    left: ${props => props.left}vw;
    border-radius: 2vw;
}
`
/*eslint-enable no-unused-vars*/