import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { colors, scale } from '../../../utilities'
import styles from './styles'

function SearchHeader(props) {
    const navigation = useNavigation()
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                    navigation.goBack()
                }}>
                <Ionicons
                    name="ios-arrow-back"
                    size={scale(25)}
                    color={colors.headerText}
                />
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <TextInput
                    style={styles.inputText}
                    placeholderTextColor={colors.fontSecondColor}
                    placeholder={`Резултати от търсенето:  ${props.searchCategory === 'View All' ? 'Всички' : props.searchCategory}`}
                />
            </View>
        </View>
    )
}
export default React.memo(SearchHeader)