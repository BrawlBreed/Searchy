import React, { useEffect, useState } from 'react'
import { Image, View, TouchableOpacity } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { TextDefault, UnfollowModal } from '../../../../components'
import { alignment, colors, scale } from '../../../../utilities'
import styles from './styles'
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { FOLLOWING_USER, FOLLOW_USER } from '../../../../apollo/server'
import { filterFalsyValues } from '../../../../utilities/methods'
import { useSelector } from 'react-redux'
import { client } from '../../../../apollo'

function Card(props) {
    const [modalVisible, setModalVisible] = useState(false)
    const navigation = useNavigation()
    const { uid } = useSelector(state => state.user)
    const [followingList, setFollowingList] = useState([])
    const [followersList, setFollowersList] = useState([])

    function onModalToggle() {
        setModalVisible(prev => !prev)
    }
    function onFollowing() {
        setFollowingList(prev => !prev)
    }

    if (!followingList)
        return null
    
    return (
        <View style={styles.userContainer}>
            <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('UserProfile', { ...props, following: props.following })}>
                <Image style={[styles.img, { borderRadius: 1000 }]} source={props?.avatar ? {uri: props.avatar} : require('../../../../assets/images/avatar.png')} />
            </TouchableOpacity>
            <TextDefault textColor={colors.buttonbackground} bold style={[alignment.PLmedium, styles.flex]}>
                {props?.name}
            </TextDefault>
            {/* <BorderlessButton
                style={alignment.Psmall}
                onPress={onModalToggle}>
                <Feather name="user-check" size={scale(20)} color="black" />
            </BorderlessButton> */}
            <UnfollowModal modalVisible={modalVisible} onModalToggle={onModalToggle} onFollowing={onFollowing} name={props.name} />
        </View>
    )
}

export default React.memo(Card)