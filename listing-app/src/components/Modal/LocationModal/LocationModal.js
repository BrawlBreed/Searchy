import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { alignment, colors, scale } from '../../../utilities';
import ModalHeader from '../../Header/ModalHeader/ModalHeader';
import { TextDefault } from '../../Text';
import styles from './styles';
import { getZones } from '../../../apollo/server';
import { useQuery } from '@apollo/client';
import { setZoneId, setCurrentCoordinates } from '../../../store/reducers/AddItem/addItemSlice';
import { useDispatch } from 'react-redux';

function LocationModal(props) {
    const [input, setInput] = useState('') 
    const [coordinates, setCoordinates] = useState({})
    const [currentLocation, setCurrentLocation] = useState('')
    const [zones, setZones] = useState()
    const { loading, error, data } = useQuery(getZones, {
        variables: {},
      })
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setCurrentCoordinates(coordinates))
        dispatch(setZoneId(currentLocation))
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
            return item.value.title.toLowerCase().includes(input.toLowerCase())
        }))
    }, [input])

    function btnLocation(title) {
        props.setFilters(title)
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
                                <TouchableOpacity style={styles.currentLocation} onPress={() => btnLocation(currentLocation)}>
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
                                    onPress={() => btnLocation(value.title)} >
                                    <TextDefault style={styles.flex} >
                                        {value.title}
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