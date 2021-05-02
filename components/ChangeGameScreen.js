import React, {useState} from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Link } from 'react-router-native'

import STYLES from '../Styles'

export default ChangeGameScreen = () => {
    const [lvl, setlvl] = useState(0)

    const lvls = [
        {name: 'Легко', value: 0, color: '#d0ffc9'},
        {name: 'Средне', value: 1, color: '#fff58e'},
        {name: 'Сложно', value: 2, color: '#ffbfbf'}
    ]

    return <View style={styles.menu}>
        <Title text={'Выберите игру'} />

        <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 50,
            alignItems: 'center'
        }}>
             {lvls.map((item, i) => {
                 return <TouchableHighlight onPress={() => setlvl(item.value)} key={i} style={[styles.lvl, {
                     backgroundColor: item.color
                 }]}>
                     <Text style={styles.lvlText}>{item.value === lvl ? '✓' : ''} {item.name}</Text>
                 </TouchableHighlight>
             })}
        </View>
    
        <View>
            <Link to={`/game/0/${lvl}`}>
                <Text style={STYLES.btn}>Больше шариков</Text>
            </Link>

            <Link to={`/game/1/${lvl}`}>
                <Text style={STYLES.btn}>Больше скорость</Text>
            </Link>

            <Link to={`/game/2/${lvl}`}>
                <Text style={STYLES.btn}>Больше рядов</Text>
            </Link>  

            <Link to="/">
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