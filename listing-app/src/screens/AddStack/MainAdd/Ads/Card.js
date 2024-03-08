import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Platform, TouchableOpacity, View } from 'react-native'
import { BaseButton, BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { FlashMessage, TextDefault } from '../../../../components'
import { alignment, colors, scale } from '../../../../utilities'
import styles from './styles'
import { dateStringToDDMMYYYY, calculatePromotionScore } from '../../../../utilities/methods'
import { client } from '../../../../apollo'
import { ADD_OWNED_ITEM, DEACTIVATE_ITEM, DELETE_ITEM } from '../../../../apollo/server'
import { useSelector } from 'react-redux'

const promotionRate_Low = require('../../../../assets/images/promotion/level_low.png')
const promotionRate_Medium = require('../../../../assets/images/promotion/level_medium.png')
const promotionRate_High = require('../../../../assets/images/promotion/level_high.png')
const promotionRate_None = require('../../../../assets/images/promotion/level_none.png')
function Card(props) {
    const navigation = useNavigation()
    const [likesLength, setLikesLength] = useState(0)
    const [deleteBox, setDeletebox] = useState(false)
    const { uid, ownedItems, changed } = useSelector(state => state.user);
    const rateStyle= {width: 40, height: 40, padding: 5, resizeMode: 'contain', filter: 'grayscale(100%)'}

    function getPromotionRate() {
        if (props?.promotionScore <= calculatePromotionScore(4.99) + 1) {
            return promotionRate_Low;
        } else if (props?.promotionScore <= calculatePromotionScore(10.99)) {
            return promotionRate_Medium;
        } else {
            return promotionRate_High;
        }
    }

    useEffect(() => {
        const length = props?.likes?.filter(item => item)?.length || 0;
        setLikesLength(length)
    }, [props.likes])

    function onBoxToggle() {
        setDeletebox(prev => !prev)
    }

    async function deleteItem() {
        const newOwnedItems = ownedItems.filter(item => item !== props?._id);
        Alert.alert(
            'Изтриване на обява', // Title
            'Сигурни ли сте, че искате да изтриете тази обява?', // Message
            [
                {
                    text: 'Отказ', 
                    style: 'cancel',
                },
                { 
                    text: 'Изтрий', 
                    onPress: async () => {
                        try {
                            await client.mutate({
                                mutation: ADD_OWNED_ITEM,
                                variables: { uid: uid, ownedItems: newOwnedItems }
                            });
                            await client.mutate({
                                mutation: DELETE_ITEM,
                                variables: { id: props?.id }
                            });
                            await props.refetch();
                        } catch (error) {
                            console.error('Error in deleteItem:', error);
                        }
                    }
                },
            ],
            { cancelable: false }
        ).then(() => {
            props.refetch();
        });
    }
    
    function promote() {
        navigation.navigate('Promote', {...props})
    }

    async function changeItemStatus(status) {
        try {
            if (status?.toLowerCase() === 'sold') {
                await client.mutate({
                    mutation: DEACTIVATE_ITEM,
                    variables: { id: props?._id, status: status }
                });
                await props.refetch();
                return;
            }
            // ... (rest of your alert logic for changeItemStatus)
        } catch (error) {
            console.error('Error in changeItemStatus:', error);
        }
            Alert.alert(
            status === 'active' ? 'Активиране на обява' : 'Деактивиране на обява', // Title
            status === 'active' ? 'Активирайки вашата обява тя може да бъде видяна от другите потребители.' :
            'Деактивирайки вашата обява не може да бъде видяна от другите потребители.'
            , // Message
            [
                {
                    text: 'Отказ', 
                    style: 'cancel',
                },
                { 
                    text: status === 'active' ? 'Активирай' : 'Деактивирай', 
                    onPress: () => client.mutate({
                        mutation: DEACTIVATE_ITEM,
                        variables: { id: props?._id, status: status }
                    }).then((data) => {
                        props.refetch()
                    })
                },
            ],
            { cancelable: false } // This prevents the alert from being dismissed by tapping outside of the alert box
        );
    }

    return (
        <View
            style={[styles.adContainer, { borderLeftColor: props.status?.toLowerCase() === 'inactive' ? colors.horizontalLine : colors.activeLine }]}>
                <View style={[styles.dateRow, { flexDirection: "row", alignItems: "center", ...alignment.PTxSmall, ...alignment.PBxSmall }]}>
                    <TextDefault small textColor={colors.fontSecondColor} uppercase style={[styles.flex, alignment.PLsmall, {}]}>
                        {'От: '} <TextDefault small bold>{dateStringToDDMMYYYY(props?.createdAt)}</TextDefault>
                    </TextDefault>
                    <BorderlessButton style={alignment.PxSmall} onPress={onBoxToggle}>
                        <MaterialCommunityIcons name="dots-vertical" size={scale(20)} color="black" />
                    </BorderlessButton >
                </View>

                <View style={[styles.InfoContainer, { zIndex: 0 }]}>
                    <Image
                        source={{ uri: props.images?.[0] }}
                        style={styles.imgResponsive}
                    />
                    <View style={[styles.flex, styles.descriptionContainer]}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                            <View>
                                <TextDefault bold>
                                    {props.title}
                                </TextDefault>
                                <TextDefault style={alignment.PTxSmall}>
                                    {props.price} лв.
                                </TextDefault>
                            </View>
                            <View style={{ alignItems: 'center'}}>
                                <TextDefault bold>
                                    Видимост
                                </TextDefault>
                                {props?.promotionScore ?
                                        <Image source={getPromotionRate()} style={rateStyle} />
                                    :
                                    <Image source={promotionRate_None} style={rateStyle}/>
                                }
                            </View>
                        </View>
                        <View style={styles.locationRow}>
                            <View style={styles.Vline}>
                                <MaterialCommunityIcons name="eye-outline" size={scale(15)} color={colors.headerText} />
                                <TextDefault numberOfLines={1} small bold style={styles.locationText}>
                                    <TextDefault small style={{ fontWeight: 'bold'}} bold> {props.status?.toLowerCase() === 'inactive' ? '-' : props.views}</TextDefault>
                                </TextDefault>
                            </View>
                            <FontAwesome name="heart" size={scale(13)} color={'#E91F63'} />
                            <TextDefault numberOfLines={1} small bold style={styles.locationText}>
                                {'Харесвания:'} <TextDefault small bold> {props.status?.toLowerCase() === 'inactive' ? '-' : likesLength}</TextDefault>
                            </TextDefault>
                        </View>
                    </View>
                </View>
                <View style={[styles.statusContainer, { textAlign: 'center', alignItems: 'center'}]}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <View style={[styles.statusBox, props.status === 'active' ? styles.activeStatus : styles.pendingStatus, styles.Vline]}>
                            <TextDefault textColor={props.status === 'active' ? colors.fontMainColor : colors.buttonText} uppercase small bolder>
                                {props.status === 'active' ? 'АКТИВНА' : props.status === 'sold' ? 'ПРОДАДЕНА' : 'НЕАКТИВНА'}
                            </TextDefault>
                        </View>
                        {props.status?.toLowerCase() === 'active' && (
                            <TouchableOpacity onPress={promote} style={[styles.statusBox, {backgroundColor: '#fbbf04', zIndex: 1000}, styles.Vline]}>
                                <View style={{ display: 'flex', flexDirection: 'row'}}>
                                    <TextDefault textColor={props.status === 'active' ? colors.fontMainColor : colors.buttonText} uppercase small bolder>
                                        {!props.promotionScore ? 'ПРОМОТИРАЙ' : 'УВЕЛИЧИ ВИДИМОСТ'}
                                    </TextDefault>                        
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TextDefault style={[alignment.MBxSmall, { padding: 10, color: props?.status?.toLowerCase() === 'active' ? colors.searchy2 : colors.horizontalLine }]} bold>
                        {props?.status?.toLowerCase() === 'active' ? 'Обявата е активна!' : 'Обявата не е активна.'}
                    </TextDefault>
                    {props?.status?.toLowerCase() === 'active' && (
                        <TextDefault style={[alignment.MBxSmall, { textAlign: 'center'}]} bold>
                            {props?.promotionScore ? 'Увеличи видимостта на обявата си още повече!' : 'Увеличи видимостта на обявата за по-голяма видимост!'}
                        </TextDefault>
                    )}
                </View>
                {deleteBox &&
                    <View style={{
                        width: '50%',
                        backgroundColor: colors.containerBox,
                        shadowColor: colors.horizontalLine,
                        shadowOffset: {
                            width: 1,
                            height: 2
                        },
                        shadowOpacity: 0.7,
                        shadowRadius: scale(5),
                        elevation: 15,
                        position: 'absolute',
                        right: scale(10),
                        top: scale(30),
                        zIndex: 1
                    }}>
                        <RectButton style={alignment.Psmall} onPress={() => navigation.navigate('EditAd', {...props})}>
                            <TextDefault H5 bold uppercase>
                                {'Редактирай'}
                            </TextDefault>
                        </RectButton>
                        <RectButton style={alignment.Psmall} onPress={() => deleteItem()}>
                            <TextDefault H5 bold uppercase>
                                {'Изтрий'}
                            </TextDefault>
                        </RectButton>
                        {props.status?.toLowerCase() === 'active' ? (
                            <RectButton style={alignment.Psmall} onPress={() => changeItemStatus('inactive')}>
                                <TextDefault H5 bold uppercase>
                                    {'Деактивирай'}
                                </TextDefault>
                            </RectButton>
                        ) : (
                            <RectButton style={alignment.Psmall} onPress={() => changeItemStatus('active')}>
                                <TextDefault H5 bold uppercase>
                                    {'Активирай'}
                                </TextDefault>
                            </RectButton>
                        )}
                        {props.status?.toLowerCase() !== 'sold' && (
                            <RectButton style={alignment.Psmall} onPress={() => changeItemStatus('sold')}>
                                <TextDefault H5 bold uppercase>
                                    {'Маркирай като продадена'}
                                </TextDefault>
                            </RectButton>
                        )}
                    </View>
                }
        </View>
    )
}

export default React.memo(Card)