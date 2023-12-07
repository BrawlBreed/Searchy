import React, { useEffect, useState } from 'react'
import { Image, View, FlatList, Share } from 'react-native'
import { EmptyButton, FlashMessage, TextDefault } from '../../../../components'
import { alignment, colors } from '../../../../utilities'
import Card from './Card'
import styles from './styles'
import { useLazyQuery } from '@apollo/client'
import { FOLLOWING_USER, FOLLOW_USER, GET_AVATAR_NAME_DESCRIPTION_CREATED_AT } from '../../../../apollo/server'
import { useSelector } from 'react-redux'

function Followers() {
    const [items, setItems] = useState([]);
    const { uid } = useSelector(state => state.user);
    const [getOwnUserData, { loading: l, error: e, data: d, refetch: r }] = useLazyQuery(GET_AVATAR_NAME_DESCRIPTION_CREATED_AT);
    const [getUserById, { loading, error, data, refetch }] = useLazyQuery(GET_AVATAR_NAME_DESCRIPTION_CREATED_AT);
     
    useEffect(() => {
        const fetchUserFollowers = async () => {
            try {
                const response = await getOwnUserData({ variables: { userId: uid } });
                const followers = response.data.getUserById.followers || [];
    
                const filteredFollowers = followers.filter(followerId => followerId !== '');
    
                // Fetch each follower's details
                const followersItemsPromises = filteredFollowers.map(followerId =>
                    getUserById({ variables: { userId: followerId } }).then(response => response.data.getUserById)
                );
    
                // Wait for all the items to be fetched
                const followersItemsResponses = await Promise.all(followersItemsPromises);
    
                // Process and set the items
                const newItems = followersItemsResponses.reduce((unique, item) => {
                    if (item && !unique.some(i => i.id === item.id)) {
                        unique.push({ ...item, isFollowing: item.followers.includes(uid)});
                    }
                    return unique;
                }, []);
                setItems(newItems);
            } catch (error) {
                console.error('Error fetching user followers:', error);
            }
        };
    
        if (uid) {
            fetchUserFollowers();
        }
    }, [uid, data]);
    
    async function share() {
        try {
            const result = await Share.share({
                title: 'App link',
                message:
                    'Install this app and enjoy your friend community',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    FlashMessage({ message: 'The invitation has been sent', type: 'success' });
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            FlashMessage({ message: error.message, type: 'warning' });
        }
    }

    function emptyView() {
        return (
            <View style={[styles.flex, styles.emptyContainer]}>
                <Image
                    style={styles.emptyImage}
                    source={require('../../../../assets/images/emptyView/followers.png')}
                />
                <TextDefault H4 center bold style={alignment.MTlarge}>
                    {"Нямаш последователи все още.."}
                </TextDefault>
                <TextDefault H5 center light style={alignment.MTsmall}>
                    {'Когато някой те последва - ще се появи тук.'}
                </TextDefault>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.notificationContainer}>
                <View style={styles.imgResponsive}>
                    <Image style={styles.img} source={require('../../../../assets/images/emptyView/network.png')} />
                </View>
                <View style={styles.notificationText}>
                    <TextDefault textColor={colors.buttonbackground} H5 center >
                        {'APP is more fun shared with friends'}
                    </TextDefault>
                    <View style={{ width: '70%' }}>
                        <EmptyButton title='Invite Friends'
                            onPress={share} />
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={[styles.flex, styles.mainContainer]}>
            <FlatList
                style={styles.flex}
                contentContainerStyle={[styles.mainContainer, { flexGrow: 1 }]}
                data={items}
                ListEmptyComponent={emptyView()}
                ListHeaderComponent={items.length > 0 && header()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Card r={r} refetch={refetch} {...item} />
                )}
            />
        </View>
    )
}
export default React.memo(Followers)