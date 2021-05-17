import React, { useState } from 'react'
import { StyleSheet, Text, TouchableHighlight, View, BackHandler, Image } from 'react-native'
import { Link } from 'react-router-native'
import STYLES from '../Styles'

import Logo from '../assets/logo.png'
import { playSound, stopAllAudios } from '../Functions'
import syncStorage from 'sync-storage'

export default MenuScreen = () => {
    const soundStatus = syncStorage.get('soundStatus')
    const musicStatus = syncStorage.get('musicStatus')
    
    const [appinit, setappinit] = useState(0)

    const [soundActive, setsoundActive] = useState(!!soundStatus)
    const [musicActive, setmusicActive] = useState(!!musicStatus)

    // componentDidMount
    if(!appinit) {
        stopAllAudios()
        setmusicActive(true)
        setsoundActive(true)
        syncStorage.set('musicStatus', true)
        syncStorage.set('soundStatus', true)

        playSound('menu', 1, {
            loop: true
        })
        setappinit(1)
    }

    return <View style={styles.menu}>
        <Image
            source={Logo}
            style={styles.logo}
        />
    
        <View>
            <Link onPress={() => playSound('btn')} to="/games">
                <Text style={STYLES.btn}>Начать игру</Text>
            </Link>

            <TouchableHighlight onPress={() => {
                playSound('btn')

                let newSoundActive = !soundActive

                setsoundActive(newSoundActive)
                syncStorage.set('soundStatus', newSoundActive)
            }}>
                <Text style={STYLES.btn}>Аудио ({soundActive ? 'вкл.' : 'выкл.'})</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => {
                playSound('btn')

                let newMusicActive = !musicActive

                if(!newMusicActive)
                    stopAllAudios()

                setmusicActive(newMusicActive)
                syncStorage.set('musicStatus', newMusicActive)
            }}>
                <Text style={STYLES.btn}>Музыка ({musicActive ? 'вкл.' : 'выкл.'})</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => {
                playSound('btn')
                BackHandler.exitApp()
            }}>
                <Text style={STYLES.btn}>Выйти из игры</Text>
            </TouchableHighlight>
        </View>
    </View>
}

const styles = StyleSheet.create({
    menu: {
        paddingTop: 200,
        paddingLeft: 15,
        paddingRight: 15
    },
    logo: {
        width: '100%',
        height: 89,
        marginBottom: 50
    }
})