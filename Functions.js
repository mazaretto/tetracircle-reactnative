import * as Font from 'expo-font'

export function tUpper (text) {
    return text.trim().toUpperCase()
}

export function uniqueArr (arr, prop) {
    return arr.filter(item => item[prop] !== '')
}

export function sortBy (prop, arr) {
    return arr.sort((a, b) => {
        let _a = a[prop], _b = b[prop]

        _a = (typeof _a === "string") ? _a.trim().toUpperCase() : _a
        _b = (typeof _b === "string") ? _b.trim().toUpperCase() : _b

        if(_a < _b) return -1
        if(_a > _b) return 1
        
        return 0
    });
}

export function randomElemArray (arr) {
    return arr[Math.floor(Math.random()*arr.length)]
}

export const GetAllFonts = async (callback) => {
    await Font.loadAsync({
        DynarShadowC: require('./assets/fonts/DynarShadowC.otf')
    })

    callback ? callback() : ''
}