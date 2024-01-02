import { View, Text, Button, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform  } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { Image } from 'react-native'
import ModalComponent from './PaymentModal'

const TIERS = [
    {
        subtotal: 4.99,
        title: 'Начален',
        image: require('../../../../assets/images/promotion/level_low.png'),
        color: '#3fa648',
        background: require('../../../../assets/images/promotion/background_low.png')
    },
    {
        subtotal: 10.99,
        title: 'Стандартен',
        best: true,
        image: require('../../../../assets/images/promotion/level_medium.png'),
        color: '#faa815',
        background: require('../../../../assets/images/promotion/background_medium.png')
    },
    {
        subtotal: 18.99,
        title: 'Професионален',
        image: require('../../../../assets/images/promotion/level_high.png'),
        color: '#e31e26',
        background: require('../../../../assets/images/promotion/background_high.png')
    },
    {
        title: 'По Ваш Избор',
        background: require('../../../../assets/images/promotion/background_custom.png'),
        input: true,
    },
]

const Promote = ({route}) => {
    const { id, promotionScore } = route.params
    const [paymentCard, setPaymentCard] = useState(false)
    const [error, setError] = useState('')
    const [subtotal, setSubtotal] = useState(0)
    const rateStyle= {width: 60, height: 35, padding: 5, resizeMode: 'contain'}

    const handlePackage = (item) => {
        setSubtotal(item.subtotal)
        setPaymentCard(true)
    }

    const handleCustom = (item) => {
        setSubtotal(item.subtotal)
        if(!item.subtotal){
            setError('Моля въведете сума!')
        }else{
            setPaymentCard(true)
        }
    }

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <View style={styles.row}>
                <ScrollView style={styles.container}>
                    <Text style={[{textAlign: 'center', padding: 10, fontSize: 25, fontWeight: '500'}]}>Избери пакет</Text>
                    {TIERS.map((item, index) => (
                    <View style={styles.cardContainer}>
                            <View style={styles.wrapper}>
                                {item.best && <Text style={styles.label}>Най-продаван</Text>}
                                <Text selectionColor='blue' style={[styles.title]}>{item.title}</Text>
                                <Image source={item.image} style={rateStyle} />
                                {item.input ? (
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={[styles.price, { marginTop: 20, textAlign: 'center', marginTop: 20 }]}>Цена: </Text>
                                        <TextInput
                                            style={[styles.inputText, styles.price, {width: 100}, { borderBottomWidth: 1, textAlign: 'center', borderBottomColor: '#ccc', marginTop: 20 }]}
                                            maxLength={70}
                                            onChangeText={(text) => setSubtotal(text)}
                                            value={subtotal}
                                            keyboardType='numeric'
                                            placeholder={'0.00'}
                                        />
                                        <Text style={[styles.price, { marginTop: 20, textAlign: 'center', marginTop: 20 }]}>лв.</Text>
                                    </View>
                                ): (
                                    <Text style={[styles.price, { marginTop: 20 }]}>Цена: {item.subtotal} лв.</Text>
                                )}
                                <Button  
                                    color={item.color}
                                    title="Купи" 
                                    onPress={() => item.input ? handleCustom({ ...item, subtotal: subtotal}) : 
                                    handlePackage({ ...item, subtotal: item.subtotal })}
                                /> 
                                {error && item.input && <Text style={{ color: 'red', textAlign: 'center', padding: 10 }}>{error}</Text>}
                            </View>
                    </View>    
                ))}
                <ModalComponent id={id} promotionScore={promotionScore} subtotal={subtotal} paymentCard={paymentCard} setPaymentCard={setPaymentCard}/>
                </ScrollView>
            </View>            
        </KeyboardAvoidingView>
    )
}

export default Promote

const styles = StyleSheet.create({
    cardContainer: {
        position: 'relative',
        padding: 10,
        backgroundColor: '#f5f5f5', // You can change the color as needed
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden', 
    },
    label: {
        position: 'absolute',
        top: -5.9,
        left: -7.5,
        backgroundColor: '#4286f3', // Example background color
        color: 'white', // Text color
        padding: 5,
        fontSize: 12,
        borderRadius: 5,
        transform: [{ rotate: '-7.5deg' }], // Rotate the label
        zIndex: 2
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center', // Center items horizontally in the card
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        fontSize: 16,
        color: 'grey',
        marginBottom: 20,
    }, 
    wrapper: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 8,
    },
});