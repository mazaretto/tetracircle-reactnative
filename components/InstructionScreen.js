import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { Link } from 'react-router-native'
import { playSound } from '../Functions'

import STYLES from '../Styles'

import InstructionPng from '../assets/bg_study.png'

export default InstructionScreen = () => {

    return <View style={styles.menu}>
        <View>
            <View style={{
                alignItems: 'center',
                marginBottom: 20
            }}>

                <Image
                    source={InstructionPng}
                    style={{
                        width: 300,
                        height: 485
                    }}
                />

            </View>

            <Link onPress={() => playSound('btn')} to="/">
                <Text style={STYLES.btn}>В меню</Text>
            </Link>   
        </View>
    </View>
}

const styles = StyleSheet.create({
    
    menu: {
        paddingTop: 100,
        paddingLeft: 15,
        paddingRight: 15
    }
})