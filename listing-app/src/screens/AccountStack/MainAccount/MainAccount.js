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
    const { isLoggedIn, userId, ...user } = useSelector(state => state.user)
    const { name, avatar, email } = user
    const navigation = useNavigation()
    const [getZones, { loading, data, error }] = useLazyQuery(GET_ZONES_QUERY);
    
    return (
        <View style={[styles.flex, styles.container]}>
            <View style={styles.profileContainer}>
                <View style={styles.imageContainer}>
                    { avatar ?
                        <Image
                            style={styles.imgResponsive}
                            source={{ uri: avatar }}
                            resizeMode='cover'
                        />
                        : 
                        <Image
                            style={styles.imgResponsive}
                            source={require('../../../assets/images/avatar.png')}
                            resizeMode='cover'
                        />
                    }
                </View> 
                <View style={[styles.flex, styles.profileInfo]}>
                    <TextDefault H4 bold style={alignment.MBmedium}>
                        {isLoggedIn ? name : 'Гост'}
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
                            {'My Network'}
                        </TextDefault>
                        <TextDefault light style={[alignment.PLlarge, alignment.MTxSmall]}>
                            {'Followers, following and find friends'}
                        </TextDefault>
                    </View>
                    <Entypo name="chevron-small-right" size={scale(30)} color={colors.buttonbackground} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallContainer} onPress={() => navigation.navigate('Settings')}>
                    <AntDesign name="setting" size={scale(22)} color={colors.buttonbackground} />
                    <View style={[styles.flex]}>
                        <TextDefault bold H5 style={alignment.PLlarge}>
                            {'Settings'}
                        </TextDefault>
                        <TextDefault light style={[alignment.PLlarge, alignment.MTxSmall]}>
                            {'Privacy and logout'}
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
                        {'Help and Support'}
                    </TextDefault>
                    <TextDefault light style={[alignment.PLlarge, alignment.MTxSmall]}>
                        {'Help center, Terms and conditions, Privacy policy'}
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
