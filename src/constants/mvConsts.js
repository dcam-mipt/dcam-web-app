/*eslint-disable no-unused-vars*/
export let dayTheme = {
    yellow: "#FFCC00",
    accept: "#2DC76D",
    purple: `#7540EE`,
    lightblue: "#2F61D5",
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

export let darkTheme = {
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

let colors = dayTheme

export let changeTheme = (theme) => { colors = theme }

export default {
    api: `https://dcam.pro/api`,
    mobile_media_query: (d) => `@media (min-width: 320px) and (max-width: 480px) { ${d}; transition: 0; }`,
    colors: colors,
    weekDays: {
        short: [`ПН`, `ВТ`, `СР`, `ЧТ`, `ПТ`, `СБ`, `ВС`],
        full: [`воскресенье`, `понедельник`, `вторник`, `среда`, `четверг`, `пятница`, `суббота`]
    },
    month: [`Январь`, `Февраль`, `Март`, `Апрель`, `Май`, `Июнь`, `Июль`, `Август`, `Сентябрь`, `Октябрь`, `Ноябрь`, `Декабрь`,],
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
        laundry: "LAUNDRY",
        admin: "TOOLS",
        event_spaces: "SPACES",
        votes: "VOTES",
    },
}
/*eslint-enable no-unused-vars*/