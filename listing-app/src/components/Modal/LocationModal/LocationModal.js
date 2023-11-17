import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { alignment, colors, scale } from '../../../utilities';
import ModalHeader from '../../Header/ModalHeader/ModalHeader';
import { TextDefault } from '../../Text';
import styles from './styles';
import addZone from '../../../hooks/addZone';
import { setZone, setCurrentCoordinates, setZoneId } from '../../../store/reducers/Item/addItemSlice';
import { useDispatch } from 'react-redux';

function LocationModal(props) {
    const [input, setInput] = useState('') 
    const [coordinates, setCoordinates] = useState({
        latitude: 0,
        longitude: 0 
    })
    const [currentLocation, setCurrentLocation] = useState('')
    const [zones, setZones] = useState()
    const dispatch = useDispatch()
    const { data, loading, error } = addZone()

    useEffect(() => {
        dispatch(setCurrentCoordinates(coordinates))
        dispatch(setZone({
            zone: currentLocation,
            coordinates: coordinates
        }))
    }, [currentLocation, coordinates])

    useEffect(() => {
        fetch('https://geolocation-db.com/json/')
        .then(response => response.json())
        .then(data => {
            setCoordinates({
                latitude: data.latitude,  
                longitude: data.longitude
            })
            setCurrentLocation(data.city)
        })
        .catch(error => console.log(error))  
        if(!data) return
        if(data.getZones) setZones(data.getZones)
    }, [data])

    useEffect(() => {
        setZones(data?.getZones.filter((item) => {
            return item.value.zone?.toLowerCase().includes(input?.toLowerCase())
        }))
    }, [input]) 

    function btnLocation(zone) {
        console.log('pressed')
        dispatch(setZoneId(zone.name))
        dispatch(setZone({
            zone: zone.zone, 
            coordinates: zone.coordinates
        }))
        props.onModalToggle()
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
        >
            <SafeAreaView edges={['top', 'bottom']} style={[
                styles.safeAreaViewStyles,
                styles.flex]}>
                <KeyboardAvoidingView style={[styles.flex]}
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <View style={[styles.flex, styles.mainContainer]}>
                        <ModalHeader closeModal={props.onModalToggle} title={'Местоположение'} />
                        <View style={styles.body}>
                            <View style={styles.headerContents}>
                                <View style={styles.closeBtn}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            props.onModalToggle()
                                        }}
                                        style={styles.backBtn}>
                                        <Ionicons
                                            name="ios-search"
                                            size={scale(17)}
                                            color={colors.headerText}
                                        />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={styles.inputAddress}
                                        placeholderTextColor={colors.fontSecondColor}
                                        placeholder={'Търси градове, местности и др.'}
                                        onChangeText={setInput}
                                        value={input}
                                    />
                                </View>
                                <TouchableOpacity style={styles.currentLocation} onPress={() => btnLocation({
                                    zone: currentLocation,
                                    coordinates: coordinates
                                })}>
                                    <MaterialCommunityIcons name="target" size={scale(25)} color={colors.spinnerColor} />
                                    <View style={alignment.PLsmall}>
                                        <TextDefault textColor={colors.spinnerColor} H5 bold>
                                            {'Текущо местоположение'}
                                        </TextDefault>
                                        <TextDefault numberOfLines={1} textColor={colors.fontMainColor} light small style={{ ...alignment.MTxSmall, width: '85%' }}>
                                            {loading ? 'Обработване на локацията...' : props.locationText}
                                        </TextDefault>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TextDefault textColor={colors.fontSecondColor} uppercase style={styles.title}>
                                {'Избери град'}
                            </TextDefault>
                        </View>
                        <FlatList
                            contentContainerStyle={alignment.PBlarge}
                            showsVerticalScrollIndicator={false}
                            data={zones}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item: {value, name}, index }) => (
                                <TouchableOpacity
                                    style={styles.stateBtn}
                                    onPress={() => btnLocation(value)} >
                                    <TextDefault style={styles.flex} >
                                        {value.zone}
                                    </TextDefault>
                                    <Entypo name="chevron-small-right" size={scale(20)} color={colors.fontMainColor} />
                                </TouchableOpacity>
                            )} />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal >
    )
}
export default LocationModal