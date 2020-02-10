/*eslint-disable no-unused-vars*/
import React from 'react'
import styled from 'styled-components'
import mvConsts from '../../constants/mvConsts';
import {Flex} from './styled-templates'

export default (props = { checked: false, onChange: () => { } }) => <Wrapper
    checked={props.checked}
    onClick={() => { props.onChange(!props.checked) }}
>
    <Circle checked={props.checked} />
</Wrapper>

let k = 0.8

const Wrapper = styled(Flex)`
width: ${3.5 * k}vw
height: ${2 * k}vw
border-radius: ${2 * k}vw
position: relative;
background: ${props => props.checked ? props.theme.accept : props.theme.background.support}
cursor: pointer;
`

const Circle = styled(Flex)`
width: ${1.5 * k}vw
height: ${1.5 * k}vw
position: absolute;
top: ${0.25 * k}vw;
left: ${props => (props.checked ? 1.75 : 0.25) * k}vw;
border-radius: ${1.5 * k}vw
background: ${props => props.theme.background.primary}
transform: rotate(${props => props.checked ? 0 : 45}deg);
cursor: pointer;
`

/*eslint-enable no-unused-vars*/