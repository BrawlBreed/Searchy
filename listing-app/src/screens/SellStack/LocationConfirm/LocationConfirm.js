import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmptyButton, LocationModal, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import styles from './styles'

function LocationConfirm() {
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false);
    const [filters, setFilters] = useState('')

    useEffect(() => {
        navigation.setOptions({
            title: 'Confirm your location'
        })
    }, [])

    function toggleModal() {
        setModalVisible(prev => !prev)
    }
    return (
        <SafeAreaView edges={['bottom']} style={[styles.flex, styles.safeAreaview]}>
            <View style={[styles.flex, styles.mainContainer]}>
                <TouchableOpacity style={styles.smallContainer}
                    onPress={() => toggleModal()}>
                    <View style={[styles.flex]}>
                        <TextDefault bold H5 style={alignment.PLxSmall}>
                            {'Location'}
                        </TextDefault>
                        <TextDefault light style={[alignment.PLxSmall, alignment.MTxSmall]}>
                            {filters ? filters : 'Recommendation & special communication'}
                        </TextDefault>
                    </View>
                    <Entypo name="chevron-small-right" size={scale(20)} color={colors.buttonbackground} />
                </TouchableOpacity>

                <View style={styles.buttonView}>
                    <EmptyButton
                        title='Next'
                        onPress={() => {
                            navigation.navigate('AdPosting')
                        }} />
                </View>

            </View>
            <LocationModal setFilters={setFilters} visible={modalVisible} onModalToggle={toggleModal} />
        </SafeAreaView>
    )
}
export default React.memo(LocationConfirm) 