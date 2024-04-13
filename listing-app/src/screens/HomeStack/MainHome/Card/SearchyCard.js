import { FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { TextDefault } from '../../../../components';
import { colors, scale } from '../../../../utilities';
import styles from '../styles';
import { useSelector } from 'react-redux';
 
function SearchyCard(props) {
    const navigation = useNavigation()
    const { uid } = useSelector(state => state.user)

    useEffect(() => console.log(props), [])

    return (
        <TouchableOpacity activeOpacity={1}
            style={[styles.productCardContainer]}
            onPress={() => props?.user._id === uid ? navigation.navigate('Add')
            : navigation.navigate('SearchyDescription', { ...props })}>
            <View style={styles.topCardContainer}>
                <Image
                    source={{ uri: props.image }}
                    resizeMode="cover"
                    style={styles.imgResponsive}
                />
            </View>
            <View style={styles.botCardContainer}>
                <View>
                    <TextDefault textColor={[colors.fontMainColor]} H5 center>
                        Търся си  <TextDefault textColor={colors.fontMainColor} H5 bolder>{props?.title}</TextDefault>
                    </TextDefault>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default SearchyCard