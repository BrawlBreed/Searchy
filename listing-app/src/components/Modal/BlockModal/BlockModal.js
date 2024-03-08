import React, { useEffect, useState } from 'react'
import { Modal, View, TouchableOpacity } from 'react-native'
import { alignment } from '../../../utilities'
import { TextDefault } from '../../Text'
import styles from './styles'
import { updateUserProperty } from '../../../firebase'
import { useSelector, useDispatch } from 'react-redux'
import { FlashMessage } from '../../FlashMessage/FlashMessage'
import { setBlockedUsers } from '../../../store/reducers/User/userSlice'
import { useNavigation } from '@react-navigation/native'

function BlockModal(props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { uid } = useSelector(state => state.user)

    async function handleBlockUser() {
        try {
            await updateUserProperty(uid, 'blockedUsers', props.blockedUsers)
            .then((res) => {
                if (!res) {
                    throw new Error('Failed to delete user profile');
                }          
            })
            .then(() => {
                dispatch(setBlockedUsers(props.blockedUsers))
                FlashMessage({ message: 'Потребителя е успешно блокиран.', type: 'success' })
            })
            .finally(() => {
                props.onModalToggle()
                navigation.goBack()
            })
            .catch((error) => {
                throw new Error('Failed to delete user profile');
            })
        } catch (error) {
            FlashMessage({ message: 'Нещо се обърка! Опитайте отново по-късно.', type: 'danger' })
            console.error('Error during profile blocking process:', error);
        }

    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TextDefault bolder H4 style={{ width: '100%' }}>
                        {'Блокиране на потребител?'}
                    </TextDefault>
                    <TextDefault style={alignment.MTmedium}>
                        {'Сигурни ли сте, че искате да блокирате потребителя?'}
                    </TextDefault>
                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={styles.button} onPress={props.onModalToggle}>
                            <View style={styles.buttonText}>
                                <TextDefault bold H5>
                                    {'Отказ'}
                                </TextDefault>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleBlockUser}>
                            <View style={styles.buttonText}>
                                <TextDefault bold H5>
                                    {'Блокирай'}
                                </TextDefault>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default React.memo(BlockModal)