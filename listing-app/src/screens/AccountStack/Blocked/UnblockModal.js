import React, { useEffect, useState } from 'react'
import { Modal, View, TouchableOpacity } from 'react-native'
import { alignment } from '../../../utilities'
import styles from './styles'
import { updateUserProperty } from '../../../firebase'
import { useSelector, useDispatch } from 'react-redux'
import { setBlockedUsers } from '../../../store/reducers/User/userSlice'
import { useNavigation } from '@react-navigation/native'
import { FlashMessage, TextDefault } from '../../../components'

function UnblockModal(props) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const { uid } = useSelector(state => state.user)

    async function handleUnblockUser() {
        try {
            await updateUserProperty(uid, 'blockedUsers', props.blockedUsers)
            .then((res) => {
                if (!res) {
                    throw new Error('Failed to delete user profile');
                }          
            })
            .then(() => {
                dispatch(setBlockedUsers(props.blockedUsers))
                FlashMessage({ message: 'Потребителя е успешно отблокиран.', type: 'success' })
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
                        {'Отблокиране на потребител?'}
                    </TextDefault>
                    <TextDefault style={alignment.MTmedium}>
                        {'Сигурни ли сте, че искате да отблокирате потребителя?'}
                    </TextDefault>
                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={styles.button} onPress={props.onModalToggle}>
                            <View style={styles.buttonText}>
                                <TextDefault bold H5>
                                    {'Отказ'}
                                </TextDefault>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleUnblockUser}>
                            <View style={styles.buttonText}>
                                <TextDefault bold H5>
                                    {'Отблокирай'}
                                </TextDefault>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default React.memo(UnblockModal)