import React from 'react'
import { Text } from 'react-native'

export default Title = ({ text }) => {    
    return <Text style={{
        fontSize: 45,
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 40,
        fontFamily: 'DynarShadowC',
        color: '#000'
    }}>{text}</Text>
}