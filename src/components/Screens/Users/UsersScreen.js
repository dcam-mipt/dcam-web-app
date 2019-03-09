/*eslint-disable no-unused-vars*/

import React from 'react'
import { connect } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import axios from 'axios'
import mvConsts from '../../../constants/mvConsts'
import Container from '../../Container'

class UsersScreen extends React.Component {
    state = {
        is_admin: false
    }
    componentDidMount() {
        axios.get(`http://dcam.pro/api/roles/get_my_roles/`)
            .then((d) => { this.setState({ is_admin: d.data.indexOf(`ADMIN`) > -1 }) })
            .catch((d) => { console.log(d) })
    }
    render = () => {
        return (
            <Container extraProps={`display: block; max-height: 90vh; overflow-y: scroll;`} >
                <Wrapper>
                    {
                        this.props.users_list.map((i, index) => {
                            return (
                                <User key={index} >
                                    <img
                                        src={i.avatar}
                                        style={{ width: `4vw`, borderRadius: `4vw` }}
                                        alt={``}
                                    />
                                </User>
                            )
                        })
                    }
                </Wrapper>
            </Container>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        users_list: state.users.users_list,
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        //name: () => {
        //return dispatch(action.name())
        //},
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersScreen)

const Wrapper = styled.div`
display: flex
justify-content: flex-start
align-items: flex-start
flex-direction: column
padding: 1vw;
width: 94vw
height: 90vh
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    flex-direciton: column;
}
`

const User = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
border-radius: 0.5vw;
margin-bottom: 0.5vw;
padding: 0.5vw;
background-color: ${mvConsts.colors.background.primary}
transition: 0.2s
`

/*eslint-enable no-unused-vars*/