import { useNavigation } from '@react-navigation/native'
import React, { useLayoutEffect } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { RightButton, TextDefault } from '../../../components'
import { alignment, colors } from '../../../utilities'
import styles from './styles'
import { useUser } from '../../../hooks/useUser'
import { useSelector } from 'react-redux'

function Profile() {
    // const { userId } = useSelector(state => state.user)
    // const { data, error, loading } = useUser(userId)
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: null,
            headerRight: () => <RightButton iconColor={colors.headerText} icon='dots' />
        })
    }, [navigation])

    return (
        <View style={[styles.flex, styles.mainContainer]}>
            <View style={styles.profileContainer}>
                <View style={styles.upperContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.imgResponsive}
                            source={require('../../../assets/images/avatar.png')}
                            resizeMode='cover'
                        />
                    </View>
                    <View style={[styles.flex, styles.subContainer]}>
                        <View style={styles.profileInfo}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.following}
                                onPress={() => navigation.navigate('Network', { screen: 'Following' })}
                            >
                                <TextDefault textColor={colors.fontMainColor} H3 bold>
                                    {'0'}
                                </TextDefault>
                                <TextDefault textColor={colors.fontSecondColor} light uppercase>
                                    {'Following'}
                                </TextDefault>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.follower}
                                onPress={() => navigation.navigate('Network', { screen: 'Followers' })}
                            >
                                <TextDefault textColor={colors.fontMainColor} H3 bold>
                                    {'0'}
                                </TextDefault>
                                <TextDefault textColor={colors.fontSecondColor} light uppercase>
                                    {'Followers'}
                                </TextDefault>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <TextDefault textColor={colors.buttonbackground}>
                                {'Edit Profile'}
                            </TextDefault>
                        </TouchableOpacity>
                    </View>
                </View>
                <TextDefault H4 bold style={[alignment.MBxSmall, alignment.PLsmall, alignment.MTsmall]}>
                    {'Muhammad Saad Javed'}
                </TextDefault> 
            </View> 
        </View>
    )
}

export default React.memo(Profile)