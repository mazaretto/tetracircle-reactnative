import React, { useState } from 'react'
import { StyleSheet, Text, TouchableHighlight, View, BackHandler, Image } from 'react-native'
import { Link } from 'react-router-native'
import STYLES from '../Styles'

import Logo from '../assets/logo.png'
import { playSound } from '../Functions'
import syncStorage from 'sync-storage'
import { Audio } from 'expo-av'

export default MenuScreen = () => {
    const soundStatus = parseInt(syncStorage.get('soundStatus'))

    const [soundActive, setsoundActive] = useState(!isNaN(soundStatus) ? soundStatus : 0)

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
                setsoundActive(soundActive === 1 ? 0 : 1)
                syncStorage.set('soundStatus', soundActive)
            }}>
                <Text style={STYLES.btn}>Аудио ({soundActive === 1 ? 'вкл.' : 'выкл.'})</Text>
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
        height: 30,
        marginBottom: 50
    }
})