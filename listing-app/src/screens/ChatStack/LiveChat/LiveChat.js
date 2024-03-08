import { useNavigation } from '@react-navigation/native'
import React, { useLayoutEffect, useState, useCallback, useEffect } from 'react'
import { Platform, View, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LiveHeader, TextDefault } from '../../../components'
import styles from './styles'
import { GiftedChat } from 'react-native-gifted-chat';
import { addMessage, dbFirestore, fetchBlockedUsers, fetchMessagesByChatId, getMessages, saveMessage } from '../../../firebase'
import { useSelector } from 'react-redux'
import { onSnapshot } from 'firebase/firestore'

function LiveChat({ route }) {
    const navigation = useNavigation()
    const [messages, setMessages] = useState([])
    const {blockedUsers, ...user} = useSelector(state => state.user)
    const { id, image, name, avatar, uid, adId, description, createdAt, ownedItems } = route.params
    const [blocked, setBlocked] = useState(false)

    const setConversationStatus = async () => {
        const userBlockedUsers = await fetchBlockedUsers(uid)
        setBlocked(userBlockedUsers?.includes(user.uid) || blockedUsers?.includes(uid))
    }

    useEffect(() => {
        setConversationStatus()
    }, [blockedUsers])

    const renderChatFooter = () => {
        if (blocked) {
            return(
            <View style={styles.noMoreRepliesContainer}>
            <TextDefault style={styles.noMoreRepliesText}>
            Не можете да отговаряте/пишете повече в този чат.
            </TextDefault>
        </View>
        );      
    }}

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <LiveHeader />
        })
        navigation.setParams({
            id, 
            uid,
            name,
            image,
            avatar,
            adId,
            description, 
            createdAt,
            ownedItems
        })
    }, [navigation])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

        const { _id, createdAt, text, user } = messages[0]
        saveMessage({text: text, createdAt: createdAt, id: route.params.id, user: user})
            .then(savedMessage => {
            })
            .catch(error => {
                console.error('Error saving message:', error);
            });    
    })

    useEffect(() => {
        const unsubscribe = fetchMessagesByChatId(id, setMessages);
        return () => unsubscribe();
    }, [id])

    return (
        <SafeAreaView edges={['left', 'right']} style={[styles.flex, styles.safeAreaViewStyles,]}>
            <View style={[styles.flex, styles.mainContainer]}>
                {blocked ? 
                <GiftedChat
                    messages={messages}
                    user={{ name: user.name, _id: user.uid, avatar: user.avatar }}
                    renderInputToolbar={(props) => <></>}
                    renderActions={null}
                    renderSend={null}
                    renderComposer={null}
                    renderAvatarOnTop={true}
                    renderAvatar={null}
                    minInputToolbarHeight={0}
                    renderChatFooter={renderChatFooter}
                />
                :
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{name: user.name, _id: user.uid, avatar: user.avatar}}
                />}
            </View>

        </SafeAreaView>
    ) 
}

export default React.memo(LiveChat)