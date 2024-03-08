import React from 'react'
import { Modal, View, TouchableOpacity } from 'react-native'
import { alignment } from '../../../utilities'
import { TextDefault } from '../../Text'
import styles from './styles'

function UnfollowModal(props) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.modalVisible}
        >
            <TouchableOpacity activeOpacity={1} onPress={props.onModalToggle} style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TextDefault bolder H5 style={{ width: '100%' }}>
                        {`Наистина ли искате да отпоследвате ${props.name} ?`}
                    </TextDefault>
                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={styles.button} onPress={props.onModalToggle}>
                            <View style={styles.buttonText}>
                                <TextDefault bold H5>
                                    {'Отказ'}
                                </TextDefault>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={props.unfollow}>
                            <View style={styles.buttonText}>
                                <TextDefault bold H5>
                                    {'Отпоследвай'}
                                </TextDefault>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

export default React.memo(UnfollowModal)