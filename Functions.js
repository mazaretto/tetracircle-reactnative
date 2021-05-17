import * as Font from 'expo-font'
import { Audio } from 'expo-av'
import syncStorage from 'sync-storage'

export function tUpper (text) {
    return text.trim().toUpperCase()
}

export function uniqueArr (arr, prop) {
    return arr.filter(item => item[prop] !== '')
}

const btnSound = require('./assets/sounds/btn.wav')
const sound0 = require('./assets/sounds/0.mp3')
const sound1 = require('./assets/sounds/1.mp3')
const sound2 = require('./assets/sounds/2.mp3')
const menuSound = require('./assets/sounds/menu.mp3')
const gameFail = require('./assets/sounds/game_fail.mp3')
const plusBall = require('./assets/sounds/plus_ball.mp3')
const minusBall = require('./assets/sounds/minus_ball.mp3')
const rowSuccess = require('./assets/sounds/row_success.mp3')

let APP_AUDIOS = []

export async function playSound (name, volume = 1, prop) {
    const permissionSoundPlay = syncStorage.get('soundStatus')
    const permissionMusicPlay = syncStorage.get('musicStatus')

    let data = {
        loop: false
    }

    if(typeof prop === "object") {
        for(let i in prop) {
            if(data[i] !== undefined) {
                data[i] = prop[i]
            }
        }
    }
    
    const files = {
        'btn': {
            file: btnSound,
            is: 'sound'
        },
        0: {
            file: sound0,
            is: 'music'
        },
        1: {
            file: sound1,
            is: 'music'
        },
        2: {
            file: sound2,
            is: 'music'
        },
        'gameFail': {
            file: gameFail,
            is: 'sound'
        },
        'plusBall': {
            file: plusBall,
            is: 'sound'
        },
        'minusBall': {
            file: minusBall,
            is: 'sound'
        },
        'rowSuccess': {
            file: rowSuccess,
            is: 'sound'
        },
        'menu': {
            file: menuSound,
            is: 'music'
        }
    }
    
    if(files[name]) {
        const $file = files[name]
        
        if($file.is === 'music' && !permissionMusicPlay) {
            return 
        } else if ($file.is === 'sound' && !permissionSoundPlay) {
            return 
        }

        const { sound } = await Audio.Sound.createAsync($file.file, {
            isLooping: data.loop,
            volume
        })

        if(data.loop) {
            sound.setIsLoopingAsync(true)
        }

        if($file.is === 'music') {
            APP_AUDIOS.push(sound)
        }

        await sound.playAsync()
    }
}

export function stopAllAudios () {
    APP_AUDIOS.forEach(async audio => {
        await audio.stopAsync()
        await audio.unloadAsync()
    })

    APP_AUDIOS = []
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