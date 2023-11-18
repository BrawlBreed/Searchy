import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { EmptyButton, RightButton, TextDefault } from '../../../components'
import { alignment, colors } from '../../../utilities'
import styles from './styles'
import { dateStringToDDMMYYYY } from '../../../utilities/methods'
import { useDispatch, useSelector } from 'react-redux'
import { client } from '../../../apollo'
import { FOLLOWING_USER, FOLLOW_USER, GET_ZONES_QUERY } from '../../../apollo/server'
import { useLazyQuery } from '@apollo/client'
import { setCurrentUser } from '../../../store/reducers/User/userSlice'

function UserProfile({ route }) {
    const navigation = useNavigation()
    const { _id, avatar, name, createdAt, description } = route.params
    const user = useSelector(state => state.user)
    const [ followersList, setFollowersList ] = useState([])
    const [ followingList, setFollowingList ] = useState([])
    const [ isFollowing, setIsFollowing ] = useState(false)
    const [getZones, { loading, data, error, refetch }] = useLazyQuery(GET_ZONES_QUERY, {
        variables: {
            userId: _id
        }
    });

    useEffect(() => {
        getZones()
    }, [])

    useEffect(() => {
        setIsFollowing(followersList.some(item => item === _id))
    }, [followersList])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: null,
            headerRight: () => <RightButton iconColor={colors.headerText} icon='dots' />
        })
    }, [navigation])

    useEffect(() => {
        if(data?.getUserById){
            setFollowersList(data?.getUserById?.followers.filter((item) => item !== ''))
            setFollowingList(data?.getUserById?.following.filter((item) => item !== ''))
        }
    }, [data])

    function follow () {
        const newFollowers = [...followersList, _id]
        const newFollowing = [...user.following, user._id]
        client.mutate({
            mutation: FOLLOW_USER,
            variables: {
                uid: _id,
                followers: newFollowers.length > 0 ? newFollowers : ['']
            }
        }).then(() => client.mutate({
            mutation: FOLLOWING_USER,
            variables: {
                uid: user._id,
                following: newFollowing.length > 0 ? newFollowing : ['']
            }
        })).then(() => refetch())
    }
    function unfollow () {
        const newFollowers = followersList.filter((item) => item !== _id)
        const newFollowing = user.following.filter((item) => item !== user._id)
        client.mutate({
            mutation: FOLLOW_USER,
            variables: {
                uid: _id,
                followers: newFollowers.length > 0 ? newFollowers : ['']
            }
        }).then(() => client.mutate({
            mutation: FOLLOWING_USER,
            variables: {
                uid: user._id,
                following: newFollowing.length > 0 ? newFollowing : ['']
            }
        })).then(() => refetch())
    }

    return (
        <View style={[styles.flex, styles.mainContainer]}>
            <View style={styles.profileContainer}>
                <View style={styles.upperContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.imgResponsive}
                            source={{ uri: avatar }}
                            resizeMode='cover'
                        />
                    </View>
                    <View style={[styles.flex, styles.subContainer]}>
                        <View style={styles.profileInfo}>
                            <View style={styles.follower}>
                                <TextDefault textColor={colors.fontMainColor} H3 bold>
                                    {followersList.length}
                                </TextDefault>
                                <TextDefault textColor={colors.fontSecondColor} light uppercase>
                                    {'Последователи'}
                                </TextDefault>
                            </View>
                            <View style={styles.follower}>
                                <TextDefault textColor={colors.fontMainColor} H3 bold>
                                    {followingList.length}
                                </TextDefault>
                                <TextDefault textColor={colors.fontSecondColor} light uppercase>
                                    {'Следва'}
                                </TextDefault>
                            </View>
                        </View>
                        {isFollowing ? (
                            <View style={styles.editButton}>
                                <EmptyButton title='Отпоследвай'
                                    onPress={() => unfollow()} />
                            </View>
                        ) : (
                            <View style={styles.editButton}>
                                <EmptyButton title='Последвай'
                                    onPress={() => follow()} />
                            </View>
                        )}
                    </View>
                </View>
                <TextDefault H4 bold style={[alignment.MBxSmall, alignment.PLsmall, alignment.MTlarge]}>
                    {name}
                </TextDefault>
                <TextDefault textColor={colors.fontSecondColor} bold style={[alignment.MBxSmall, alignment.PLsmall]} uppercase>
                    {`Член от ${dateStringToDDMMYYYY(createdAt)}`}
                </TextDefault>
                <TextDefault textColor={colors.fontSecondColor} bold style={[alignment.MBxSmall, alignment.PLsmall, alignment.MTlarge]} uppercase>
                    Описание
                </TextDefault>
                <TextDefault textColor={colors.black} style={[alignment.MBxSmall, alignment.PLsmall]}>
                    { description ? description : 'Няма описание' }
                </TextDefault>
            </View>
        </View >
    )
}

export default React.memo(UserProfile)