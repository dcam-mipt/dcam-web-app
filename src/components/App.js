/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import { Flex, Image, Text, Rotor } from './UIKit/styled-templates'
import Button from './UIKit/Button'
import mvConsts from '../constants/mvConsts'

let App = () => {
    useEffect(() => {
        setTimeout(() => {
            window.location.replace(`http://dcam.pro`)
        }, 2000)
    }, [])
    return (
        <Flex extra={`width: 100vw; height: 100vh; background: ${mvConsts.colors.purple};`} >
            <Image src={require(`../assets/images/move.svg`)} width={15} />
            <Text bold color={`white`} size={1.5} extra={`margin-bottom: 3vw; @media (min-width: 320px) and (max-width: 480px) { margin-bottom: 15vw; }`} >Мы переехали</Text>
            <Button
                backgroundColor={mvConsts.colors.accept}
                extra={`&:hover { transform: rotate(2deg) scale(1.05) };`}
                onClick={() => {
                    window.location.replace(`http://dcam.pro`)
                }}
            >
                dcam.pro
            </Button>
        </Flex>
    )
}

export default App;
/*eslint-enable no-unused-vars*/