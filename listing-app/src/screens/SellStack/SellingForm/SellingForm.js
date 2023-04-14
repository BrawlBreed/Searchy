import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmptyButton, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './styles'

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
const Type = [
    {
        value: 2,
        title: 'Apple'
    },
    {
        value: 3,
        title: 'Danny Tabs'
    },
    {
        value: 4,
        title: 'Q Tabs'
    },
    {
        value: 5,
        title: 'Samsung'
    },
    {
        value: 6,
        title: 'Other Tablets'
    },
]

function SellingForm() {
    const navigation = useNavigation()
    const [type, setType] = useState(null)
    const [margin, marginSetter] = useState(false)
    const [condition, setCondition] = useState(null)
    const [adColor, setAdColor] = useState(colors.fontMainColor)
    const [descriptionColor, setDescriptionColor] = useState(colors.fontMainColor)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [typeError, setTypeError] = useState(null)
    const [titleError, setTitleError] = useState(null)
    const [conditionError, setConditionError] = useState(null)
    const [descriptionError, setDescriptionError] = useState(null)

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

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


    function onChange(setter, errorSetter, value) {
        setter(value)
        errorSetter(null)
    }

    function validate() {
        let result = true
        if (title.length < 1) {
            setTitleError('This is mandatory. Please complete the required field.')
            result = false
        }
        if (description.length < 1) {
            setDescriptionError('This is mandatory. Please complete the required field.')
            result = false
        }
        if (type === null) {
            setTypeError('This is mandatory. Please complete the required field.')
            result = false
        }
        if (condition === null) {
            setConditionError('This is mandatory. Please complete the required field.')
            result = false
        }
        return result
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
                                <TextDefault textColor={conditionError ? colors.google : colors.fontMainColor} H5 bold style={styles.width100}>
                                    {'Condition *'}
                                </TextDefault>
                                <View style={styles.subContainerRow}>
                                    {CONDITIONS.map((item, index) => (
                                        <TouchableOpacity key={item.value}
                                            style={[styles.conditionBox, styles.boxContainer, item.value === condition ? styles.selected : styles.notSelected]}
                                            onPress={() => onChange(setCondition, setConditionError, item.value)}>
                                            <TextDefault style={item.value === condition ? styles.selectedText : styles.unSelectedText}>
                                                {item.title}
                                            </TextDefault>
                                        </TouchableOpacity>
                                    ))
                                    }
                                </View>
                                {conditionError &&
                                    <TextDefault textColor={colors.google} style={styles.width100}>
                                        {conditionError}
                                    </TextDefault>
                                }
                            </View>
                            <View style={styles.line} />
                            <View style={[styles.width100, styles.subContainer]}>
                                <TextDefault textColor={typeError ? colors.google : colors.fontMainColor} H5 bold style={styles.width100}>
                                    {'Type *'}
                                </TextDefault>
                                <ScrollView
                                    contentContainerStyle={styles.scrollviewContent}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}>
                                    {Type.map((item, index) => (
                                        <TouchableOpacity key={item.value}
                                            style={[styles.typeBox, styles.boxContainer, item.value === type ? styles.selected : styles.notSelected]}
                                            onPress={() => onChange(setType, setTypeError, item.value)}>
                                            <TextDefault style={item.value === type ? styles.selectedText : styles.unSelectedText}>
                                                {item.title}
                                            </TextDefault>
                                        </TouchableOpacity>
                                    ))
                                    }
                                </ScrollView>
                                {typeError &&
                                    <TextDefault textColor={colors.google} style={styles.width100}>
                                        {typeError}
                                    </TextDefault>
                                }
                            </View>
                            <View style={styles.line} />
                            <View style={styles.subContainer}>
                                <TextDefault textColor={titleError ? colors.google : adColor} H5 bold style={styles.width100}>
                                    {'Ad title *'}
                                </TextDefault>
                                <View style={[styles.textContainer, { borderColor: adColor }]}>
                                    <TextInput
                                        style={styles.inputText}
                                        maxLength={70}
                                        onFocus={() => {
                                            setTitleError(null)
                                            setAdColor(colors.selectedText)
                                        }}
                                        onBlur={() => setAdColor(colors.fontMainColor)}
                                        onChangeText={text => setTitle(text)}
                                        placeholderTextColor={colors.fontSecondColor}
                                        placeholder={'Key Features of your item '}
                                    />
                                </View>
                                <TextDefault light small right style={alignment.MTxSmall}>
                                    {title.length + '/ 70'}
                                </TextDefault>
                                {titleError &&
                                    <TextDefault textColor={colors.google} style={styles.width100}>
                                        {titleError}
                                    </TextDefault>
                                }
                            </View>
                            <View style={styles.line} />
                            <View style={styles.subContainer}>
                                <TextDefault textColor={descriptionError ? colors.google : descriptionColor} H5 bold style={styles.width100}>
                                    {'Additional information *'}
                                </TextDefault>
                                <View style={[styles.descriptionContainer, { borderColor: descriptionColor }]}>
                                    <TextInput
                                        style={styles.inputText}
                                        maxLength={4096}
                                        multiline={true}
                                        onFocus={() => {
                                            setDescriptionError(null)
                                            setDescriptionColor(colors.selectedText)
                                        }}
                                        onBlur={() => setDescriptionColor(colors.fontMainColor)}
                                        onChangeText={text => setDescription(text)}
                                        placeholderTextColor={colors.fontSecondColor}
                                        placeholder={'Include condition, features and reasons for selling '}
                                    />
                                </View>
                                <TextDefault light small right style={alignment.MTxSmall}>
                                    {description.length + '/ 4096'}
                                </TextDefault>
                                {descriptionError &&
                                    <TextDefault textColor={colors.google} style={styles.width100}>
                                        {descriptionError}
                                    </TextDefault>
                                }
                            </View>
                        </View>
                        <View style={styles.buttonView}>
                            <EmptyButton
                                title='Next'
                                onPress={() => {
                                    if (validate())
                                        navigation.navigate('UploadImage')
                                }} />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView >
        </SafeAreaView >
    )
}
export default React.memo(SellingForm)