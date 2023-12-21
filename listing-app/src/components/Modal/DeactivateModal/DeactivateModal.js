import React, { useEffect } from 'react'
import { Modal, View, TouchableOpacity } from 'react-native'
import { alignment } from '../../../utilities'
import { TextDefault } from '../../Text'
import styles from './styles'
import { deleteProfile } from '../../../firebase'
import { useSelector, useDispatch } from 'react-redux'
import { DELETE_PROFILE, DELETE_ITEM } from '../../../apollo/server'
import { useMutation  } from '@apollo/client'
import { logout } from '../../../store/reducers/User/userSlice'
import { useNavigation } from '@react-navigation/native'
import { FlashMessage } from '../../FlashMessage/FlashMessage'

function DeactivateModal(props) {
    const { ownedItems, uid } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [deleteUserProfile, { loading: deletingProfile }] = useMutation(DELETE_PROFILE);
    const [deleteUserItem, { loading: deletingItem }] = useMutation(DELETE_ITEM);
    const navigation = useNavigation()

    async function handleDeleteProfile() {
        try {
            await deleteProfile()
            .then((res) => {
                if (!res) {
                    throw new Error('Failed to delete user profile');
                }          
            })
            .then(async () => {
                await deleteUserProfile({ variables: { uid: uid } })
            })
            .then(async () => {            
                // Then, delete the user's owned items
                let filteredOwnedItems = ownedItems.filter(ownedItem => ownedItem !== '');
                filteredOwnedItems = Array.from(new Set(filteredOwnedItems));
            
                const ownedItemsPromises = filteredOwnedItems.map(ownedItemId =>
                    deleteUserItem({ variables: { id: ownedItemId } }).then(response => response.data.deleteUserItem)
                );
            
                const dataList = await Promise.all(ownedItemsPromises);
                console.log('Deleted items:', dataList);
            })
            .then(() => {
                FlashMessage({ message: 'Успешно изтрихте потребителя си!.', type: 'success' })
                dispatch(logout())
                navigation.navigate('Registration')
            })
            .finally(() => {
                props.onModalToggle()
            })
            .catch((error) => {
                throw new Error('Failed to delete user profile');
            })
        } catch (error) {
            FlashMessage({ message: 'Нещо се обърка! Опитайте отново по-късно.', type: 'danger' })
            console.error('Error during profile deletion process:', error);
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
                        {'Изтриване на акаунт?'}
                    </TextDefault>
                    <TextDefault style={alignment.MTmedium}>
                        {'Сигурни ли сте, че искате да изтриете акаунта си?'}
                    </TextDefault>
                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={styles.button} onPress={props.onModalToggle}>
                            <View style={styles.buttonText}>
                                <TextDefault bold H5>
                                    {'Отказ'}
                                </TextDefault>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleDeleteProfile}>
                            <View style={styles.buttonText}>
                                <TextDefault bold H5>
                                    {'Изтрий'}
                                </TextDefault>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default React.memo(DeactivateModal)