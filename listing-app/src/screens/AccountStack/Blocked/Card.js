import React, { useEffect, useState } from 'react'
import { Image, View, TouchableOpacity } from 'react-native'
import { BorderlessButton } from 'react-native-gesture-handler'
import { alignment, colors, scale, textStyles } from '../../../utilities'
import styles from './styles'
import { TextDefault } from '../../../components'
import UnblockModal from './UnblockModal'
import { useSelector } from 'react-redux'
import { toggleStringInArray } from '../../../utilities/methods'
// import { useNavigation } from '@react-navigation/native';

function Card(props) {
    const [modalVisible, setModalVisible] = useState(false)
    const { blockedUsers } = useSelector(state => state.user)
    const [ newBlockedUsers, setNewBlockedUsers ] = useState(blockedUsers)

    useEffect(() => {
        const newBlockedUsers = toggleStringInArray([...blockedUsers], props._id)
        setNewBlockedUsers(newBlockedUsers)
    }, [])
    function onModalToggle(){
        setModalVisible(!modalVisible)
    }
    return (
        <View style={styles.userContainer}>
            {modalVisible && <UnblockModal blockedUsers={newBlockedUsers} modalVisible={modalVisible} onModalToggle={onModalToggle}/>}
            <TouchableOpacity style={styles.avatar} onPress={() => {}}>
                <Image style={[styles.img, { borderRadius: 1000 }]} source={props.avatar ? {uri: props.avatar} : require('../../../assets/images/avatar.png')} />
            </TouchableOpacity>
            <TextDefault textColor={colors.buttonbackground} bold style={[alignment.PLmedium, styles.flex]}>
                {props.name}
            </TextDefault>
            <BorderlessButton
                style={alignment.Psmall}
                onPress={onModalToggle}>
                    <TouchableOpacity>
                        <TextDefault textColor={colors.google} style={[styles.flex, alignment.PLmedium, textStyles.Regular, textStyles.UpperCase]}>Отблокирай</TextDefault>
                    </TouchableOpacity>
                
            </BorderlessButton>
        </View>
    )
}

export default React.memo(Card)