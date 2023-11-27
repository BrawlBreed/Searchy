import { useNavigation } from '@react-navigation/native'
import React, { useLayoutEffect, useState, useCallback, useEffect } from 'react'
import { Platform, View, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LiveHeader } from '../../../components'
import styles from './styles'
import { GiftedChat } from 'react-native-gifted-chat';
import { addMessage, dbFirestore, fetchMessagesByChatId, getMessages, saveMessage } from '../../../firebase'
import { useSelector } from 'react-redux'
import { onSnapshot } from 'firebase/firestore'

function LiveChat({ route }) {
    const navigation = useNavigation()
    const [messages, setMessages] = useState([])
    const user = useSelector(state => state.user)
    const { id, image, name, avatar, uid } = route.params

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <LiveHeader />
        })
        navigation.setParams({
            id: id,
            uid: uid,
            name: name,
            image: image,
            avatar: avatar
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
                <GiftedChat
                    messages={messages}
                    onSend={messages => onSend(messages)}
                    user={{name: user.name, _id: user.uid, avatar: user.avatar}}
                />
            </View>

        </SafeAreaView>
    ) 
}

export default React.memo(LiveChat)