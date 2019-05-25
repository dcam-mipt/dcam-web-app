/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Flex, Image, Extra, PopUp } from '../styled-templates'
import axios from 'axios'
import styled from 'styled-components'
import mvConsts from '../../constants/mvConsts'
import { connect } from 'react-redux'

let get_ser_status = (timestamp) => {
    if (+moment() - +timestamp < 5 * 6000) {
        return `онлайн`
    }
    if (+moment() - +timestamp < 24 * 36000) {
        return `сегодня в ${moment(+timestamp).format(`HH:mm`)}`
    }
    if (+moment() - +timestamp < 24 * 36000) {
        return `оффлайн с ${moment(+timestamp).format(`DD.MM.YY`)}`
    }
}

let main = (props) => {
    let [owner_data, setOwnerData] = useState(undefined)
    useEffect(() => {
        if (props.selectedBook && !owner_data) {
            axios.get(`http://dcam.pro/api/users/get_user/${props.selectedBook.user_id}`)
                .then((d) => { setOwnerData(d.data); })
                .catch((d) => { console.log(d) })
        }
        if (!props.selectedBook) {
            setOwnerData(undefined)
        }
    })
    return (
        <Flex>
            {/* {
                        props.selectedBook && <BasketRecord>
                            <Flex row >
                                {props.selectedBook.email.split(`@`)[0]}
                            </Flex>
                            <Flex>
                                {moment(props.selectedBook.timestamp).format(`DD.MM`)}, {moment(props.selectedBook.timestamp).format(`HH:mm`)}
                            </Flex>
                            <MachineCircle>
                                {props.machines.map(i => i.objectId).indexOf(props.selectedBook.machine_id) + 1}
                            </MachineCircle>
                            {
                                props.is_admin
                                && <Flex lick={() => { axios.get(`http://dcam.pro/api/laundry/unbook/${props.selectedBook.objectId}`).then(() => { document.location.reload(); }) }} >
                                    Удалить
                                </Flex>
                            }
                        </BasketRecord>
                    } */}
            {
                (owner_data && props.selectedBook) && <Flex>
                    <Flex only_desktop >
                        <Flex row >
                            <Image src={props.user.avatar} width={3} round />
                            <Extra extra={`margin-left: 1vw;align-items: flex-start;`}>
                                <Extra extra={`font-size: 1vw;`} >{owner_data.username.split(`@`)[0]}</Extra>
                                <Extra extra={`color: darkgrey; font-size: 0.8vw;`} >{get_ser_status(owner_data.last_seen)}</Extra>
                            </Extra>
                            <Extra extra={`margin-left: 5vw`} >
                                <Image width={3} />
                            </Extra>
                        </Flex>
                        <Extra extra={`margin-top: 1vw; width: 90%; justify-content: space-between;`} row >
                            <Extra extra={`align-items: flex-start;`} >
                                <Extra extra={`font-size: 1.6vw;`} >{moment(props.selectedBook.timestamp).format(`HH:mm`)}</Extra>
                                <Extra extra={`color: darkgrey; font-size: 1vw;`} >{moment(props.selectedBook.timestamp).format(`DD.MM.YY`)}</Extra>
                            </Extra>
                            <Extra row >
                                <Extra extra={`margin-right: 0.5vw;`} >Машина: </Extra>
                                <MachineCircle>
                                    {props.machines.map(i => i.objectId).indexOf(props.selectedBook.machine_id) + 1}
                                </MachineCircle>
                            </Extra>
                            <Image width={2} src={props.is_admin || props.selectedBook.user_id === props.user.user_id ? require(`../../assets/images/money.svg`) : null} />
                        </Extra>
                    </Flex>
                    <Flex only_mobile >
                        still empty
                    </Flex>
                </Flex>
            }
        </Flex>
    )
}

let mapStateToProps = (state) => {
    return {
        user: state.user.user,
        is_admin: state.user.is_admin,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(main)

const MachineCircle = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 2vw;
height: 2vw;
border-radius: 2vw;
font-size: 0.8vw;
background-color: ${mvConsts.colors.accept};
color: white;
@media (min-width: 320px) and (max-width: 480px) {
    width: 10vw;
    height: 10vw;
    border-radius: 10vw;
    font-size: 4vw;
}`

/*eslint-enable no-unused-vars*/