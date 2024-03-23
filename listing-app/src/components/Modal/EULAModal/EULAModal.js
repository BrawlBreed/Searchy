import React, { useEffect, useState } from 'react';
import { ScrollView, SafeAreaView, TouchableOpacity, View, Text, Modal, Alert } from 'react-native';
import { EULA } from '../../../utilities/methods';
import ModalHeader from '../../Header/ModalHeader/ModalHeader';
import { colors } from '../../../utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';

function EULAModal({ onModalToggle, visible }) {
    const [isAtBottom, setIsAtBottom] = useState(false);

    function RejectEULA() {
        // Display an alert or open a modal informing the user they must accept to proceed
        Alert.alert(
            "EULA Required",
            "You must agree to the End-User License Agreement to use this application.",
            [
                {
                    text: "Review EULA",
                },
            ],
            { cancelable: false }
        );
    }
        
    const agreeToTerms = async () => {
        try {
            await AsyncStorage.setItem('EULA_KEY', 'true');
            onModalToggle();
        } catch (e) {
            // saving error
            Alert.alert('Грешка', 'Моля приемете условията на EULA за да ползвате на приложението');
        }
    };

    const checkScroll = (event) => {
        const paddingToBottom = 20;
        setIsAtBottom(
            event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y >=
            event.nativeEvent.contentSize.height - paddingToBottom
        );
    };

    return (
        <Modal animationType="slide" visible={visible}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <ModalHeader closeModal={onModalToggle} title={'EULA Terms Policy'} />
                    <ScrollView
                        style={styles.scrollView}
                        onScroll={checkScroll}
                        scrollEventThrottle={400}
                        showsVerticalScrollIndicator={true}>
                        <Text style={styles.eulaText}>
                            {EULA}
                        </Text>
                    </ScrollView>
                    <View style={styles.footer}>
                        <TouchableOpacity style={[styles.button]} onPress={RejectEULA}>
                            <Text style={styles.buttonText}>{'Reject'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, isAtBottom ? styles.buttonActive : styles.buttonInactive]}
                            onPress={agreeToTerms}
                            disabled={!isAtBottom}>
                            <Text style={styles.buttonText}>{'Agree'}</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

// Styles (add to your existing styles)
const styles = {
    safeArea: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        marginHorizontal: 20
    },
    scrollView: {
        marginVertical: 20
    },
    eulaText: {
        fontSize: 16,
        lineHeight: 24
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20
    },
    button: {
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
        backgroundColor: colors.messageBackground
    },
    buttonActive: {
        backgroundColor: colors.searchy2
    },
    buttonInactive: {
        backgroundColor: '#e0e0e0'
    },
    buttonText: {
        color: colors.white,
        fontWeight: 'bold'
    }
};

export default EULAModal
