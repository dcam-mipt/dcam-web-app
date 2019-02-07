import React from 'react'
import LaundryScreen from './Laundry/LaundryScreen'
import ClubScreen from './Club/ClubScreen.js'
import mvConsts from '../../constants/mvConsts'

let screens = [
    <LaundryScreen name={mvConsts.screens.laundry} />,
    <ClubScreen name={mvConsts.screens.club} />,
]

export default screens