import mvConsts from '../../../constants/mvConsts'
import React from 'react'
import TopProfileMenu from './TopProfileMenu'
import TopBalanceWindow from './TopBalanceWindow'
import ShoppingBasket from './ShoppingBasket'
import LaundrySettings from './LaundrySettings'
import Reservations from './Reservations'
import GetNFC from './GetNFC'
import LaundyOptions from './LaundyOptions'
import ClubBook from './ClubBook'
import ClubEdit from './ClubEdit'
import LaundryBookDetails from './LaundryBookDetails'

export default [
    <TopProfileMenu name={mvConsts.popUps.TOP_PROFILE_MENU} />,
    <TopBalanceWindow name={mvConsts.popUps.TOP_BALANCE_WINDOW} />,
    <ShoppingBasket name={mvConsts.popUps.SHOPPING_BASKET} />,
    <LaundrySettings name={mvConsts.popUps.LAUNDRY_SETTINGS} />,
    <Reservations name={mvConsts.popUps.RESEVATIONS} />,
    <GetNFC name={mvConsts.popUps.GET_NFC} />,
    <LaundyOptions name={mvConsts.popUps.LAUNDRY_OPTIONS} />,
    <ClubBook name={mvConsts.popUps.CLUB_BOOK} />,
    <ClubEdit name={mvConsts.popUps.CLUB_EDIT} />,
    <LaundryBookDetails name={mvConsts.popUps.LAUNDRY_BOOK_DETAILS} />,
]