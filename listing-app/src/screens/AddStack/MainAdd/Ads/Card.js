import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, Platform, TouchableOpacity, View } from 'react-native'
import { BaseButton, BorderlessButton, RectButton } from 'react-native-gesture-handler'
import { FlashMessage, TextDefault } from '../../../../components'
import { alignment, colors, scale } from '../../../../utilities'
import styles from './styles'

function Card(props) {
    const navigation = useNavigation()
    const [deleteBox, setDeletebox] = useState(false)
    const [opacity, setopacity] = useState(1)

    function onBoxToggle() {
        setDeletebox(prev => !prev)
    }

    function navigateScreen() {
        if (deleteBox)
            setDeletebox(false)
        else
            navigation.navigate('ProductDescription', { ...props })
    }

    function adOptions() {
        FlashMessage({ message: 'Feature will be attached with service' })
        onBoxToggle()
    }

    function activeState(data) {
        if (data)
            setopacity(0.5)
        else
            setopacity(1)
    }
    return (
        <View
            style={[styles.adContainer, { borderLeftColor: props.status === 'PENDING' ? colors.horizontalLine : colors.activeLine }]}>
            <BaseButton onPress={navigateScreen} activeOpacity={0.04} onActiveStateChange={activeState}
                style={{ opacity: Platform.OS === 'ios' ? opacity : 1 }}>
                <View style={[styles.dateRow, { flexDirection: "row", alignItems: "center", ...alignment.PTxSmall, ...alignment.PBxSmall }]}>
                    <TextDefault small textColor={colors.fontSecondColor} uppercase style={[styles.flex, alignment.PLsmall, {}]}>
                        {'From: '} <TextDefault small bold>{props.postingDate}</TextDefault>
                        {' -To: '} <TextDefault bold small>{props.endingDate}</TextDefault>
                    </TextDefault>
                    <BorderlessButton style={alignment.PxSmall} onPress={onBoxToggle}>
                        <MaterialCommunityIcons name="dots-vertical" size={scale(20)} color="black" />
                    </BorderlessButton >
                </View>

                <View style={[styles.InfoContainer, { zIndex: 0 }]}>
                    <Image
                        source={props.img}
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
                                    {'View:'} <TextDefault small light> {props.status === 'PENDING' ? '-' : props.views}</TextDefault>
                                </TextDefault>
                            </View>
                            <FontAwesome name="heart" size={scale(13)} color={colors.headerText} />
                            <TextDefault numberOfLines={1} small bold style={styles.locationText}>
                                {'Likes:'} <TextDefault small light> {props.status === 'PENDING' ? '-' : props.likes}</TextDefault>
                            </TextDefault>
                        </View>
                    </View>
                </View>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusBox, props.status === 'PENDING' ? styles.pendingStatus : styles.activeStatus]}>
                        <TextDefault textColor={props.status === 'PENDING' ? colors.white : colors.fontMainColor} uppercase small bolder>
                            {props.status}
                        </TextDefault>
                    </View>
                    <TextDefault style={alignment.MTxSmall}>
                        {props.status === 'PENDING' ? 'This ad is being processed and it will be live soon' : 'This ad is currently live'}
                    </TextDefault>
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
                        <RectButton style={alignment.Psmall} onPress={adOptions}>
                            <TextDefault H5 bold uppercase>
                                {'Edit'}
                            </TextDefault>
                        </RectButton>
                        <RectButton style={alignment.Psmall} onPress={adOptions}>
                            <TextDefault H5 bold uppercase>
                                {'Delete'}
                            </TextDefault>
                        </RectButton>
                        <RectButton style={alignment.Psmall} onPress={adOptions}>
                            <TextDefault H5 bold uppercase>
                                {'Deactivate'}
                            </TextDefault>
                        </RectButton>
                        <RectButton style={alignment.Psmall} onPress={adOptions}>
                            <TextDefault H5 bold uppercase>
                                {'Mark as sold'}
                            </TextDefault>
                        </RectButton>
                    </View>
                }
            </BaseButton>
        </View>
    )
}

export default React.memo(Card)