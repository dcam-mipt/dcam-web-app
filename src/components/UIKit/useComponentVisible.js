/*eslint-disable no-unused-vars*/
import React, { useState, useEffect, useRef } from 'react';
import { PopUp } from './styled-templates'

export default (default_visible) => {
    const [visible, set_visible] = useState(default_visible);
    const ref = useRef(null);
    const handleClickOutside = (event) => (ref.current && !ref.current.contains(event.target)) && set_visible(false);
    const close = () => { setTimeout(() => { set_visible(false) }, 0) }
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });
    return [ref, visible, set_visible, close];
}
/*eslint-enable no-unused-vars*/