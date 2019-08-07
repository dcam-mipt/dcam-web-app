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
                    <div style={{
                        width: `100vw`,
                        height: `100vw`,
                        overflow: `scroll`,
                        whiteSpace: `nowrap`,
                    }} >
                        {
                            new Array(10).fill(0).map((item, index) => {
                                return (
                                    <Inline key={index} >
                                        <Flex extra={`width: 100vw; height: 100vw; background-color: red; margin: 2vw;`} >

                                        </Flex>
                                    </Inline>
                                )
                            })
                        }
                    </div>
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

const Scroll = styled.div`
display: inline-block;
max-width: 100vw;
overflow: scroll;
white-space:nowrap;
height: 22vw;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const Inline = styled(Flex)`
display: inline-block;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

export default main;
/*eslint-enable no-unused-vars*/