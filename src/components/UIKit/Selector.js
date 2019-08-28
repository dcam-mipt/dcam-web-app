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
                <Text color={props.selected !== undefined ? mvConsts.colors.text.primary : mvConsts.colors.text.support} >{props.selected !== undefined ? array[props.selected] : props.placeholder ? props.placeholder : `пусто`}</Text>
                <PopUp extra={`top: ${visible ? 3.5 : 2}vw;`} ref={ref} visible={visible} >
                    <Flex extra={`display: block; overflow-y: scroll; max-height: 15vw;`} >
                        {
                            array.length ?
                                array.map((item, index) => {
                                    return (
                                        <Text key={index} bold={props.selected !== undefined && props.selected === index} onClick={() => { setTimeout(() => { set_visible(false) }, 0); props.onChange && props.onChange(index) }} extra={`min-width: ${props.width !== undefined ? props.width : 3}vw; align-items: flex-start; padding: 1vw; border-radius: 0.5vw; &:hover { background: rgba(0, 0, 0, 0.05); }`} >{item}</Text>
                                    )
                                })
                                : <Text>пусто</Text>
                        }
                    </Flex>
                </PopUp>
            </Box>
        </Flex>
    )
}

export default Selector;

const Box = styled(Flex)`
padding: 1vw;
width: ${props => props.width}vw;
border-radius: 0.5vw;
background-color: ${props => props.backgroundColor ? props.backgroundColor : mvConsts.colors.background.secondary};
margin: 0.25vw;
color: ${props => props.color ? props.color : mvConsts.colors.text.primary};
cursor: pointer;
position: relative;
@media (min-width: 320px) and (max-width: 480px) {

}`
/*eslint-enable no-unused-vars*/