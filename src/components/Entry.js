/*eslint-disable no-unused-vars*/
import React from 'react'
import { connect } from 'react-redux'
import GoogleAPI from '../API/GoogleAPI'
import userActions from '../redux/actions/UserActions'
import axios from 'axios'
import styled from 'styled-components'
import mvConsts from '../constants/mvConsts'
import Button from './Button'

let Entry = (props) => {
    let signIn = () => new Promise((resolve, reject) => {
        GoogleAPI.signIn()
            .then((d) => {
                axios.get(`http://dcam.pro/api/auth/${d.w3.U3}/${d.w3.Eea}`)
                    .then((d) => { props.setToken(d.data); resolve(d); })
                    .catch((d) => { console.log(d); reject(d); })
            })
            .catch((d) => { console.log(d) })
    })
    return (
        <Wrapper>
            <Left>

            </Left>
            <Right>
                <Button onClick={() => { signIn() }} >
                    @phystech.edu
                </Button>
            </Right>
        </Wrapper>
    )
}

let mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        setToken: (data) => {
            return dispatch(userActions.setToken(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Entry)

const Wrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
transition: 0.2s
width: 100vw;
height: 85vh;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const Left = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 70vw;
height: 85vh;
background-color: ${mvConsts.colors.yellow};
@media (min-width: 320px) and (max-width: 480px) {
    display: none;
}`
const Right = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 30vw;
height: 85vh;
background-color: ${mvConsts.colors.purple};
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
}`
/*eslint-enable no-unused-vars*/