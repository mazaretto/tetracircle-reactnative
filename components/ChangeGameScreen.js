import React, {useState} from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Link } from 'react-router-native'
import { playSound, stopAllAudios } from '../Functions'

import STYLES from '../Styles'

export default ChangeGameScreen = () => {
    const [lvl, setlvl] = useState(1)

    const lvls = [
        {name: 'Легкий', value: 0, color: '#d0ffc9'},
        {name: 'Средний', value: 1, color: '#fff58e'},
        {name: 'Тяжелый', value: 2, color: '#ffbfbf'}
    ]

    return <View style={styles.menu}>
        <Title text={'Выбрать игру'} />

        <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 50,
            alignItems: 'center'
        }}>
             {lvls.map((item, i) => {
                 return <TouchableHighlight onPress={() => {
                    playSound('btn') 
                    setlvl(item.value)
                }} key={i} style={[styles.lvl, {
                     backgroundColor: item.color
                 }]}>
                     <Text style={styles.lvlText}>{item.value === lvl ? '✓' : ''} {item.name}</Text>
                 </TouchableHighlight>
             })}
        </View>
    
        <View>
            <Link to={`/game/0/${lvl}`}>
                <Text style={STYLES.btn}>Ряд одного цвета</Text>
            </Link>

            <Link to={`/game/1/${lvl}`}>
                <Text style={STYLES.btn}>Разноцветный ряд</Text>
            </Link>

            <Link to={`/game/2/${lvl}`}>
                <Text style={STYLES.btn}>Бесконечный поток</Text>
            </Link>  

            <Link onPress={() => playSound('btn')} to="/">
                <Text style={STYLES.btn}>В меню</Text>
            </Link>   
        </View>
    </View>
}

const styles = StyleSheet.create({
    lvl: {
        width: '33%',
        paddingVertical: 10,
        backgroundColor: 'red',
        borderRadius: 20,
    },
    lvlText: {
        color: '#000',
        fontSize: 18,
        textAlign: 'center'
    },
    menu: {
        paddingTop: 100,
        paddingLeft: 15,
        paddingRight: 15
    }
})