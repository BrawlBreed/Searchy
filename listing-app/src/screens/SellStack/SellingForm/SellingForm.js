import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmptyButton, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './styles'
import { useDispatch, useSelector } from 'react-redux'
import {   
    changeTitle,
    changeDescription,
    changePrice,
    changeCondition,
    setSubCategoryId,
   } from '../../../store/reducers/AddItem/addItemSlice'
import { validateSellingForm } from './validate'

const CONDITIONS = [
    {
        value: 0,
        title: 'New'
    },
    {
        value: 1,
        title: 'Used'
    },
]
const initalState = {
    title: '',
    description: '',
    price: '',
    condition: ''
}
function SellingForm({ route }) {
    const navigation = useNavigation()
    const [margin, marginSetter] = useState(false)
    const [adColor, setAdColor] = useState(colors.fontMainColor)
    const [descriptionColor, setDescriptionColor] = useState(colors.fontMainColor)
    const [errors, setErrors] = useState(initalState)
    const state = useSelector(state => state.addItem)
    const { title, description, condition, price } = state
    const dispatch = useDispatch();

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
        dispatch(setSubCategoryId(route.params.types._id))

        // cleanup function
        return () => {
            Keyboard.removeAllListeners("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeAllListeners("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    function _keyboardDidShow() {
        marginSetter(true)
    }
    function _keyboardDidHide() {
        marginSetter(false)
    }

    function handleSubmit () {
        let valid = true
        setErrors(validateSellingForm(state, errors))
        for (const key in errors) {
            if(errors[key]) valid = false
        }
        if(valid) {
            navigation.navigate('UploadImage')
        }
    }

    return (
        <SafeAreaView edges={['bottom']} style={[styles.flex, styles.safeAreaview]}>
            <KeyboardAvoidingView style={[styles.flex, styles.mainContainer]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                contentContainerStyle={{ flexGrow: 1 }}>
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: margin ? scale(75) : 0 }}
                    style={[styles.flex, styles.mainContainer]}>
                    <View style={[styles.flex, { justifyContent: "space-between" }]}>
                        <View>
                            <View style={[styles.width100, styles.subContainer]}>
                                <TextDefault textColor={errors.condition ? colors.google : colors.fontMainColor} H5 bold style={styles.width100}>
                                    {'Състояние *'}
                                </TextDefault>
                                <View style={styles.subContainerRow}>
                                    {CONDITIONS.map((item, index) => (
                                        <TouchableOpacity key={item.value}
                                            style={[styles.conditionBox, styles.boxContainer, item.title === condition ? styles.selected : styles.notSelected]}
                                            onPress={() => dispatch(changeCondition(item.title))}>
                                            <TextDefault style={item.value === condition ? styles.selectedText : styles.unSelectedText}>
                                                {item.title}
                                            </TextDefault>
                                        </TouchableOpacity>
                                    ))
                                    }
                                </View>
                                {errors.condition &&
                                    <TextDefault textColor={colors.google} style={styles.width100}>
                                        {errors.condition}
                                    </TextDefault>
                                }
                            </View>
                            <View style={styles.line} />
                            <View style={styles.line} />
                            <View style={styles.subContainer}>
                                <TextDefault textColor={errors.title ? colors.google : adColor} H5 bold style={styles.width100}>
                                    {'Заглавие *'}
                                </TextDefault>
                                <View style={[styles.textContainer, { borderColor: adColor }]}>
                                    <TextInput
                                        style={styles.inputText}
                                        maxLength={70}
                                        onFocus={() => {
                                            setAdColor(colors.selectedText)
                                        }}
                                        onBlur={() => setAdColor(colors.fontMainColor)}
                                        onChangeText={(text) => dispatch(changeTitle(text))}
                                        value={title}
                                        placeholderTextColor={colors.fontSecondColor}
                                        placeholder={'Заглавие на обявата'}
                                    />
                                </View>
                                <TextDefault light small right style={alignment.MTxSmall}>
                                    {title.length + '/ 70'}
                                </TextDefault>
                                {errors.title &&
                                    <TextDefault textColor={colors.google} style={styles.width100}>
                                        {errors.title}
                                    </TextDefault>
                                }
                            </View>
                            <View style={styles.subContainer}>
                                <TextDefault textColor={errors.title ? colors.google : adColor} H5 bold style={styles.width100}>
                                    {'Цена *'}
                                </TextDefault>
                                <View style={[styles.textContainer, { borderColor: adColor }]}>
                                    <TextInput
                                        style={styles.inputText}
                                        maxLength={70}
                                        keyboardType="numeric"
                                        onFocus={() => {
                                            setAdColor(colors.selectedText)
                                        }}
                                        onBlur={() => setAdColor(colors.fontMainColor)}
                                        onChangeText={text => {
                                            const numericText = text.replace(/[^0-9]/g, '');
                                            dispatch(changePrice(numericText));
                                          }}
                                        value={price}
                                        placeholderTextColor={colors.fontSecondColor}
                                        placeholder={'Цена на обявата'}
                                    />
                                </View>
                                {errors.price &&
                                    <TextDefault textColor={colors.google} style={styles.width100}>
                                        {errors.price}
                                    </TextDefault>
                                }
                            </View>
                            <View style={styles.line} />
                            <View style={styles.subContainer}>
                                <TextDefault textColor={errors.description ? colors.google : descriptionColor} H5 bold style={styles.width100}>
                                    {'Повече информация *'}
                                </TextDefault>
                                <View style={[styles.descriptionContainer, { borderColor: descriptionColor }]}>
                                    <TextInput
                                        style={styles.inputText}
                                        maxLength={4096}
                                        multiline={true}
                                        onFocus={() => {
                                            setDescriptionColor(colors.selectedText)
                                        }}
                                        onBlur={() => setDescriptionColor(colors.fontMainColor)}
                                        onChangeText={text => dispatch(changeDescription(text))}
                                        value={description}
                                        placeholderTextColor={colors.fontSecondColor}
                                        placeholder={'Подробности за продукта(размер, цвят, и тн.) '}
                                    />
                                </View>
                                <TextDefault light small right style={alignment.MTxSmall}>
                                    {description.length + '/ 4096'}
                                </TextDefault>
                                {errors.description &&
                                    <TextDefault textColor={colors.google} style={styles.width100}>
                                        {errors.description}
                                    </TextDefault>
                                }
                            </View>
                        </View>
                        <View style={styles.buttonView}>
                            <EmptyButton
                                title='Next'
                                onPress={() => handleSubmit()} />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView >
        </SafeAreaView >
    )
}
export default SellingForm