import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Modal, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, scale } from '../../../utilities';
import { TextDefault } from '../../Text';
import styles from './styles';
 
const CATEGORY = ['Мобилни Устройства', 'Недвижими Имоти', 'Коли', 'Телевизори', 'Мебели']

function SearchModal(props) {
    const [ input, setInput ] = useState('')
    const inset = useSafeAreaInsets()
    const navigation = useNavigation()

    function navigate(input) {
        navigation.navigate('ProductListing', { search: input ?? 'View All', input: input ?? null })
        props.onModalToggle()
    }

    function header() {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerContents}>
                    <View style={styles.closeBtn}>
                        <TouchableOpacity
                            onPress={() => {
                                props.onModalToggle()
                            }}
                            style={styles.backBtn}>
                            <Ionicons
                                name="ios-arrow-back"
                                size={scale(23)}
                                color={colors.headerText}
                            />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.inputText}
                            placeholderTextColor={colors.fontSecondColor}
                            placeholder={'Мобилен Телефон, Недвижим Имот и др.'}
                            value={input}
                            onChangeText={setInput}
                        />
                        <TouchableOpacity
                            onPress={() => navigate(input)}
                            style={styles.searchBtn} >
                            <Ionicons
                                name="ios-search"
                                size={scale(20)}
                                color={colors.white}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        )
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
        >
            <View style={[
                styles.safeAreaViewStyles,
                styles.flex,
                { paddingTop: inset.top, paddingBottom: inset.bottom }]}>
                <View style={[styles.flex, styles.mainContainer]}>
                    {header()}
                    <View style={styles.body}>
                        <TextDefault textColor={colors.fontSecondColor} light uppercase>
                            {'Popular categories'}
                        </TextDefault>
                        {CATEGORY.map((item, index) => (
                            <TouchableOpacity
                                onPress={() => navigate(item)}
                                style={styles.category}
                                key={index}>
                                <Ionicons
                                    name="ios-search"
                                    size={scale(20)}
                                    color={colors.buttonbackground}
                                />
                                <TextDefault textColor={colors.fontSecondColor} H5 style={styles.fontText}>
                                    {item}
                                </TextDefault>
                            </TouchableOpacity>
                        )
                        )}
                    </View>
                </View>
            </View>
        </Modal >
    )
}
export default SearchModal