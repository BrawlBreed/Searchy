import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Keyboard, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmptyButton, TextDefault } from '../../../components'
import { alignment, colors, scale, textStyles } from '../../../utilities'
import styles from './styles'

function Price() {
    const navigation = useNavigation()
    const [margin, marginSetter] = useState(false)
    const [price, serPrice] = useState('')
    const [focus, setFocus] = useState(false)
    const [adColor, setAdColor] = useState(colors.fontPlaceholder)

    useEffect(() => {
        navigation.setOptions({
            title: 'Set a price'
        })
    }, [])

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);
    function _keyboardDidShow() {
        marginSetter(true)
    }
    function _keyboardDidHide() {
        marginSetter(false)
    }
    return (
        <SafeAreaView edges={['bottom']} style={[styles.flex, styles.safeAreaview]}>
            <KeyboardAvoidingView style={[styles.flex]}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={[styles.flex, styles.mainContainer, { paddingBottom: Platform.OS === 'ios' ? margin ? scale(100) : 0 : 0 }]}>
                    <View style={styles.flex}>
                        <View style={[styles.inputBorder, { borderBottomColor: adColor }]}>
                            <View style={styles.leftText}>
                                <TextDefault textColor={colors.fontSecondColor} H5 >
                                    {'RS'}
                                </TextDefault>
                            </View>
                            <TextInput style={[styles.flex, { ...textStyles.H4 }]}
                                textAlignVertical='center'
                                placeholder={focus ? '' : 'Price'}
                                placeholderTextColor={colors.fontThirdColor}
                                value={price}
                                keyboardType={'phone-pad'}
                                onFocus={() => {
                                    setFocus(true)
                                    setAdColor(colors.selectedText)
                                }}
                                onBlur={() => {
                                    setFocus(false)
                                    setAdColor(colors.fontThirdColor)
                                }}
                                onChangeText={text => serPrice(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.buttonView}>
                        <EmptyButton
                            disabled={!price}
                            title='Next'
                            onPress={() => {
                                if (!!price)
                                    navigation.navigate('LocationConfirm')
                            }} />
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
export default React.memo(Price) 