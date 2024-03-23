import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { RightButton, TextDefault } from '../../../components'
import { alignment, colors } from '../../../utilities'
import styles from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { GET_ZONES_QUERY } from '../../../apollo/server'

function Profile() {
    const { userId, ...user } = useSelector(state => state.user)
    const { followers, following, avatar, name, email  } = user
    const navigation = useNavigation()
    const [getZones, { loading, data, error, refetch }] = useLazyQuery(GET_ZONES_QUERY);

    const followersCount = followers?.reduce((acc, curr) => {
        // Optimization with a query to check if the user is active
        curr = curr.length ? 1 : 0
        return curr + acc
    }, 0)

    const followingCount = following?.reduce((acc, curr) => {
        curr = curr.length ? 1 : 0
        return curr + acc
    }, 0)

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
                        { avatar ?
                            <Image
                                style={styles.imgResponsive}
                                source={avatar ? { uri: avatar } : require('../../../assets/images/avatar.png')}
                                resizeMode='cover'
                            />
                            : 
                            <Image
                                style={styles.imgResponsive}
                                source={require('../../../assets/images/avatar.png')}
                                resizeMode='cover'
                            />
                        }
                    </View>
                    <View style={[styles.flex, styles.subContainer]}>
                        <View style={styles.profileInfo}>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.following}
                                onPress={() => navigation.navigate('Network', { screen: 'Following' })}
                            >
                                <TextDefault textColor={colors.fontMainColor} H3 bold>
                                    {followingCount}
                                </TextDefault>
                                <TextDefault textColor={colors.fontSecondColor} light uppercase>
                                    {'Следва'}
                                </TextDefault>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.follower}
                                onPress={() => navigation.navigate('Network', { screen: 'Followers' })}
                            >
                                <TextDefault textColor={colors.fontMainColor} H3 bold>
                                    {followersCount}
                                </TextDefault>
                                <TextDefault textColor={colors.fontSecondColor} light uppercase>
                                    {'Последователи'}
                                </TextDefault>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <TextDefault textColor={colors.buttonbackground}>
                                {'Редактирай профил'}
                            </TextDefault>
                        </TouchableOpacity>
                    </View>
                </View>
                <TextDefault H4 bold style={[alignment.MBxSmall, alignment.PLsmall, alignment.MTsmall]}>
                    {name}
                </TextDefault>  
            </View> 
        </View>
    )
}

export default React.memo(Profile)