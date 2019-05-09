/*eslint-disable no-unused-vars*/
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment'

let AdminTools = (props) => {
    let [users, setUsers] = useState([])
    useEffect(() => {
        axios.defaults.headers.common.Authorization = props.token
        axios.get(`http://dcam.pro/api/users/get_users_list`)
            .then((d) => { setUsers(d.data) })
            .catch((d) => { console.log(d) })
    })
    return (
        <GlobalWrapper>
            <Block width={30} >
                <div style={{ display: `flex` }} >
                    {
                        users.map((user, user_index) => <User key={user_index} >
                            <Avatar src={user.avatar} />
                            <div>
                                <div>{user.username.split(`@`)[0]}</div>
                                <UserStatus>{moment() - user.last_seen < 5000 * 3600 ? `онлайн` : moment(user.last_seen).format(`DD.MM.YY HH:mm`)}</UserStatus>
                            </div>
                        </User>)
                    }
                </div>
            </Block>
            <Block width={30} >

            </Block>
            <Block width={34} >
                {
                    props.machines.map((machine, machine_index) => {
                        return (
                            <Machine key={machine_index} >

                            </Machine>
                        )
                    })
                }
                <Machine onClick={() => {
                    axios.get(`http://dcam.pro/api/machines/create`)
                        .then((d) => { console.log(d) })
                        .catch((d) => { console.log(d) })
                }} >
                    Добавить
                </Machine>
            </Block>
        </GlobalWrapper>
    )
}

let mapStateToProps = (state) => {
    return {
        token: state.user.token,
        machines: state.machines.machines,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        // setToken: (data) => {
        //     return dispatch(userActions.setToken(data))
        // },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminTools)

const Machine = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 20vw;
height: 3vw;
border-radius: 0.5vw;
background-color: white;
margin: 0.5vw;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const User = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: row;
transition: 0.2s;
padding: 0.5vw;
margin: 0.5vw;
border-radius: 0.5vw;
background-color: white;
cursor: pointer;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const GlobalWrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: row;
transition: 0.2s;
width: 94vw;
height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
}`

const Block = styled.div`
display: block;
max-height: 92vh;
overflow: scroll;
transition: 0.2s
width: ${props => props.width}vw;
height: 94vh;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
}`

const Avatar = styled.img`
width: 2.5vw;
margin-right: 1vw;
border-radius: 3vw;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const UserStatus = styled.div`
color: lightgrey;
font-size: 0.8vw;
@media (min-width: 320px) and (max-width: 480px) {
    
}`
/*eslint-enable no-unused-vars*/