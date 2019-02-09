/*eslint-disable no-unused-vars*/
import styled, { keyframes } from 'styled-components';
export default styled.div`

    ${props => props.width === undefined ? null : `width: ${props.width}${props.widthUnit === undefined ? `vw` : props.widthUnit}`}
    ${props => props.height === undefined ? null : `height: ${props.height}${props.heightUnit === undefined ? `vh` : props.heightUnit}`}
    ${props => props.backgroundColor === undefined ? null : `background-color: ${props.backgroundColor}`}
    ${props => props.bold === undefined ? null : `font-family: Lato-Bold`}
    
    box-sizing: border-box;
    
    user-select: none;
    display: flex;
    justify-content: ${props => props.justifyContent === undefined ? `center` : props.justifyContent };
    align-items: ${props => props.alignItems === undefined ? `center` : props.alignItems };
    text-align: ${props => props.textAlign === undefined ? `center` : props.textAlign };
    flex-direction: ${props => props.flexDirection === undefined ? `column` : props.flexDirection};
    font-size: 0.8vw;

    -webkit-overflow-scrolling: touch;
    ::-webkit-scrollbar {
        width: 0;
    }
    
    ${props => props.extraProps === undefined ? null : props.extraProps}
`
/*eslint-enable no-unused-vars*/