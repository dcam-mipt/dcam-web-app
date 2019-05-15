/*eslint-disable no-unused-vars*/
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components'

const PopUp = styled.div`
display: ${props => props.visible ? `flex` : `none`}
max-height: 92vh;
overflow: scroll;
transition: 0.2s
border-radius: 1vw;
background-color: white;
z-index: 2;
position: absolute;
top: ${props => (props.visible ? 0 : 2) + 1}vw;
right: 1vw;
visibility: ${props => props.visible ? `visible` : `hidden`}
opacity: ${props => +props.visible};
padding: 1vw;
@media (min-width: 320px) and (max-width: 480px) {
    position: fixed;
    width: 100vw;
    top: 0;
    right: 0;
}`

export default function useComponentVisible(initialIsVisible) {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const ref = useRef(null);
    const handleClickOutside = (event) => (ref.current && !ref.current.contains(event.target)) && setIsComponentVisible(false);
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });
    return [ref, isComponentVisible, setIsComponentVisible, <PopUp/>];
}
/*eslint-enable no-unused-vars*/