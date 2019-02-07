/*eslint-disable no-unused-vars*/

import React from 'react'
import { connect } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import Button from './UI/Button'
import GoogleAPI from '../../API/GoogleAPI'
import mvConsts from '../../constants/mvConsts'
import Container from '../Container'

class EntryScreen extends React.Component {
    render = () => {
        return (
            <Wrapper>
                <Left>

                </Left>
                <Right>
                    <Button short={true} backgroundColor={mvConsts.colors.yellow} onClick={() => { GoogleAPI.signIn() }} >
                        <Container extraProps={`flex-direction: row; @media (min-width: 320px) and (max-width: 480px) { font-size: 4vw; }`} >
                            sign in <span role="img" aria-label="hand">👋</span>
                        </Container>
                    </Button>
                </Right>
            </Wrapper>
        )
    }
}

export default (EntryScreen)

const Wrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
width: 100vw
height: 100vh
background-color: ${mvConsts.colors.background.primary}
transition: 0.2s
`

const Left = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 70vw
height: 100vh
background-color: ${mvConsts.colors.yellow}
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    display: none;
}
`

const Right = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 30vw
height: 100vh
background-color: ${mvConsts.colors.purple}
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw
}
`

/*eslint-enable no-unused-vars*/