/**
 * Created by mityabeldii on 10.06.2017.
 */
/*eslint-disable no-unused-vars*/
import moment from 'moment'
import axios from 'axios'

let sunrise = +moment().startOf(`day`).add(8, `hour`)
let sunset = +moment().startOf(`day`).add(17, `hour`)

// axios.get(`http://api.openweathermap.org/data/2.5/weather?q=Moscow,RU&APPID=0579fe15f41ee155e5acbf5059f29b0c`)
//     .then((d) => {
//         sunrise = d.data.sys.sunrise * 1000
//         sunset = d.data.sys.sunset * 1000
//     })
//     .catch((d) => { console.log(d) })

let dayTheme = {
    yellow: "#FFCC00",
    accept: "#2DC76D",
    purple: `#7540EE`,
    lightblue: "#3FB6DC",
    vk: "#3A60A1",
    WARM_ORANGE: `#FF7052`,
    background: {
        primary: `#fff`,
        secondary: `#EEEEEE`,
        support: `#d5d5d5`,
    },
    text: {
        primary: `#000`,
        secondary: `#fff`,
        support: `#939393`,
    }
}

let darkTheme = {
    yellow: "#FFCC00",
    accept: "#2DC76D",
    purple: `#7540EE`,
    lightblue: "#3FB6DC",
    vk: "#3A60A1",
    WARM_ORANGE: `#FF7052`,
    background: {
        primary: `#45464D`,
        secondary: `#2A2B31`,
        support: `#767676`,
    },
    text: {
        primary: `#fff`,
        secondary: `#fff`,
        support: `#939393`,
    }
}

export default {

    test: `test`,

    colors: dayTheme,
    // colors: darkTheme,
    // colors: +moment() > sunset || +moment() < sunrise ? darkTheme : dayTheme,

    weekDays: {
        short: [`ВС`, `ПН`, `ВТ`, `СР`, `ЧТ`, `ПТ`, `СБ`],
        full: [`воскресенье`, `понедельник`, `вторник`, `среда`, `четверг`, `пятница`, `суббота`]
    },

    month: [`Январь`, `Февраль`, `Март`, `Апрель`, `Май`, `Июнь`, `Июль`, `Август`, `Октябрь`, `Сентябрь`, `Ноябрь`, `Декабрь`,],

    colors_: {
        SPACE_NAVY: `#25265E`,
        STEEL_GREY: `#868697`,
        SATE_PURPLE: `#7540EE`,
        HAN_BLUE: `#2F61D5`,
        PICTION_BLUE: `#3FB6DC`,
        GRASS_GREEN: `#2DC76D`,
        WARM_ORANGE: `#FF7052`,
        GOLDEN_BAY: `#FFC800`,
    },

    screens: {
        home: "HOME",
        laundry: "LAUNDRY",
        users: "USERS",
        club: "club",
        settings: "SETTINGS",
        settings_user: "SETTINGS_USER",
        settings_notifications: "SETTINGS_NOTIFICATIONS",
        settings_payment: "SETTINGS_PAYMENT",
    },

    roles: {
        USER: `USER`,
        ADMIN: `ADMIN`,
        LAUNDRY_WATCHER: `LAUNDRY_WATCHER`,
    },

    popUps: {
        BOOKING_WINDOW: "BOOKING_WINDOW",
        TOP_PROFILE_MENU: "TOP_PROFILE_MENU",
        TOP_BALANCE_WINDOW: "TOP_BALANCE_WINDOW",
        RESEVATIONS: "RESEVATIONS",
        MOBILE_MENU: "MOBILE_MENU",
        LAUNDRY_SETTINGS: "LAUNDRY_SETTINGS",
        EMPTY: "EMPTY",
        SHOPPING_BASKET: "SHOPPING_BASKET",
        GET_NFC: "GET_NFC",
        LAUNDRY_OPTIONS: "LAUNDRY_OPTIONS",
        CLUB_BOOK: "CLUB_BOOK",
    },

    status: {
        booked: "booked",
        myBook: "myBook",
        selected: "selected",
        free: "free",
    },

    errors: {
        emptyAccount: `users account is exist, but empty`,
    },
}
/*eslint-enable no-unused-vars*/