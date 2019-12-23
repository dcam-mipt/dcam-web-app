/*eslint-disable no-unused-vars*/
export let dayTheme = {
    yellow: `#FFCC00`,
    accept: `#2DC76D`,
    purple: `#7540EE`,
    lightblue: `#2F61D5`,
    vk: `#3A60A1`,
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
    yellow: `#FFCC00`,
    accept: `#2DC76D`,
    purple: `#7540EE`,
    lightblue: `#3FB6DC`,
    vk: `#3A60A1`,
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

let hexToRgbA = (hex, alpha = 1) => {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    // console.log(`rgba(` + r + `,` + g + `,` + b + `,` + alpha + `)`);
    return `rgb(` + r + `, ` + g + `, ` + b + `)`;
    // if (alpha) {
        // return `rgba(` + r + `,` + g + `,` + b + `,` + alpha + `)`;
    // } else {
    //     console.log(`rgb(` + r + `, ` + g + `, ` + b + `)`);
    //     return `rgb(` + r + `, ` + g + `, ` + b + `)`;
    // }
}

export default {
    api: `https://dcam.pro/api`,
    mobile_media_query: (d) => `@media (min-width: 320px) and (max-width: 480px) { ${d}; transition: 0; }`,
    hexToRgbA: hexToRgbA,
    weekDays: {
        short: [`ПН`, `ВТ`, `СР`, `ЧТ`, `ПТ`, `СБ`, `ВС`],
        full: [`воскресенье`, `понедельник`, `вторник`, `среда`, `четверг`, `пятница`, `суббота`]
    },
    month: [`Январь`, `Февраль`, `Март`, `Апрель`, `Май`, `Июнь`, `Июль`, `Август`, `Сентябрь`, `Октябрь`, `Ноябрь`, `Декабрь`,],
    screens: {
        laundry: `LAUNDRY`,
        admin: `TOOLS`,
        event_spaces: `SPACES`,
        votes: `VOTES`,
    },
}
/*eslint-enable no-unused-vars*/