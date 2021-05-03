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

export async function playSound (name) {
    const permissionSoundPlay = parseInt(syncStorage.get('soundStatus'))
    
    console.log(permissionSoundPlay)

    if(!permissionSoundPlay) {
        const files = {
            'btn': btnSound,
            0: sound0,
            1: sound1,
            2: sound2
        }
    
        if(files[name]) {
            const { sound } = await Audio.Sound.createAsync(files[name])
    
            await sound.playAsync()
        }
    }
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