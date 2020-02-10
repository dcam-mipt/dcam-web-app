/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp } from '../UIKit/styled-templates'
import mvConsts from '../../constants/mvConsts';
import useComponentVisible from '../UIKit/useComponentVisible'

let Selector = (props) => {
    let { array } = props
    if (array === undefined) { array = [] }
    let [ref, visible, set_visible] = useComponentVisible(false);
    return (
        <Flex>
            <Box width={props.width} id={`select_day`} onClick={() => { set_visible(true) }} >
                <Text text_color={props => props.selected !== undefined ? props.theme.text.primary : props.theme.text.support} >{props.selected !== undefined ? array[props.selected] : props.placeholder ? props.placeholder : `пусто`}</Text>
                <PopUp extra={`${props.bottom ? `bottom` : `top`}: ${visible ? 3.5 : 2}vw; ${props.left ? `left: 0;` : props.right ? `right: 0;` : null}`} ref={ref} visible={visible} >
                    <Flex extra={`display: block; overflow-y: scroll; max-height: 15vw; @media (min-width: 320px) and (max-width: 480px) {max-height: 100vh;};`} >
                        {
                            array.length ?
                                array.map((item, index) => {
                                    return (
                                        <Item key={index} {...props} bold={props.selected !== undefined && props.selected === index} onClick={() => { setTimeout(() => { set_visible(false) }, 0); props.onChange && props.onChange(index) }}>{item}</Item>
                                    )
                                })
                                : <Item>пусто</Item>
                        }
                    </Flex>
                </PopUp>
            </Box>
        </Flex>
    )
}

export default Selector;

const Item = styled(Text)`
min-width: ${props => props.width !== undefined ? props.width : 3}vw;
align-items: flex-start;
padding: 1vw;
border-radius: 0.5vw;
&:hover { background: rgba(0, 0, 0, 0.05); }
@media (min-width: 320px) and (max-width: 480px) {
    min-width: ${props => (props.width !== undefined ? props.width : 3) * 4}vw;
    padding: 4vw;
    border-radius: 2vw;
    font-size: 4vw;
}`

const Box = styled(Flex)`
padding: 1vw;
width: ${props => props.width}vw;
border-radius: 0.5vw;
background: ${props => props.theme.backgroundColor ? props.theme.backgroundColor : props.theme.background.secondary};
margin: 0.25vw;
color: ${props => props.color ? props.color : props.theme.text.primary};
cursor: pointer;
position: relative;
@media (min-width: 320px) and (max-width: 480px) {
    padding: 4vw;
    width: ${props => 4 * props.width}vw;
    border-radius: 2vw;
    margin: 1vw;
}`
/*eslint-enable no-unused-vars*/