import React, { useEffect, useState } from 'react'
import { Image, View, TouchableOpacity } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { TextDefault, UnfollowModal } from '../../../../components'
import { alignment, colors, scale } from '../../../../utilities'
import styles from './styles'
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { filterFalsyValues } from '../../../../utilities/methods'
import { client } from '../../../../apollo'
import { FOLLOWING_USER, FOLLOW_USER } from '../../../../apollo/server'

function Card(props) {
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false)
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
    
    useEffect(() => {
        setFollowersList(filterFalsyValues(props?.followers))
        setFollowingList(filterFalsyValues(props?.following))
    }, [props.following, props.followers, props.refresh])
    
    function follow () {
        try{
            const newFollowers = [...filterFalsyValues([...followersList, uid])]
            const newFollowing = [...filterFalsyValues([...followingList, props._id])]
            client.mutate({
                mutation: FOLLOW_USER,
                variables: {
                    uid: props._id,
                    followers: newFollowers.length > 0 ? newFollowers : ['']
                }
            }).then(() => client.mutate({
                mutation: FOLLOWING_USER,
                variables: {
                    uid: uid,
                    following: newFollowing.length > 0 ? newFollowing : ['']
                }
            })).then(() => {
                props.r()
                props.refetch()
            }).then(() => navigation.navigate('MainAccount'))
        }
        catch(error){
            console.log(error)
        }
    }

    function unfollow () {
        try{
            const newFollowers = followersList.filter((item) => item !== uid)
            const newFollowing = followingList.filter((item) => item !== props._id)
            client.mutate({
                mutation: FOLLOW_USER,
                variables: {
                    uid: props._id,
                    followers: newFollowers.length > 0 ? newFollowers : ['']
                }
            }).then(() => client.mutate({
                mutation: FOLLOWING_USER,
                variables: {
                    uid: uid,
                    following: newFollowing.length > 0 ? newFollowing : ['']
                }
            })).then(() => {
                props.refetch()
                props.r()
                navigation.navigate('MainAccount')
            })
        }catch(error){
            console.log(error)
        }
        
        onModalToggle()
    }

    return (
        <>
            <View style={styles.userContainer}>
                <TouchableOpacity activeOpacity={1}
                    onPress={() => navigation.navigate('UserProfile', { ...props })} style={styles.avatar}>
                    <Image style={styles.img} source={props.avatar ? { uri: props.avatar } : require('../../../../assets/images/avatar.png')} />
                </TouchableOpacity >
                <TextDefault textColor={colors.buttonbackground} bold style={[alignment.PLmedium, styles.flex]}>
                    {props.name}
                </TextDefault>
                <BorderlessButton
                    style={alignment.Psmall}
                    onPress={props.isFollowing ? onModalToggle : follow}>
                    {props.isFollowing ?
                        <Feather name="user-check" size={scale(20)} color="black" /> :
                        <Feather name="user-plus" size={scale(20)} color="black" />
                    }
                </BorderlessButton>
            </View>
            <UnfollowModal unfollow={unfollow} modalVisible={modalVisible} onModalToggle={onModalToggle} onFollowing={onFollowing} name={props.name} />
        </>
    )
}

export default React.memo(Card)