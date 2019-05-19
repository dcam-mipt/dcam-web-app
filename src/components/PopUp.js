import styled from 'styled-components'
const PopUp = styled.div`
display: flex;
align-items: center;
justify-content: center;
max-height: 92vh;
overflow: scroll;
transition: 0.2s;
border-radius: 1vw;
background-color: white;
z-index: 2;
position: absolute;
top: ${props => (props.top ? props.top : 0) + (props.visible ? 0 : 2) + 1}vw;
right: 1vw;
visibility: ${props => props.visible ? `visible` : `hidden`}
opacity: ${props => +props.visible};
padding: 1vw;
flex-direction: column;
@media (min-width: 320px) and (max-width: 480px) {
    position: fixed;
    width: 100vw;
    top: 0;
    right: 0;
    transition: 0s;
}`

export default PopUp;