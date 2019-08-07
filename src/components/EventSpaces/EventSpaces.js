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
    let [new_slot, set_new_slot] = useState(null)
    return (
        <Flex row extra={`@supports (-webkit-overflow-scrolling: touch) { height: 75vh; }`} >
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
                    <Flex row >
                        {
                            mvConsts.weekDays.short.map((item, index) => {
                                return (
                                    <Flex key={index} extra={`width: 10.2vw; height: 80vh; `} >
                                        <Cell>date</Cell>
                                        <Flex extra={`position: relative; width: 10.2vw; height: 78vh; background-color: red;`} onClick={(e) => {
                                            var rect = e.target.getBoundingClientRect();
                                            var y = e.clientY - rect.top;
                                            let slot_number = (y / rect.height * 24).toFixed(0)
                                            set_new_slot(slot_number)
                                        }} >
                                            <Flex extra={`
                                                display: ${new_slot === null ? `none` : `flex`};
                                                position: absolute;
                                                top: ${new_slot * 2.95}vh;
                                                width: 10vw;
                                                height: 2.95vh;
                                                background-color: yellow;
                                            `} >
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                )
                            })
                        }
                    </Flex>
                </Center>
            </Flex>
            <Right visible={calendar} >

            </Right>
        </Flex>
    )
}

const Cell = styled(Flex)`
width: 10.2vw;
height: 6vh;
background-color: ${mvConsts.colors.background.support};
border: 0.1vw solid ${mvConsts.colors.background.primary};
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const TopButtonImageWrapper = styled(Flex)`
padding: 0.2vw;
border-radius: 2vw;
background-color: ${mvConsts.colors.background.secondary};
@media (min-width: 320px) and (max-width: 480px) {
    padding: 0.8vw;
    border-radius: 8vw;  
}`

const TopButton = styled(Flex)`
padding: 0.75vw;
margin: 0.2vw;
border-radius: 1vw;
background-color: white;
flex-direction: row;
@media (min-width: 320px) and (max-width: 480px) {
    padding: 2.5vw;
    margin-top: 1vw;
    border-radius: 5vw;
}
`

const SpaceTitle = styled(Flex)`
font-size: ${props => props.selected ? 1 : 0}vw;
padding: ${props => props.selected ? 0.5 : 0}vw;
margin-left: ${props => props.selected ? 0.5 : 0}vw;
border-radius: 2vw;
background-color: ${props => props.selected ? mvConsts.colors.lightblue : mvConsts.colors.background.secondary};
color: white;
transition: 0.2s;
@media (min-width: 320px) and (max-width: 480px) {
    font-size: ${props => props.selected ? 4 : 0}vw;
    padding: ${props => props.selected ? 2 : 0}vw;
    margin-left: ${props => props.selected ? 2 : 0}vw;
    border-radius: 4vw;
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
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 75vh;
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
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 75vh;
}`

export default main;
/*eslint-enable no-unused-vars*/