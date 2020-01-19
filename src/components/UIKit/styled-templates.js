/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled, { keyframes, ThemeProvider } from 'styled-components'
import mvConsts, { darkTheme, dayTheme } from '../../constants/mvConsts'
import { connect } from 'react-redux'
import moment from 'moment'
import uiActions from '../../redux/actions/UiActions'

export const Image = styled.img`
width: ${props => props.width}vw;
height: ${props => props.width}vw;
transition: 0.2s
border-radius: ${props => props.round && props.width}vw
visibility: ${props => props.src ? `visible` : `hidden`}
cursor: ${props => props.pointer ? `pointer` : `null`}
${props => props.round ? `object-fit: cover;` : null}
${props => props.extra};
user-select: none;
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
user-select: none;
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
    height: 100%;
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

const ThemeWrapper_ = (props) => {
    let default_theme = props.theme === `light` ? dayTheme : darkTheme
    let [theme, setTheme] = useState(default_theme)
    useEffect(() => {
        if (localStorage.getItem(`theme_shift`) === `system`) {
            if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
                props.set_theme(`dark`)
            } else {
                props.set_theme(`light`)
            }
            try {
                window.matchMedia(`(prefers-color-scheme: dark)`).addEventListener(`change`, () => {
                    if (localStorage.getItem(`theme_shift`) === `system`) {
                        if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
                            props.set_theme(`dark`)
                        } else {
                            props.set_theme(`light`)
                        }
                    }
                }, false);
            } catch (error) {
                console.log(error)
            }
        }
    }, [props.theme_shift])
    useEffect(() => {
        let new_theme = dayTheme
        if (props.theme === `light`) new_theme = dayTheme
        if (props.theme === `dark`) new_theme = darkTheme
        setTheme(new_theme)
    }, [props.theme])
    return (
        <ThemeProvider theme={theme} >
            {props.children}
        </ThemeProvider>
    )
}

let mapStateToProps = (state) => { return { theme: state.ui.theme, theme_shift: state.ui.theme_shift } }
let mapDispatchToProps = (dispatch) => { return { set_theme: (data) => { return dispatch(uiActions.setTheme(data)) } } }
export let ThemeWrapper = connect(mapStateToProps, mapDispatchToProps)(ThemeWrapper_)

export function convertHex(hex, opacity) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
}

export const Book = (props) => {
    const Wrapper = styled(Flex)`
    background: ${props => props.is_weekend ? props.theme.background.primary : props.theme.background.primary};
    cursor: pointer;
    width: 18.5vw;
    border-radius: 1vw;
    margin: 0.25vw;
    padding: 0.75vw;
    flex-direction: row;
    border: 0.2vw solid ${props => props.is_selected_day ? props.theme.purple : props.is_today ? props.theme.accept : props.theme.background.secondary}
    justify-content: space-between;
    &:hover {
        transform: scale(1.05)
    }
    @media (min-width: 320px) and (max-width: 480px) {
        width: 92vw;
        height: 20vw;
        padding: 2vw;
        margin: 1vw;
        border-radius: 4vw;
        background-color: white;
        border: 1vw solid ${props => props.is_selected_day ? props.theme.purple : props.is_today ? props.theme.accept : `transparent`}
    }`
    const ImageWrapper = styled(Flex)`
    padding: 0.75vw;
    border-radius: 1vw;
    background: ${props => convertHex(props.theme.accept, 0.75)};
    @media (min-width: 320px) and (max-width: 480px) {
        
    }`
    return (
        <Wrapper {...props} >
            <Flex row>
                <ImageWrapper>
                    <Image width={1.5} src={props.image} />
                </ImageWrapper>
                <Flex extra={`align-items: flex-start; margin-left: 1.5vw;`} >
                    <Text size={1} bold >{props.title}</Text>
                    <Text color={props => props.theme.text.support} >{moment(props.date).format(`DD.MM.YY`)}</Text>
                </Flex>
            </Flex>
            {
                props.children
            }
            <Flex extra={`align-items: flex-start; margin-left: 0.5vw;`} >
                <Text size={1.2} bold >{moment(props.date).format(`HH:mm`)}</Text>
            </Flex>
        </Wrapper>
    )
}

export const Rotor = styled.div`animation: ${props => props.rotate === undefined ? rotate : props.rotate ? rotate : null} 2s linear infinite; padding: -2vw;`

export const ClosePopUp = (props) => <Text onClick={() => { if (props.props.close !== undefined) { props.props.close() } }} size={1.5} only_mobile extra={`width: 85vw; align-items: flex-start; margin-top: 10%; cursor: pointer;`} >Закрыть</Text>
/*eslint-enable no-unused-vars*/