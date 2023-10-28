import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmptyButton, LocationModal, TextDefault } from '../../../components'
import { alignment, colors, scale } from '../../../utilities'
import { setZoneId, setCurrentCoordinates, setAddress } from '../../../store/reducers/Item/addItemSlice'
import styles from './styles'
import MapView, { Marker } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import { GEOAPIFY_API_KEY } from '../../../../Constants'

function LocationConfirm() {
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false);
    const [filters, setFilters] = useState('')
    const [ input, setInput ] = useState('')
    const state = useSelector(state => state.addItem)
    const { coordinates } = useSelector(state => state.addItem.address)
    const dispatch = useDispatch()

    useEffect(() => {
        navigation.setOptions({
            title: 'Изберете местоположение'
        })
    }, [])

    useEffect(() => {
        dispatch(setAddress(input))
    }, [input])

    useEffect(() => {
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${Number(coordinates.latitude)}&lon=${Number(coordinates.longitude)}&apiKey=${GEOAPIFY_API_KEY}`)
        .then(response => response.json())
        .then(result => {
            if (result.features.length) {
                setInput(result.features[0].properties.formatted);
            } else {
                console.log("No address found");
            }
        });
    }, [coordinates])

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
                            {'Местоположение'}
                        </TextDefault>
                        <TextDefault light style={[alignment.PLxSmall, alignment.MTxSmall]}>
                            {filters ? filters : 'Предложения'}
                        </TextDefault>
                    </View>
                    <Entypo name="chevron-small-right" size={scale(20)} color={colors.buttonbackground} />
                </TouchableOpacity>
                <View style={{ height: '70%', width: '100%'}}>
                    <MapView initialRegion={{
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005
                        }}
                        onDoublePress={(e) => {
                            dispatch(setCurrentCoordinates({
                                latitude: e.nativeEvent.coordinate.latitude,
                                longitude: e.nativeEvent.coordinate.longitude 
                            }))
                        }}
                        style={{width: 'auto', height: 200, flexGrow: 1}}
                        >
                            <Marker
                                coordinate={{ latitude: coordinates.latitude, longitude: coordinates.longitude }}
                                title='Местоположение'
                                description={''}
                                identifier='местоположение'
                            />
                    </MapView>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Entypo size={20} style={{ margin: 5}} name='map' />
                        <TextDefault style={{textAlign: 'center'}}>{input}</TextDefault>
                    </View>
                </View>
                <View style={styles.buttonView}>
                    <EmptyButton
                        title='Следваща стъпка'
                        onPress={() => {
                            navigation.navigate('AdPosting')
                        }} />
                </View>
            </View>  
            <LocationModal setFilters={setFilters} visible={modalVisible} onModalToggle={toggleModal} />
        </SafeAreaView>
    )
}
export default LocationConfirm 