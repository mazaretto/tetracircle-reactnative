import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View, BackHandler } from 'react-native'
import { Link } from 'react-router-native'
import Title from '../elements/Title'
import STYLES from '../Styles'

export default MenuScreen = () => {
    return <View style={styles.menu}>
        <Title text={'ТетраШарики'} />
    
        <View>
            <Link to="/games">
                <Text style={STYLES.btn}>Начать игру сначала</Text>
            </Link>
            <TouchableHighlight onPress={() => BackHandler.exitApp()}>
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
    }
})