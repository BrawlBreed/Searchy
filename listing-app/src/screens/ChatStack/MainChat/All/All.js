import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Image, View, TouchableOpacity, FlatList } from 'react-native';
import { EmptyButton, TextDefault } from '../../../../components';
import { alignment, colors, scale } from '../../../../utilities';
import styles from './styles';
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BorderlessButton, BaseButton, RectButton } from 'react-native-gesture-handler';
import { fetchChatsByUserID } from '../../../../firebase';
import { useSelector } from 'react-redux';
import { getDurationFromFirestoreTimestamp } from '../../../../store/reducers/Item/helpers';
import { GET_AVATAR_NAME_DESCRIPTION_CREATED_AT } from '../../../../apollo/server';
import { useLazyQuery } from '@apollo/client';

function ALL() {
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    // const [filter, setFilter] = useState(FILTERS[0].value)
    const [ chats, setChats ] = useState([]);
    const { uid } = useSelector(state => state.user);
    const [getAvatarAndName, { data }] = useLazyQuery(GET_AVATAR_NAME_DESCRIPTION_CREATED_AT);

    useLayoutEffect(() => {
        const fetchMessagesByChatId = async () => {
            try {
                const chats = await fetchChatsByUserID(uid);
    
                // Resolve all promises generated by the map
                const chatListPromises = chats.map(async (chat) => {
                    const id = chat.id;
                    const name = chat?.recentMessage?.sentBy?.name;
                    const lastMessage = chat?.recentMessage?.messageText;
                    const duration = getDurationFromFirestoreTimestamp(chat?.recentMessage?.sentAt);
                    const adTitle = chat.title;
                    const addPic = chat.image;
                    const adId = chat.adId;
                    const userId = chat.members.filter((member) => member !== uid)[0];
                    const res = await getAvatarAndName({ variables: { userId: userId } });
    
                    return {
                        id,
                        name,
                        lastMessage,
                        duration,
                        adTitle,
                        adId,
                        addPic,
                        imaga: res?.data?.getUserById?.avatar,
                        username: res.data.getUserById.name,
                        createdAt: res.data.getUserById?.createdAt,
                        description: res.data.getUserById?.description,
                        userId
                    };
                });
    
                // Wait for all chatListPromises to resolve
                const chatList = await Promise.all(chatListPromises);
    
                // Now that all promises have resolved, set the state
                setChats(chatList);
            } catch (error) {
                console.error('Error fetching messages:', error);
                // Handle error appropriately
            }
        };
    
        if (isFocused) {
            fetchMessagesByChatId();
        }
    }, [isFocused, uid]); // Add uid to the dependency array if it's a state or prop
    
    function emptyView() {
        return (
            <View style={[styles.flex, styles.emptyContainer]}>
                <Image
                    style={styles.emptyImage}
                    source={require('../../../../assets/images/emptyView/email.png')}
                />
                <TextDefault H4 center bold style={alignment.MTlarge}>
                    {"Нямаш съобщения, още?"}
                </TextDefault>
                <TextDefault H5 center light style={alignment.MTsmall}>
                    {"Когато някой ти пише, ще го видиш тук."}
                </TextDefault>
                <EmptyButton
                    title='Виж последните обяви'
                    onPress={() => navigation.navigate('Main')}
                />
            </View>
        )
    }

    return (
        <View style={[styles.flex, styles.mainContainer]}>
            {/* {emptyView()} */}
            <FlatList
                data={chats}
                style={styles.flex}
                contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.themeBackground }}
                ListHeaderComponent={() => <View style={styles.header} />}
                ListEmptyComponent={emptyView}
                ItemSeparatorComponent={() => <View style={styles.seperator} />}
                stickyHeaderIndices={[0]}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.07}
                        style={styles.messageContainer}
                        onPress={() => {
                            navigation.navigate('LiveChat', { id: item.id, name: item.username, image: item.addPic, avatar: item.imaga, uid: item.userId, adId: item.adId, description: item.description, createdAt: item.createdAt })
                        }}>
                        <View style={styles.imgResposive}>
                            <Image
                                style={styles.image}
                                source={{uri:item.addPic}}
                            />
                            <Image
                                style={styles.profileImg}
                                source={!item.imaga || item.imaga === "false" ? require('../../../../assets/images/avatar.png') : { uri: item.imaga }}
                            />
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={styles.infoBox}>
                                <View style={styles.messageIcon}>
                                    <TextDefault H5 bold style={[styles.flex, alignment.MBxSmall]}>
                                        {item.adTitle}
                                    </TextDefault>
                                    <TextDefault light>
                                        {item.duration}
                                    </TextDefault>
                                </View>
                                <View style={styles.messageIcon}>
                                    <TextDefault numberOfLines={1} style={[styles.flex, alignment.MRxSmall]}>
                                        {item.username}
                                    </TextDefault>
                                    {/* <TouchableOpacity onPress={(e) => {
                                        e.stopPropagation();
                                    }}>
                                        <MaterialCommunityIcons name="dots-vertical" size={scale(20)} color="black" />
                                    </TouchableOpacity> */}
                                </View>
                                <View style={styles.messageIcon}>
                                    <SimpleLineIcons name="envelope" size={scale(15)} color={colors.fontSecondColor} />
                                    <TextDefault numberOfLines={1} textColor={colors.fontSecondColor} style={[alignment.MLxSmall, styles.flex]}>
                                        {`${item.lastMessage || 'Няма съобщения'}`}
                                    </TextDefault>
                                </View>
                            </View>
                            <View style={styles.line} />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default React.memo(ALL)    


// function header() {
    //     return (
    //         <View style={styles.filterContainer}>
    //             <TextDefault uppercase>
    //                 {'QUICK FILTERs'}
    //             </TextDefault>
    //             <View style={styles.filterRow}>
    //                 {FILTERS.map((item) => (
    //                     <TouchableOpacity key={item.value}
    //                         style={[styles.boxContainer, item.value === filter ? styles.selected : styles.notSelected]}
    //                         onPress={() => setFilter(item.value)}>
    //                         <TextDefault style={item.value === filter ? styles.selectedText : styles.unSelectedText}>
    //                             {item.title}
    //                         </TextDefault>
    //                     </TouchableOpacity>
    //                 ))}
    //             </View>
    //         </View>
    //     )
    // }

    // const FILTERS = [
//     {
//         value: 0,
//         title: 'All'
//     },
//     {
//         value: 1,
//         title: 'Unread'
//     },
//     {
//         value: 2,
//         title: 'Important'
//     }
// ]
