import { AntDesign, Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { EmptyButton, TextDefault } from '../../../components';
import { alignment, colors, scale } from '../../../utilities';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../../../store/reducers/User/userSlice';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { GET_ZONES_QUERY } from '../../../apollo/server'

function MainAccount() {   
    const { isLoggedIn, userId, name, avatar, email } = useSelector(state => state.user)
    const navigation = useNavigation()
    const [getZones, { loading, data, error, refetch }] = useLazyQuery(GET_ZONES_QUERY, {
        variables: {
            userId: userId
        }
    });
    const dispatch = useDispatch()

    useEffect(() => {
        refetch().then(() => getZones())
    }, [data])

    useEffect(() => {
        if(data?.getUserById) {
            dispatch(setCurrentUser(data?.getUserById))
        }
    }, [data])
    
    return (
        <View style={[styles.flex, styles.container]}>
            <View style={styles.profileContainer}>
                <View style={styles.imageContainer}>
                        <Image
                            style={styles.imgResponsive}
                            source={avatar ? { uri: avatar } : require('../../../assets/images/avatar.png')}
                            resizeMode='cover'
                        />
                </View> 
                <View style={[styles.flex, styles.profileInfo]}>
                    <TextDefault H4 bold style={alignment.MBmedium}>
                        {isLoggedIn ? name ? name : email?.split('@')[0] : 'Гост'}
                    </TextDefault>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={alignment.PBxSmall}
                        onPress={() =>
                            isLoggedIn ?
                                navigation.navigate('Profile')
                                :
                                navigation.navigate('Registration')
                        }
                    >
                        <TextDefault textColor={colors.spinnerColor} H5 bold>
                            {isLoggedIn ? 'Редактирай профил' : 'Влез в профил'}
                        </TextDefault>
                    </TouchableOpacity>
                </View>
            </View>
            {isLoggedIn && <>
                <TouchableOpacity style={styles.smallContainer} onPress={() => navigation.navigate('Network')}>
                    <FontAwesome5 name="users" size={scale(20)} color={colors.buttonbackground} />
                    <View style={[styles.flex]}>
                        <TextDefault bold H5 style={alignment.PLlarge}>
                            {'Социална мрежа'}
                        </TextDefault>
                        <TextDefault light style={[alignment.PLlarge, alignment.MTxSmall]}>
                            {'Последователи, следващи, приятели'}
                        </TextDefault>
                    </View>
                    <Entypo name="chevron-small-right" size={scale(30)} color={colors.buttonbackground} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallContainer} onPress={() => navigation.navigate('Settings')}>
                    <AntDesign name="setting" size={scale(22)} color={colors.buttonbackground} />
                    <View style={[styles.flex]}>
                        <TextDefault bold H5 style={alignment.PLlarge}>
                            {'Настройки'}
                        </TextDefault>
                        <TextDefault light style={[alignment.PLlarge, alignment.MTxSmall]}>
                            {'Излез от профил, изтрий профил'}
                        </TextDefault>
                    </View>
                    <Entypo name="chevron-small-right" size={scale(30)} color={colors.buttonbackground} />
                </TouchableOpacity>
            </>
            } 
            <TouchableOpacity style={styles.smallContainer} onPress={() => navigation.navigate('Help')}>
                <Ionicons name="ios-help-circle-outline" size={scale(22)} color={colors.buttonbackground} />
                <View style={[styles.flex]}>
                    <TextDefault bold H5 style={alignment.PLlarge}>
                        {'Помощ'}
                    </TextDefault>
                    <TextDefault light style={[alignment.PLlarge, alignment.MTxSmall]}>
                        {'Помощ и поддръжка'}
                    </TextDefault>
                </View>
                <Entypo name="chevron-small-right" size={scale(30)} color={colors.buttonbackground} />
            </TouchableOpacity>
            {!isLoggedIn && <View style={styles.loginBtn}>
                <EmptyButton
                    title='Вход'
                    onPress={() => navigation.navigate('Registration')} />
            </View>}
        </View >
    );
}

export default MainAccount
