/*eslint-disable no-unused-vars*/
import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image } from '../UIKit/styled-templates'
import mvConsts from '../../constants/mvConsts';

let top_buttons = [
    {
        image: require(`../../assets/images/club.svg`),
        title: `клуб`,
    },
    {
        image: require(`../../assets/images/meetings_room.svg`),
        title: `кдс`,
    },
]

let main = () => {
    let [calendar, set_calendar] = useState(false)
    let [mode, set_mode] = useState(0)
    return (
        <Flex row >
            <Flex>
                <Top row >
                    <Flex row extra={`margin-left: 1vw;`} >
                        {
                            top_buttons.map((item, index) => {
                                return (
                                    <TopButton key={index} onClick={() => { set_mode(index) }} >
                                        <TopButtonImageWrapper>
                                            <Image src={item.image} width={2} />
                                        </TopButtonImageWrapper>
                                        <SpaceTitle selected={mode === index} >
                                            {item.title}
                                        </SpaceTitle>
                                    </TopButton>
                                )
                            })
                        }
                    </Flex>
                    <Flex only_mobile onClick={() => { set_calendar(!calendar) }} >
                        <Image src={require(`../../assets/images/calendar.svg`)} width={2} />
                    </Flex>
                </Top>
                <Center>

                </Center>
            </Flex>
            <Right visible={calendar} >

            </Right>
        </Flex>
    )
}

const TopButtonImageWrapper = styled(Flex)`
padding: 0.2vw;
border-radius: 2vw;
background-color: ${mvConsts.colors.background.secondary};
@media (min-width: 320px) and (max-width: 480px) {
    padding: 1vw;
    border-radius: 10vw;  
}`

const TopButton = styled(Flex)`
padding: 0.75vw;
margin: 0.2vw;
border-radius: 1vw;
background-color: white;
flex-direction: row;
@media (min-width: 320px) and (max-width: 480px) {
    padding: 3vw;
    margin-top: 1.5vw;
    border-radius: 5vw;
}`

const SpaceTitle = styled(Flex)`
font-size: ${props => props.selected ? 1 : 0}vw;
padding: ${props => props.selected ? 0.5 : 0}vw;
margin-left: ${props => props.selected ? 0.5 : 0}vw;
border-radius: 1vw;
background-color: ${props => props.selected ? mvConsts.colors.lightblue : mvConsts.colors.background.secondary};
color: white;
transition: 0.2s;
@media (min-width: 320px) and (max-width: 480px) {
    font-size: ${props => props.selected ? 5 : 0}vw;
    padding: ${props => props.selected ? 2.5 : 0}vw;
    margin-left: ${props => props.selected ? 2.5 : 0}vw;
    border-radius: 5vw;
}`

const Top = styled(Flex)`
width: 74vw;
height: 8vh;
justify-content: space-between;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 8vh;
}`

const Center = styled(Flex)`
width: 74vw;
height: 84vh;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 92vh;
}`

const Right = styled(Flex)`
width: 20vw;
height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.visible ? `flex` : `none`};
    position: fixed;
    top: 0;
    width: 100vw;
    height: 94vh;
}`

export default main;
/*eslint-enable no-unused-vars*/