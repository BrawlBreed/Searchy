import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FlatList, Image, Share, View } from 'react-native'
import { EmptyButton, FlashMessage, TextDefault } from '../../../../components'
import { alignment, colors } from '../../../../utilities'
import Card from './Card'
import styles from './styles'
import { GET_AVATAR_NAME_DESCRIPTION_CREATED_AT } from '../../../../apollo/server'
import { useLazyQuery } from '@apollo/client'
import { useSelector } from 'react-redux'

function Following() {
    const [items, setItems] = useState([]);
    const { uid } = useSelector(state => state.user);
    const [getOwnUserData, { loading: l, error: e, data: d, refetch: r}] = useLazyQuery(GET_AVATAR_NAME_DESCRIPTION_CREATED_AT);
    const [getUserById, { loading, error, data, refetch }] = useLazyQuery(GET_AVATAR_NAME_DESCRIPTION_CREATED_AT);
     
    useEffect(() => {
        const fetchUserFollowing = async (following) => {
            try {
                const filteredFollowing = following.filter(favorite => favorite !== '');
    
                // Fetch each favorite item details
                const followingItemsPromises = filteredFollowing.map(followingId =>
                    getUserById({ variables: { userId: followingId } }).then(response => response.data.getUserById)
                );
    
                // Wait for all the items to be fetched
                const dataList = await Promise.all(followingItemsPromises);
                const newItems = dataList.reduce((unique, item) => {
                    if (item && !unique.some(i => i.id === item._id)) {
                        unique.push(item);
                    }
                    return unique;
                }, []);
    
                setItems(newItems);
            } catch (error) {
                console.error('Error fetching user following:', error);
            }
        };
    
        if (uid) {
            r().then(() => refetch()).then(() =>
                getOwnUserData({ variables: { userId: uid } }).then(async (response) => {
                    const following = response.data.getUserById.following;
                    await fetchUserFollowing(Array.from(new Set(following)));
                })
            );
        }
    }, [uid]); // Ensure uid and getOwnUserData are in the dependency array
    
    async function share() {
        try {
            const result = await Share.share({
                title: 'Покани приятели',
                message:
                    'Инсталирай приложението и се присъедини към нас!',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    FlashMessage({ message: 'Поканата беше изпратена', type: 'success' });
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
                    {"Не следваш никой все още.."}
                </TextDefault>
                <TextDefault H5 center light style={alignment.MTsmall}>
                    {'Когато последваш някой - ще се появи тук!'}
                </TextDefault>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.notificationContainer}>
                <View style={styles.imgResponsive}>
                    <Image style={styles.img} source={require('../../../../assets/images/emptyView/notification.png')} />
                </View>
                <View style={styles.notificationText}>
                    <TextDefault textColor={colors.buttonbackground} H5 center >
                        {'Покани приятелите си да се присъединят към теб!'}
                    </TextDefault>
                    <View style={{ width: '70%' }}>
                        <EmptyButton
                            title='Покани приятели'
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
                    item.following &&
                    <Card r={r} refetch={refetch} {...item} />
                )}
            />
        </View>
    )
}
export default React.memo(Following)