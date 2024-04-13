import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Platform, TouchableOpacity, View } from 'react-native'
import { BaseButton, BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { FlashMessage, TextDefault } from '../../../../components'
import { alignment, colors, scale } from '../../../../utilities'
import styles from './styles'
import { calculatePromotionScore, formatDateFromFirestore } from '../../../../utilities/methods'
import { client } from '../../../../apollo'
import { deleteSearchy } from '../../../../firebase'

function SearchyCard(props) {
    const navigation = useNavigation()
    const [likesLength, setLikesLength] = useState(0)
    const [deleteBox, setDeletebox] = useState(false)
    const rateStyle= {width: 40, height: 40, padding: 5, resizeMode: 'contain', filter: 'grayscale(100%)'}

    useEffect(() => {
        const length = props?.likes?.filter(item => item)?.length || 0;
        setLikesLength(length)
    }, [props.likes])

    function onBoxToggle() {
        setDeletebox(prev => !prev)
    }

    async function deleteItem() {
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
                            const res = await deleteSearchy(props.title);

                            if (!res) {
                                FlashMessage({ message: 'Възникна грешка при изтриването на обявата!', type: 'error' });
                            }

                            FlashMessage({ message: 'Обявата беше изтрита успешно!', type: 'success' });
                            props.refetch();
                        } catch (error) {
                            console.error('Error in deleteItem:', error);
                        }
                    }
                },
            ],
            { cancelable: false }
        )
    }
        
    return (
        <View
            style={[styles.adContainer, { borderLeftColor: props.status?.toLowerCase() === 'inactive' ? colors.horizontalLine : colors.activeLine }]}>
                <View style={[styles.dateRow, { flexDirection: "row", alignItems: "center", ...alignment.PTxSmall, ...alignment.PBxSmall }]}>
                    <TextDefault H3 bold style={[styles.flex, alignment.PLsmall]}>Търся си</TextDefault>
                    <TextDefault small textColor={colors.fontSecondColor} uppercase style={[styles.flex, alignment.PLsmall, {}]}>
                        {'От: '} <TextDefault small bold>{formatDateFromFirestore(props?.createdAt)}</TextDefault>
                    </TextDefault>
                    <BorderlessButton style={alignment.PxSmall} onPress={onBoxToggle}>
                        <MaterialCommunityIcons name="dots-vertical" size={scale(20)} color="black" />
                    </BorderlessButton >
                </View>

                <View style={[styles.InfoContainer, { zIndex: 0 }]}>
                    <Image
                        source={{ uri: props.image }}
                        style={styles.imgResponsive}
                    />
                    <View style={[styles.flex, styles.descriptionContainer]}>
                        <View style={{ display: 'flex', flexDirection: 'row'}}>
                            <View>
                                <TextDefault>
                                    Търсиш: <TextDefault bold>{props.title}</TextDefault>
                                </TextDefault>
                                <TextDefault style={alignment.PTxSmall}>
                                    <TextDefault bold>Предложение: </TextDefault>
                                    {props.inquiry}
                                </TextDefault>
                                <TextDefault style={alignment.PTxSmall}>
                                     <TextDefault bold>Описание: </TextDefault>{props.description}
                                </TextDefault>
                            </View>
                        </View>
                        {/* <View style={styles.locationRow}>
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
                        </View> */}
                    </View>
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
                        <RectButton style={alignment.Psmall} onPress={() => deleteItem()}>
                            <TextDefault H5 bold uppercase>
                                {'Свали търсене'}
                            </TextDefault>
                        </RectButton>
                    </View>
                }
        </View>
    )
}

export default React.memo(SearchyCard)