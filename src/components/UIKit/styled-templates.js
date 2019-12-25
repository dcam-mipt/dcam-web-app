/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled, { keyframes, ThemeProvider } from 'styled-components'
import mvConsts, { darkTheme, dayTheme } from '../../constants/mvConsts'
import { connect } from 'react-redux'
import moment from 'moment'

export const Image = styled.img`
width: ${props => props.width}vw;
height: ${props => props.width}vw;
transition: 0.2s
border-radius: ${props => props.round && props.width}vw
visibility: ${props => props.src ? `visible` : `hidden`}
cursor: ${props => props.pointer ? `pointer` : `null`}
${props => props.round ? `object-fit: cover;` : null}
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
font-size: 1vw;
background-size: cover;
background-repeat: no-repeat;
background-position: 50% 50%;
cursor: ${props => props.pointer ? `pointer` : `null`}
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.only_desktop ? `none` : `flex`}
    font-size: 4vw;
}
${props => props.extra}
`


export const PopUp = styled(Flex)`
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
transition: 0.2s;
border-radius: 1vw;
background-color: ${props => props.theme.background.primary};
z-index: ${props => props.visible ? 3 : 0};
position: absolute;
visibility: ${props => props.visible ? `visible` : `hidden`}
opacity: ${props => +props.visible};
padding: 1.8vw;
box-shadow: 0 0 2vw rgba(0, 0, 0, 0.1);
// transform: scale(${props => props.visible ? 1 : 1.1});
@media (min-width: 320px) and (max-width: 480px) {
    position: fixed;
    display: ${props => props.visible ? `flex` : `none`};
    padding-top: 5vw;
    width: 100vw;
    top: 0;
    right: 0;
    display: block;
    height: 90%;
    overflow: scroll;
    transition: 0s;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}`

export const Text = styled(Flex)`
font-size: ${props => props.size ? props.size : 0.8}vw;
color: ${props => props.color ? props.color : props.theme.text.primary};
font-family: ${props => props.bold ? `Bold` : `Regular`};
@media (min-width: 320px) and (max-width: 480px) {
    font-size: ${props => (props.size ? props.size : 0.8) * 4}vw;
}`

export const Bar = styled(Flex)`
width: 100%;
justify-content: flex-start;
padding: 0.5vw 0 0.5vw 0;
@media (min-width: 320px) and (max-width: 480px) {
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
    }
}
`

const rotate = keyframes`
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
`;

export const ThemeWrapper = (props) => {
    let default_theme = dayTheme
    if (localStorage.getItem(`theme`) === `system`) {
        default_theme = window.matchMedia(`(prefers-color-scheme: dark)`).matches ? darkTheme : dayTheme
    }
    if (localStorage.getItem(`theme`) === `disabled`) {
        default_theme = dayTheme
    }
    if (localStorage.getItem(`theme`) === `scheduled`) {
        default_theme = +moment().format(`HH`) > 7 && +moment().format(`HH`) < 22 ? dayTheme : darkTheme
    }
    if (localStorage.getItem(`theme`) === `automatic`) {
        default_theme = +moment().format(`HH`) > 7 && +moment().format(`HH`) < 22 ? dayTheme : darkTheme
    }
    let [theme, setTheme] = useState(default_theme)
    useEffect(() => {
        window.matchMedia(`(prefers-color-scheme: dark)`).addEventListener(`change`, () => {
            if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
                setTheme(darkTheme)
            } else {
                setTheme(dayTheme)
            }
        });
    }, [])
    return (
        <ThemeProvider theme={theme} >
            {props.children}
        </ThemeProvider>
    )
}

export const Rotor = styled.div`animation: ${props => props.rotate === undefined ? rotate : props.rotate ? rotate : null} 2s linear infinite; padding: -2vw;`

export const ClosePopUp = (props) => <Text onClick={() => { if (props.props.close !== undefined) { props.props.close() } }} size={1.5} only_mobile extra={`width: 85vw; align-items: flex-start; margin-top: 10%; cursor: pointer;`} >Закрыть</Text>
/*eslint-enable no-unused-vars*/