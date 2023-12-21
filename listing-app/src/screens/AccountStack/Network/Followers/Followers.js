import React, { useEffect, useState } from 'react'
import { Image, View, FlatList, Share } from 'react-native'
import { EmptyButton, FlashMessage, TextDefault } from '../../../../components'
import { alignment, colors } from '../../../../utilities'
import Card from './Card'
import styles from './styles'
import { useLazyQuery } from '@apollo/client'
import { GET_AVATAR_NAME_DESCRIPTION_CREATED_AT } from '../../../../apollo/server'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowers } from '../../../../store/reducers/User/userSlice'

function Followers() {
    const { uid, followers } = useSelector(state => state.user);
    const [getUserById, { loading, error, data, refetch }] = useLazyQuery(GET_AVATAR_NAME_DESCRIPTION_CREATED_AT);
    const dispatch = useDispatch();   
    
    useEffect(() => {
        async function fetchData() {
            try {
                let filteredFollowers = followers.filter(favorite => favorite !== '');
                filteredFollowers = Array.from(new Set(filteredFollowers));
    
                // Fetch each favorite item details
                const followersItemsPromises = filteredFollowers.map(followersId =>
                    getUserById({ variables: { userId: followersId } }).then(response => response.data.getUserById)
                );
    
                // Wait for all the items to be fetched
                const dataList = await Promise.all(followersItemsPromises);
                const newItems = dataList.reduce((unique, item) => {
                    if (item && !unique.some(i => i.id === item._id)) {
                        unique.push(item);
                    }
                    return unique;
                }, []);
    
                dispatch(setFollowers(newItems));
            } catch (error) {
                console.error('Error fetching user followers:', error);
            }
        }
        fetchData();
        return () => {
            let oldFollowers = followers.map((followers) => {
                if(followers._id) followers._id
                else return followers 
            });
            oldFollowers = Array.from(new Set(oldFollowers));
          dispatch(setFollowers(oldFollowers));
        };
    }, []);

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
                        {'Ще е по-забавно да продаваш с приятелите си!'}
                    </TextDefault>
                    <View style={{ width: '70%' }}>
                        <EmptyButton title='Покани приятели'
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
                data={followers}
                ListEmptyComponent={emptyView()}
                ListHeaderComponent={followers.length > 0 && header()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Card {...item} />
                )}
            />
        </View>
    )
}
export default React.memo(Followers)