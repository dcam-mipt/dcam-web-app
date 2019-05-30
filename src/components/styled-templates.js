/*eslint-disable no-unused-vars*/
import styled, { keyframes } from 'styled-components'
import mvConsts from '../constants/mvConsts'

export const Image = styled.img`
width: ${props => props.width}vw;
height: ${props => props.width}vw;
transition: 0.2s
border-radius: ${props => props.round && props.width}vw
visibility: ${props => props.src ? `visible` : `hidden`}
cursor: ${props => props.pointer ? `pointer` : `null`}
${props => props.extra};
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.width * 5}vw;
    height: ${props => props.width * 5}vw;
    border-radius: ${props => props.round && (props.width * 5)}vw
}`

export const Flex = styled.div`
display: ${props => props.only_mobile ? `none` : `flex`}
justify-content: ${props => props.row ? props.start ? `flex-start` : props.end ? `flex-end` : `center` : `center`};
align-items: ${props => !props.row ? props.start ? `flex-start` : props.end ? `flex-end` : `center` : `center`};
flex-direction: ${props => props.row ? `row` : `column`}
transition: 0.2s
${props => props.extra}
font-size: 1vw;
cursor: ${props => props.pointer ? `pointer` : `null`}
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.only_desktop ? `none` : `flex`}
    font-size: 4vw;
}`

export const PopUp = styled(Flex)`
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
transition: 0.2s;
border-radius: 1vw;
background-color: white;
z-index: 2;
position: fixed;
top: ${props => (props.top ? props.top : 0) + (props.visible ? 0 : 2) + 1}vw;
right: ${props => props.right ? props.right : 1}vw;
visibility: ${props => props.visible ? `visible` : `hidden`}
opacity: ${props => +props.visible};
padding: 1.8vw;
@media (min-width: 320px) and (max-width: 480px) {
    padding-top: 5vw;
    width: 100vw;
    top: 0;
    right: 0;
    display: block;
    height: 90%;
    overflow: scroll;
    transition: 0s;
}`

export const Text = styled(Flex)`
font-size: ${props => props.size ? props.size : 0.8}vw;
color: ${props => props.color ? props.color : null};
font-family: ${props => props.bold ? `Bold` : `Regular`};
@media (min-width: 320px) and (max-width: 480px) {
    font-size: ${props => (props.size ? props.size : 0.8) * 5}vw;
}`

export const Bar = styled(Flex)`
width: 100%;
justify-content: flex-start;
${props => props.clear ? null : `border-bottom: 0.15vw dashed ${mvConsts.colors.background.secondary};`}
padding: 1vw 0 1vw 0;
@media (min-width: 320px) and (max-width: 480px) {
    ${props => props.clear ? null : `border-bottom: 0.75vw dashed ${mvConsts.colors.background.secondary};`}
    padding: 5vw 0 5vw 0;
    width: 85vw;
}`

export const BarWrapper = styled(Flex)`
> * {
    &:first-child {
        padding-top: 0;
    };
    &:last-child {
        padding-bottom: 0;
        border: 0;
    }
}
`

const rotate = keyframes`
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
`;

export const Rotor = styled.div`animation: ${props => props.rotate === undefined ? rotate : props.rotate ? rotate : null} 2s linear infinite; padding: -2vw;`
/*eslint-enable no-unused-vars*/