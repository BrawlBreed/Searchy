import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Platform, TouchableOpacity, View } from 'react-native'
import { BaseButton, BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { FlashMessage, TextDefault } from '../../../../components'
import { alignment, colors, scale } from '../../../../utilities'
import styles from './styles'
import { dateStringToDDMMYYYY } from '../../../../utilities/methods'
import { client } from '../../../../apollo'
import { ADD_OWNED_ITEM, DEACTIVATE_ITEM, DELETE_ITEM } from '../../../../apollo/server'
import { useSelector } from 'react-redux'

function Card(props) {
    const navigation = useNavigation()
    const [deleteBox, setDeletebox] = useState(false)
    const [opacity, setopacity] = useState(1)
    const { uid, ownedItems, changed } = useSelector(state => state.user);

    function onBoxToggle() {
        setDeletebox(prev => !prev)
    }

    function navigateScreen() {
        if (deleteBox)
            setDeletebox(false)
        else
            navigation.navigate('ProductDescription', { ...props })
    }

    function deleteItem() {
        const newOwnedItems = ownedItems.filter(item => item !== props._id)
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
                    onPress: () => client.mutate({
                        mutation: ADD_OWNED_ITEM,
                        variables: { id: uid }
                    }).then(() => client.mutate({
                        mutation: ADD_OWNED_ITEM,
                        variables: { id: uid, ownedItems: newOwnedItems }
                    })).then(() => props.refetch())
                },
            ],
            { cancelable: false } // This prevents the alert from being dismissed by tapping outside of the alert box
        );
    }

    function changeItemStatus(status) {
        if(status.toLowerCase() === 'sold') {
            client.mutate({
                mutation: DEACTIVATE_ITEM,
                variables: { id: props._id, status: status }
            }).then(() => props.refetch())

            return
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
                        variables: { id: props._id, status: status }
                    }) .then(() => props.refetch())
                },
            ],
            { cancelable: false } // This prevents the alert from being dismissed by tapping outside of the alert box
        );
    }

    function activeState(data) {
        if (data)
            setopacity(0.5)
        else 
            setopacity(1)
    }
    return (
        <View
            style={[styles.adContainer, { borderLeftColor: props.status?.toLowerCase() === 'inactive' ? colors.horizontalLine : colors.activeLine }]}>
            <BaseButton activeOpacity={0.04} onActiveStateChange={activeState}
                style={{ opacity: Platform.OS === 'ios' ? opacity : 1 }}>
                <View style={[styles.dateRow, { flexDirection: "row", alignItems: "center", ...alignment.PTxSmall, ...alignment.PBxSmall }]}>
                    <TextDefault small textColor={colors.fontSecondColor} uppercase style={[styles.flex, alignment.PLsmall, {}]}>
                        {'От: '} <TextDefault small bold>{dateStringToDDMMYYYY(props.createdAt)}</TextDefault>
                    </TextDefault>
                    <BorderlessButton style={alignment.PxSmall} onPress={onBoxToggle}>
                        <MaterialCommunityIcons name="dots-vertical" size={scale(20)} color="black" />
                    </BorderlessButton >
                </View>

                <View style={[styles.InfoContainer, { zIndex: 0 }]}>
                    <Image
                        source={{ uri: props.images[0] }}
                        style={styles.imgResponsive}
                    />
                    <View style={[styles.flex, styles.descriptionContainer]}>
                        <View>
                            <TextDefault bold>
                                {props.title}
                            </TextDefault>
                            <TextDefault style={alignment.PTxSmall}>
                                {props.price}
                            </TextDefault>
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
                                {'Харесвания:'} <TextDefault small bold> {props.status?.toLowerCase() === 'inactive' ? '-' : props?.likes?.length}</TextDefault>
                            </TextDefault>
                        </View>
                    </View>
                </View>
                <View style={styles.statusContainer}>
                    <View style={{ display: 'flex', flexDirection: 'row'}}>
                        <View style={[styles.statusBox, props.status === 'active' ? styles.activeStatus : styles.pendingStatus, styles.Vline]}>
                            <TextDefault textColor={props.status === 'active' ? colors.fontMainColor : colors.buttonText} uppercase small bolder>
                                {props.status === 'active' ? 'АКТИВНА' : props.status === 'sold' ? 'ПРОДАДЕНА' : 'НЕАКТИВНА'}
                            </TextDefault>
                        </View>
                        {props.status.toLowerCase() === 'active' && (
                            <TouchableOpacity style={[styles.statusBox, {backgroundColor: '#fbbf04', zIndex: 1000}, styles.Vline]}>
                                <View style={{ display: 'flex', flexDirection: 'row'}}>
                                    <TextDefault textColor={props.status === 'active' ? colors.fontMainColor : colors.buttonText} uppercase small bolder>
                                            {!props.promoted ? 'ПРОМОТИРАЙ' : 'УВЕЛИЧИ ВИДИМОСТ'}
                                    </TextDefault>                        
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                    <TextDefault style={[alignment.MBxSmall, {fontWeight: 'bold'}]}>
                        {props?.status?.toLowerCase() === 'active' ? 'Обявата е активна!' : 'Обявата не е активна.'}
                    </TextDefault>
                    {props?.status?.toLowerCase() === 'active' && (
                        <TextDefault style={[alignment.MBxSmall]}>
                            {props?.promoted ? 'Увеличи видимостта на обявата за по-бърза продажба!' : 'Промотирай обявата за по-бърза продажба!'}
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
            </BaseButton>
        </View>
    )
}

export default React.memo(Card)