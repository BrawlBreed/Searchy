import { CardField, useConfirmPayment, useStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-native';
import {
  Modal,
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { useSelector } from 'react-redux';
import { FlashMessage } from '../../../../components';
import { colors } from '../../../../utilities';
import Loader from 'react-native-modal-loader';
import { useNavigation } from '@react-navigation/native';
import { calculatePromotionScore } from '../../../../utilities/methods';
import { client } from '../../../../apollo';
import { PROMOTE_ITEM } from '../../../../apollo/server';

const screenHeight = Dimensions.get('window').height;

const ModalComponent = ({ paymentCard, setPaymentCard, subtotal, id, promotionScore }) => {
    const [cardError, setCardError] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [billingDetails, setBillingDetails] = useState({})
    const [loading, setLoading] = useState(false);
    const {confirmPayment, loading: loadingPayment} = useConfirmPayment();
    const { email, name } = useSelector(state => state.user); 
    const navigation = useNavigation()
    
    useEffect(() => {
        if(paymentCard && clientSecret === null){
            createPaymentIntent();
        }
        return () => {
            setCardError(null)
        }
    }, [paymentCard])

    const createPaymentIntent = async () => {
        const ip = Platform.OS === "ios" ? '192.168.x.x' : '10.0.2.2'; // Replace with your actual IP address for iOS
        const response = await fetch(`https://searchy.fun/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currency: 'bgn', subtotal: subtotal }),
        })
        
        return response.json();
    };
        
    const handlePayment = async () => {
        try {
            setLoading(true);
            const {data, loadingPayment, error} = await confirmPayment(clientSecret, {
                paymentMethodType: 'Card',
                billingDetails,
                paymentMethodData: {
                email: email,
                name,
                }
            });
            if (error) {
                switch(error.message){
                    case 'Card details not complete':
                        setCardError('Моля попълнете всички полета!')
                        break;
                    case 'Your card was declined':
                        setPaymentCard(false)
                        FlashMessage({message: 'Вашата карта беше отказана', type: 'danger'})
                        break;
                    default:
                        console.log(error.message)
                        FlashMessage({message: 'Възникна грешка, моля опитайте по-късно', type: 'danger'})
                        break;
                }
            } else {
                if(data === undefined){
                    setPaymentCard(false)
                    FlashMessage({message: 'Плащането беше успешно!', type: 'success'})
                    client.mutate({
                        mutation: PROMOTE_ITEM,
                        variables: {
                            id: id,
                            promotionScore: calculatePromotionScore(subtotal, new Date().toISOString().split('T')[0]) + promotionScore
                        }
                    })
                    navigation.navigate('Моите Обяви')
                }
              }
        } catch (error) {
            setCardError(error.message);
        } finally {
            // Finish loading regardless of the result
            setLoading(false);
        }
    }
    
    useEffect(() => {
        async function initialize() {
            if(paymentCard){
                const res = await createPaymentIntent()
                setClientSecret(res.clientSecret)
            }
        }
        initialize()
    }, [paymentCard]);   
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={paymentCard}
        >
            <SafeAreaView style={styles.safeAreaView}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <View style={styles.container}>
                        {/* Modal Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Плащане</Text>
                            <TouchableOpacity onPress={() => setPaymentCard(false)} style={styles.closeButton}>
                                <Text>Затвори</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Payment Intents and Details */}
                        <View style={styles.content}>
                            <View style={[styles.flex, styles.container]}>
                                <Text style={[styles.title, { textAlign: 'center' }, cardError && { color: colors.google }]}>Данни на карта</Text>
                                <CardField
                                    onCardChange={(cardDetails) => setBillingDetails(cardDetails)}
                                    postalCodeEnabled={false}
                                    placeholders={{
                                        number: '4242 4242 4242 4242',
                                    }}
                                    cardStyle={{
                                        backgroundColor: '#F6F6F6',  // A light grey background
                                        borderColor: '#E1E8EE',      // A subtle border color
                                        borderWidth: 1,              // Border width
                                        borderRadius: 8,             // Rounded corners
                                        textColor: '#333333',        // Dark grey text for contrast
                                        fontSize: 16,                // Font size for readability
                                        fontFamily: 'Avenir',        // Custom font (ensure it's loaded in your app)
                                        placeholderColor: '#888888', // Light grey for placeholders
                                    }}
                                    style={{
                                        width: '100%',
                                        height: 50,
                                        marginVertical: 30, 
                                    }}
                                />
                                { cardError && <Text style={{ color: colors.google, textAlign: 'center', padding: 10 }}>{cardError}</Text>}
                                <Button
                                    variant="primary"
                                    disabled={clientSecret === null}
                                    title="Плати"
                                    onPress={handlePayment}
                                />
                            </View>
                        </View>
                    </View>
                    <Loader loading={loading} color={colors.searchy1} size='large' />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        justifyContent: 'flex-end',
        zIndex: 3
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '100%'
        // maxHeight: , // 80% of the screen height
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 10, // Makes it easier to tap
    },
    content: {
        // Add styles for your content here
    },
});

export default ModalComponent;

// const initializePaymentSheet = async () => {
//     try{
//         const {
//             setupIntent,
//             ephemeralKey,
//             customer,
//         } = await fetchPaymentSheetParams();
        
//         const { error } = await initPaymentSheet({
//             merchantDisplayName: "Searchy Inc.",
//             customerId: customer,
//             customerEphemeralKeySecret: ephemeralKey,
//             setupIntentClientSecret: setupIntent,
//         });

//         if (!error) {
//             setLoading(true);
//         }
//     }catch(err){
//         console.log(err)
//     }
// };
// const fetchPaymentSheetParams = async () => {
//         const response = await fetch(Platform.OS === "ios" ? "http://10.0.2.2:3000/payment-sheet" : "http://192.168.x.x:3000/payment-sheet", {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         const { clientSecret } = await response.json();
    
//         return {
//             clientSecret
//         };
//       };