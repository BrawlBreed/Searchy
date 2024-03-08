import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Modal, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, scale } from '../../../utilities';
import { FlashMessage } from '../../FlashMessage/FlashMessage';
import ModalHeader from '../../Header/ModalHeader/ModalHeader';
import RadioButton from '../../RadioBtn/RadioBtn';
import { TextDefault } from '../../Text';
import styles from './styles';
import { SEND_REPORT } from '../../../apollo/server';
import { client } from '../../../apollo';

const REPORT_OPTIONS = [
    {
        value: 0,
        title: 'Неподходящо съдържание'
    },
    {
        value: 1,
        title: 'Измамен продавач'
    },
    {
        value: 2,
        title: 'Повтаряща се обява'
    },
    {
        value: 3,
        title: 'Продукта вече е продаден'
    },
    {
        value: 4,
        title: 'Друго'
    }, 
]

function ReportModal({ uid, adId, id, ...props}) {
    const inset = useSafeAreaInsets()
    const [check, setCheck] = useState(null)
    const [additionalInfo, setAdditionalInfo] = useState('')
    const [margin, marginSetter] = useState(false)

    useEffect(() => {
        console.log(uid, adId, id)
    }, [])

    async function Send() {
        if(check === null) {
            FlashMessage({ message: 'Не сте дали причина за докладване на потребителя!', type: 'danger' })
        }else{
            try{
                await client.mutate({
                    mutation: SEND_REPORT,
                    variables: {
                        userId: uid,
                        itemId: adId,
                        reason: REPORT_OPTIONS[check].title,
                        additionalInfo: additionalInfo,
                        sentAt: new Date().toISOString()
                    }
                })    
                FlashMessage({ message: 'Благодарим за информацията!', type: 'success' })
            }catch(err){
                console.log(err)
                FlashMessage({ message: 'Нещо се обърка, моля опитайте по-късно!', type: 'warning' })
            }
        }
        props.onModalToggle()
    }
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

    function footerView() {
        return (
            <View style={[styles.footerView, { marginBottom: 20 } ]}>
                <TextInput
                    style={styles.textInput}
                    placeholderTextColor={colors.fontThirdColor}
                    placeholder='Допълнителна информация'
                    value={additionalInfo}
                    onChangeText={(text) => setAdditionalInfo(text)}
                />
                <View style={[styles.buttonsRow]}>
                    <TouchableOpacity style={styles.button} onPress={() => props.onModalToggle()}>
                        <View style={styles.buttonText}>
                            <TextDefault>
                                {'Отказ'}
                            </TextDefault>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={Send}>
                        <View style={styles.buttonText}>
                            <TextDefault>
                                {'Изпрати'}
                            </TextDefault>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
        >
            <SafeAreaView edges={['top', 'bottom']} style={[
                styles.safeAreaViewStyles,
                styles.flex, { paddingTop: 30}]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.flex}>
                    <View style={[styles.flex, styles.mainContainer, { paddingBottom: margin ? scale(50) : scale(0) }]}>
                        <ModalHeader closeModal={props.onModalToggle} title={'Докладване'} />
                        <FlatList 
                            data={REPORT_OPTIONS}
                            contentContainerStyle={{ flexGrow: 1 }}
                            style={styles.body}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={styles.stateBtn}
                                    onPress={() => setCheck(item.value)}>
                                    <RadioButton
                                        size={13}
                                        animation={'bounceIn'}
                                        isSelected={item.value === check}
                                        onPress={() => setCheck(item.value)}
                                    />
                                    <TextDefault style={[styles.flex, styles.font]} >
                                        {item.title}
                                    </TextDefault>
                                </TouchableOpacity>
                            )} />

                        {footerView()}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal >
    )
}
export default React.memo(ReportModal)