/*eslint-disable no-unused-vars*/

import React from 'react'
import { connect } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import mvConsts from '../../../constants/mvConsts';

class Switch extends React.Component {
    static defaultProps = {
        checked: false,
        onChange: () => { }
    }
    state = {
        checked: false,
    }
    render = () => {
        return (
            <Wrapper
                checked={this.props.checked}
                onClick={() => { this.props.onChange(!this.props.checked) }}
            >
                <Circle checked={this.props.checked} />
            </Wrapper>
        )
    }
}

const Wrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 3.5vw
height: 2vw
border-radius: 2vw
position: relative;
// border: 0.15vw solid ${mvConsts.colors.background.primary}
background-color: ${props => props.checked ? mvConsts.colors.accept : mvConsts.colors.background.support}
cursor: pointer;
transition: 0.2s
`

const Circle = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 1.5vw
height: 1.5vw
position: absolute;
top: 0.25vw;
left: ${props => props.checked ? 1.75 : 0.25}vw;
border-radius: 1.5vw
background-color: ${mvConsts.colors.background.primary}
transform: rotate(${props => props.checked ? 0 : 45}deg);
cursor: pointer;
transition: 0.2s
`

export default (Switch)

/*eslint-enable no-unused-vars*/