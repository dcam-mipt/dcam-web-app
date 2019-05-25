/*eslint-disable no-unused-vars*/
import styled from 'styled-components'

export const Image = styled.img`
width: ${props => props.width}vw;
height: ${props => props.width}vw;
transition: 0.2s
border-radius: ${props => props.round && props.width}vw
visibility: ${props => props.src ? `visible` : `hidden`}
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.width * 5}vw;
    height: ${props => props.width * 5}vw;
    border-radius: ${props => props.round && (props.width * 5)}vw
}`

export const Flex = styled.div`
display: ${props => props.only_mobile ? `none` : `flex`}
justify-content: center
align-items: center
flex-direction: ${props => props.row ? `row` : `column`}
transition: 0.2s
${props => props.extra}
font-size: 1vw;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.only_desktop ? `none` : `flex`}
    font-size: 4vw;
}`

export let Extra = styled(Flex)`${props => props.extra};`

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
right: 1vw;
visibility: ${props => props.visible ? `visible` : `hidden`}
opacity: ${props => +props.visible};
padding: 1vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    top: 0;
    right: 0;
    transition: 0s;
}`
/*eslint-enable no-unused-vars*/