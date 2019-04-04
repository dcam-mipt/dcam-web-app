/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import GoogleAPI from '../api/GoogleAPI'
import styled from 'styled-components'

let GoogleWrapper = (props) => {
    let [init, setInit] = useState(false)
    useEffect(() => {
        GoogleAPI.init()
            .then((d) => { setInit(true) })
            .catch((d) => { console.log(`google initialization error`) })
    })
    return init ? <UserWrapper /> : <LoadingPage />
}

let LoadingPage = () => {
    return (
        <LoadingPageWrapper>
            loading
        </LoadingPageWrapper>
    )
}

let UserWrapper = () => {
    return (
        <div>user wrapper</div>
    )
}

const LoadingPageWrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 100vw;
height: 100vh;
background-color: white;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

export default GoogleWrapper
/*eslint-enable no-unused-vars*/