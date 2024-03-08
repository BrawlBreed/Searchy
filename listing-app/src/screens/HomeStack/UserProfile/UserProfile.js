import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { EmptyButton, RightButton, TextDefault } from '../../../components'
import { alignment, colors } from '../../../utilities'
import styles from './styles'
import s from '../MainHome/styles'
import btnStyles from '../../../components/Buttons/EmptyButton/styles';
import { dateStringToDDMMYYYY, filterFalsyValues, toggleStringInArray } from '../../../utilities/methods'
import { useSelector } from 'react-redux'
import { client } from '../../../apollo'
import { FOLLOWING_USER, FOLLOW_USER, GET_ITEM_BY_ID, GET_ZONES_QUERY } from '../../../apollo/server'
import { useLazyQuery } from '@apollo/client'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import Card from '../MainHome/Card/Card'
import BlockModal from '../../../components/Modal/BlockModal/BlockModal'
import { UserButton } from '../../../components/Header/HeaderIcons/HeaderIcons'

function UserProfile({ route }) {
    const navigation = useNavigation()
    const { _id, avatar, name, createdAt, description, ownedItems } = route.params
    const { blockedUsers, ...user} = useSelector(state => state.user)
    const [ followersList, setFollowersList ] = useState([])
    const [ followingList, setFollowingList ] = useState([])
    const [ items, setItems ] = useState([])
    const [ isFollowing, setIsFollowing ] = useState(false)
    const [getZones, { loading, data, error, refetch }] = useLazyQuery(GET_ZONES_QUERY, {
        variables: {
            userId: _id
        }
    });
    const [getItemById, { loading: loadingUser, error: errorUser, data: dataUser }] = useLazyQuery(GET_ITEM_BY_ID);
    const { uid } = useSelector(state => state.user)

    useEffect(() => {
        refetch().then(() => getZones())
    }, [])

    useEffect(() => {
        setIsFollowing(followersList.some(item => item === user.uid))
    }, [followersList])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: null,
            headerRight: () => <UserButton isBlocked={blockedUsers?.includes(_id)} blockedUsers={
                toggleStringInArray([...blockedUsers || '' ], _id)} 
                iconColor={colors.headerText} icon='dots' />
        })
    }, [navigation])

    useEffect(() => {
        if(data?.getUserById){
            setFollowersList(filterFalsyValues(data?.getUserById?.followers))
            setFollowingList(filterFalsyValues(data?.getUserById?.following))
        }
    }, [data])

    useEffect(() => {
        async function fetchData() {
            try {
                let filteredOwnedItems = ownedItems.filter(ownedItem => ownedItem !== '');
                filteredOwnedItems = Array.from(new Set(filteredOwnedItems));

                // Fetch each favorite item details
                const OwnedItemsPromises = filteredOwnedItems.map(ownedItemId =>
                    getItemById({ variables: { id: ownedItemId } }).then(response => {
                        const obj = response.data.getItemById;
                        return { 
                            ...obj, 
                            location: obj.address.address,
                            image: obj.images[0],
                        }
                    })
                );

                // Wait for all the items to be fetched
                const dataList = await Promise.all(OwnedItemsPromises);
                const newItems = dataList.reduce((unique, item) => {
                    if (item && !unique.some(i => i.id === item._id)) {
                        unique.push(item);
                    }
                    return unique;
                }, []).filter((item) => item.status === 'active');

                setItems(newItems)
            } catch (error) {
                console.error('Error fetching user owned items:', error);
            }
        }
        fetchData();
    }, [_id])

    function follow () {
        let oldFollowing = user?.following.map((following) => {
            if(following._id) return following._id
            else return following 
        });
        oldFollowing = Array.from(new Set(oldFollowing));
        const newFollowers = [...filterFalsyValues(followersList), user.uid]
        const newFollowing = [...filterFalsyValues(oldFollowing), _id]
        client.mutate({
            mutation: FOLLOW_USER,
            variables: {
                uid: _id,
                followers: newFollowers.length > 0 ? newFollowers : ['']
            }
        }).then(() => client.mutate({
            mutation: FOLLOWING_USER,
            variables: {
                uid: user.uid,
                following: newFollowing.length > 0 ? newFollowing : ['']
            }
        })).then(() => refetch())
        .catch((err) => console.log(err))
    }
    function unfollow () {
        let oldFollowing = user?.following.map((following) => {
            if(following._id) return following._id
            else return following 
        });
        oldFollowing = Array.from(new Set(oldFollowing));
        const newFollowers = followersList?.filter((item) => item !== user.uid) || ['']
        const newFollowing = oldFollowing?.filter((item) => item !== _id) || ['']
        client.mutate({
            mutation: FOLLOW_USER,
            variables: {
                uid: _id,
                followers: newFollowers.length > 0 ? newFollowers : ['']
            }
        }).then(() => client.mutate({
            mutation: FOLLOWING_USER,
            variables: {
                uid: user.uid,
                following: newFollowing.length > 0 ? newFollowing : ['']
            }
        })).then(() => refetch())
        .catch((err) => console.log(err))

    }

    return (
        <View style={[styles.flex, styles.mainContainer]}>
            <View style={styles.profileContainer}>
                <View style={styles.upperContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.imgResponsive}
                            source={avatar ? { uri: avatar } : require('../../../assets/images/avatar.png')}
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
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[btnStyles.emptyButton, { backgroundColor: colors.fontPlaceholder }]}
                                    onPress={() => uid ? unfollow() : navigation.navigate('Registration')}
                                    >
                                    <TextDefault textColor={colors.buttonbackground} H4 bolder center>
                                        {'Отпоследвай'}
                                    </TextDefault>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.editButton}>
                                <EmptyButton title='Последвай' 
                                    onPress={() => uid ? follow() : navigation.navigate('Registration')}/>
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
            <View style={[s.flex, s.container, { backgroundColor: 'transparent' }]}>
                <TextDefault textColor={colors.fontSecondColor} bold style={[alignment.MBxSmall, alignment.PLsmall, alignment.MTlarge]} uppercase>
                    Обяви
                </TextDefault>
                <FlatList
                    data={items}
                    style={[s.flex, s.flatList]}
                    contentContainerStyle={{ flexGrow: 1, ...alignment.PBlarge }}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<TextDefault H4 bold center style={alignment.MTmedium}>Няма обяви</TextDefault>}
                    numColumns={3}
                    renderItem={({ item }) => (
                        <Card {...item} />
                    )}
                />
            </View>
        </View >
    )
}

export default React.memo(UserProfile)