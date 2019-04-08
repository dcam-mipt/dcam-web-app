/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import GoogleAPI from '../api/GoogleAPI'
import styled from 'styled-components'
import { connect } from  'react-redux'
import Main from './Main'
import Entry from './Entry'

let GoogleWrapper = (props) => {
    console.log(props.user)
    let [init, setInit] = useState(false)
    useEffect(() => {
        GoogleAPI.init()
            .then((d) => { setInit(true) })
            .catch((d) => {
                console.log(`google initialization error`)
            })
    })
    return init ? props.user.token ? <Main/> : <Entry/> : <LoadingPage/>
}

let LoadingPage = (props) => {
     return (
        <LoadingPageWrapper>
            loading
        </LoadingPageWrapper>
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

let mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(GoogleWrapper)
/*eslint-enable no-unused-vars*/