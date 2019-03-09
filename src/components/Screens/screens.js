import React from 'react'
import LaundryScreen from './Laundry/LaundryScreen'
import ClubScreen from './Club/ClubScreen.js'
import mvConsts from '../../constants/mvConsts'
import UsersScreen from './Users/UsersScreen';

let screens = [
    <LaundryScreen name={mvConsts.screens.laundry} />,
    <ClubScreen name={mvConsts.screens.club} />,
    <UsersScreen name={mvConsts.screens.users} />,
]

export default screens