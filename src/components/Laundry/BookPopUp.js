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
            {
                (owner_data && props.selectedBook) && <Flex>
                    <Flex>
                        <Extra extra={`margin-bottom: 1vw; padding-bottom: 1vw; width: 90%; justify-content: flex-start; border-bottom: 0.1vw dashed lightgrey;`} row >
                            <Image src={props.user.avatar} width={3} round />
                            <Extra extra={`margin-left: 1vw; align-items: flex-start; width: 45%;`}>
                                <Extra extra={`font-size: 1vw;`} >{owner_data.username.split(`@`)[0]}</Extra>
                                <Extra extra={`color: darkgrey; font-size: 0.8vw;`} >{get_ser_status(owner_data.last_seen)}</Extra>
                            </Extra>
                            <Extra extra={`margin-left: 5vw`} >
                                <Image width={3} />
                            </Extra>
                        </Extra>
                        <Extra extra={`width: 90%; justify-content: flex-start; `} row >
                            <Title>Дата</Title>
                            <Extra extra={`align-items: flex-start;`} >
                                <Extra extra={`color: darkgrey; font-size: 0.8vw;`} >{moment(props.selectedBook.timestamp).format(`DD.MM.YY`)}</Extra>
                                <Extra extra={`font-size: 1.6vw;`} >{moment(props.selectedBook.timestamp).format(`HH:mm`)}</Extra>
                            </Extra>
                        </Extra>
                        <Extra extra={`width: 90%; justify-content: flex-start; `} row >
                            <Title>Машинка</Title>
                            <Extra row >
                                <MachineCircle>
                                    {props.machines.map(i => i.objectId).indexOf(props.selectedBook.machine_id) + 1}
                                </MachineCircle>
                            </Extra>
                        </Extra>
                        {
                            (props.is_admin || props.selectedBook.user_id === props.user.user_id) && <>
                                <Title>Упарвление</Title>
                                <Extra extra={`width: 90%; justify-content: flex-start; `} row >
                                    <Extra extra={`width: 3vw; height: 3vw; border-radius: 0.5vw; background-color: ${mvConsts.colors.background.secondary}; cursor: pointer;`} row >
                                        <Image
                                            width={1.5}
                                            src={require(`../../assets/images/money.svg`)}
                                            onClick={() => {
                                                axios.get(`http://dcam.pro/api/laundry/unbook/${props.selectedBook.objectId}`)
                                                    .then(() => { document.location.reload(); })
                                            }}
                                        />
                                    </Extra>
                                </Extra>
                            </>
                        }
                    </Flex>
                    {/* <Flex only_mobile >
                        still empty
                    </Flex> */}
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

const MachineCircle = styled(Extra)`
width: 2.5vw;
height: 2.5vw;
border-radius: 2.5vw;
font-size: 1vw;
background-color: ${mvConsts.colors.accept};
color: white;
@media (min-width: 320px) and (max-width: 480px) {
    width: 10vw;
    height: 10vw;
    border-radius: 10vw;
    font-size: 4vw;
}`

const Title = styled(Extra)`
width: 45%;
height: 3vw;
align-items: flex-start;
font-size: 0.8vw;
color: darkgrey;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

/*eslint-enable no-unused-vars*/