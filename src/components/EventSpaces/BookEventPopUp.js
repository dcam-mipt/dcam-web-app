/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp, ClosePopUp, Bar } from '../UIKit/styled-templates'
import Input from '../UIKit/Input'
import Button from '../UIKit/Button'
import Form from '../UIKit/Form'
import DatePicker from '../UIKit/DatePicker'
import Selector from '../UIKit/Selector'
import mvConsts from '../../constants/mvConsts';
import moment from 'moment'
import Calendar from './Calendar'
import useComponentVisible from '../UIKit/useComponentVisible'
import axios from 'axios'
import { connect } from 'react-redux'
import QRCode from 'qrcode'

let get_user_status = (timestamp) => {
    if (+moment() - +timestamp < 5 * 6000) {
        return `онлайн`
    }
    if (+moment() - +timestamp < 24 * 3600000) {
        return `сегодня в ${moment(+timestamp).format(`HH:mm`)}`
    }
    return `оффлайн с ${moment(+timestamp).format(`DD.MM.YY`)}`
}

let BookEventPopUp = (props) => {
    let { event, is_admin, visible, theme, my_user_id } = props
    let [loading, set_loading] = useState(undefined)
    let [owner_data, set_owner_data] = useState(undefined)
    let [tools_ref, tools_visible, set_tools_visible] = useComponentVisible(false);
    let [qr_url, set_qr_url] = useState(``)
    useEffect(() => {
        let opts = {
            margin: 0,
            color: {
                dark: theme === `light` ? mvConsts.light.text.primary : mvConsts.dark.text.primary,
                light: '#0000'
            }
        }
        let data = event ? event.objectId : `in progress...`
        QRCode.toDataURL(data, opts, (err, url) => {
            set_qr_url(url)
        })
    }, [theme, event])
    useEffect(() => {
        if (event) {
            set_loading(true)
            axios.get(`${mvConsts.api}/users/get_user/${event.user_id}`)
                .then((d) => { set_owner_data(d.data); set_loading(false) })
                .catch((d) => { console.log(d) })
        } else {
            set_owner_data(undefined)
        }
    }, [event])
    return (
        <Flex extra={`position: relative;`} >
            <Flex only_desktop >
                {
                    (is_admin && event && !event.accepted) && <PopUp extra={`top: -1.5vw; left: ${visible ? 20 : 18}vw;`} ref={tools_ref} visible={visible} >
                        <Flex row extra={`margin: -1vw; width: 4.5vw; justify-content: space-between;`} >
                            <LikeButton visible={visible} text_color={props => props.theme.accept} onClick={async () => {
                                await axios.get(`${mvConsts.api}/events/accept/${event && event.objectId}/true`)
                                props.onDelete && props.onDelete()
                            }} >
                                <Like/>
                            </LikeButton>
                            <LikeButton visible={visible} text_color={props => props.theme.WARM_ORANGE} onClick={async () => {
                                await axios.get(`${mvConsts.api}/events/accept/${event && event.objectId}/false`)
                                props.onDelete && props.onDelete()
                            }} >
                                <Like extra={`transform: rotate(180deg);`} />
                            </LikeButton>
                        </Flex>
                    </PopUp>
                }
            </Flex>
            <Flex extra={`justify-content; flex-start;`} >
                <Bar row onClick={() => { props.close && props.close() }} >
                    <Flex only_mobile >
                        <Arrow only_mobile width={1.5} extra={`transform: rotate(180deg); margin-right: 1vw;`} />
                    </Flex>
                    <Text size={1.5} bold >Запись</Text>
                </Bar>
                <Bar row >
                    <Flex extra={props => `width: 0.5vw; height: 0.5vw; border-radius: 2vw; background: ${event ? event.accepted ? props.theme.accept : props.theme.yellow : props.theme.background.support}; @media (min-width: 320px) and (max-width: 480px) { width: 2vw; height: 2vw; };`} />
                    <Text extra={`width: 9vw; align-items: flex-start; margin-left: 1vw; cursor: pointer; @media (min-width: 320px) and (max-width: 480px) { width: 20vw; };`} >{event ? event.accepted ? `одобрено` : `в очереди` : `загрузка`}</Text>
                </Bar>
                {
                    (is_admin && event && !event.accepted) && <Bar row >
                        <Flex only_mobile row extra={`width: 18vw; justify-content: space-between;`} >
                            <LikeButton visible={visible} text_color={props => props.theme.accept} onClick={async () => {
                                await axios.get(`${mvConsts.api}/events/accept/${event && event.objectId}/true`)
                                props.onDelete && props.onDelete()
                            }} >
                                <Like/>
                            </LikeButton>
                            <LikeButton visible={visible} text_color={props => props.theme.WARM_ORANGE} onClick={async () => {
                                await axios.get(`${mvConsts.api}/events/accept/${event && event.objectId}/false`)
                                props.onDelete && props.onDelete()
                            }} >
                                <Like extra={`transform: rotate(180deg);`} />
                            </LikeButton>
                        </Flex>
                    </Bar>
                }
                <Bar row >
                    <Image src={owner_data && owner_data.avatar} round width={3} />
                    <NameWrapper>
                        <Text size={1} >{owner_data && owner_data.username.split(`@`)[0]}</Text>
                        <Text text_color={props => props.theme.text.support} >{owner_data && get_user_status(owner_data.last_seen)}</Text>
                    </NameWrapper>
                    <ImageWrapper><Image width={3} /></ImageWrapper>
                </Bar>
                <Bar row >
                    <Flex extra={`width: 45%;`} >
                        <Text text_color={props => props.theme.text.support} >{event && moment(event.start_timestamp).format(`DD.MM.YY`) + ` ` + mvConsts.weekDays.short[moment(event.start_timestamp).isoWeekday() - 1]}</Text>
                        <Text bold size={2} >{event && moment(event.start_timestamp).format(`HH:mm`)}</Text>
                    </Flex>
                    <Text bold size={2} extra={`width: 10%; margin-top: 0.8vw;`} >-</Text>
                    <Flex extra={`width: 45%;`} >
                        <Text text_color={props => props.theme.text.support} >{event && moment(event.end_timestamp).format(`DD.MM.YY`) + ` ` + mvConsts.weekDays.short[moment(event.end_timestamp).isoWeekday() - 1]}</Text>
                        <Text bold size={2} >{event && moment(event.end_timestamp).format(`HH:mm`)}</Text>
                    </Flex>
                </Bar>
                {
                    is_admin && <Bar row >
                        <Text>{event && event.aim}</Text>
                    </Bar>
                }
                <Bar row >
                    <Text extra={`width: 80%; align-items: flex-start;`} size={1} >Количество человек:</Text>
                    <Text extra={`width: 20%; align-items: flex-start;`} size={1} >{event && event.number_of_people}</Text>
                </Bar>
                {
                    (is_admin || (event && event.user_id) === my_user_id) && <Flex>
                        <CentredBar>
                            <Button background={props => props.theme.WARM_ORANGE} short={event && !event.accepted} onClick={async () => {
                                await axios.get(`${mvConsts.api}/events/accept/${event && event.objectId}/false`)
                                props.onDelete && props.onDelete()
                            }} >Удалить</Button>
                            {event && !event.accepted && <Button background={props => props.theme.accept} shaped onClick={() => { event && props.onEdit && props.onEdit(event.objectId) }} >Редактировать</Button>}
                        </CentredBar>
                        <Bar row >
                            <Flex extra={`width: 100%;`} >
                                <Image src={qr_url} size={1} />
                            </Flex>
                        </Bar>
                    </Flex>
                }
            </Flex>
        </Flex>
    )
}

let mapStateToProps = (state) => {
    return {
        is_admin: state.user.is_admin,
        my_user_id: state.user.user && state.user.user.objectId,
        theme: state.ui.theme,
    }
}
export default connect(mapStateToProps)(BookEventPopUp)

const Arrow = (props) => <Image {...props} src={require(localStorage.getItem(`theme`) === `light` ? `../../assets/images/arrow.svg` : `../../assets/images/arrow_white.svg`)} />

const Like = (props) => <Image {...props} src={require(`../../assets/images/like.svg`)} width={1} />

const CentredBar = styled(Bar)`
flex-direction: row;
justify-content: space-around;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const LikeButton = styled(Flex)`
cursor: pointer;
width: ${props => +props.visible * 2}vw;
height: ${props => +props.visible * 2}vw;
border-radius: 0.5vw;
background: ${props => props.color}
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => +props.visible * 8}vw;
    height: ${props => +props.visible * 8}vw;
    border-radius: 2vw;
}`

const NameWrapper = styled(Flex)`
padding-left: 1vw;
align-items: flex-start;
@media (min-width: 320px) and (max-width: 480px) {
    padding - left: 5vw;
}`

const ImageWrapper = styled(Flex)`
width: 7vw;
align-items: flex-end;
@media (min-width: 320px) and (max-width: 480px) {
    width: 35vw;
}`
/*eslint-enable no-unused-vars*/