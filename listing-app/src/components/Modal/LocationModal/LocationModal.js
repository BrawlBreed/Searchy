import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Modal, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { alignment, colors, scale } from '../../../utilities';
import ModalHeader from '../../Header/ModalHeader/ModalHeader';
import { TextDefault } from '../../Text';
import styles from './styles';

const STATE = ['All in Pakistan', 'Azad Kashmir', 'Balochistan', 'Islamabad Capital territory', 'Khybar Pakhtunkha', 'Northen Area', 'Punjab', 'Sindh']

function LocationModal(props) {
    const inset = useSafeAreaInsets()
    const loading = false

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
                        <ModalHeader closeModal={props.onModalToggle} title={'Location'} />
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
                                        placeholder={'Search city, area or neighbour'}
                                    />
                                </View>
                                <TouchableOpacity style={styles.currentLocation} onPress={() => btnLocation('E11/2')}>
                                    <MaterialCommunityIcons name="target" size={scale(25)} color={colors.spinnerColor} />
                                    <View style={alignment.PLsmall}>
                                        <TextDefault textColor={colors.spinnerColor} H5 bold>
                                            {'Use current location'}
                                        </TextDefault>
                                        <TextDefault numberOfLines={1} textColor={colors.fontMainColor} light small style={{ ...alignment.MTxSmall, width: '85%' }}>
                                            {loading ? 'Fetching location...' : 'E11/2'}
                                        </TextDefault>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TextDefault textColor={colors.fontSecondColor} uppercase style={styles.title}>
                                {'Choose State'}
                            </TextDefault>
                        </View>
                        <FlatList
                            contentContainerStyle={alignment.PBlarge}
                            showsVerticalScrollIndicator={false}
                            data={STATE}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={styles.stateBtn}
                                    onPress={() => btnLocation(item)} >
                                    <TextDefault style={styles.flex} >
                                        {item}
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
export default React.memo(LocationModal)