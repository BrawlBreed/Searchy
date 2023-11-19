import { FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { TextDefault } from '../../../../components';
import { colors, scale } from '../../../../utilities';
import styles from '../styles';
 
function Card(props) {
    const navigation = useNavigation()
    const [isLike, isLikeSetter] = useState(null) 

    return (
        <TouchableOpacity activeOpacity={1}
            style={styles.productCardContainer}
            onPress={() => navigation.navigate('ProductDescription', { ...props, isLike, isLikeSetter })}>
            <View style={styles.topCardContainer}>
                <Image
                    source={{ uri: props.image }}
                    resizeMode="cover"
                    style={styles.imgResponsive}
                />
            </View>
            <View style={styles.botCardContainer}>
                <View>
                    <TextDefault textColor={colors.fontMainColor} H5 bolder>
                        {props.price} лв.
                    </TextDefault>
                    <TextDefault textColor={colors.fontSecondColor} numberOfLines={1}>
                        {props.title}
                    </TextDefault>
                </View>
                <View style={styles.locationBottom}>
                    <SimpleLineIcons name="location-pin" size={scale(15)} color={colors.buttonbackground} />
                    <TextDefault textColor={colors.fontSecondColor} numberOfLines={1} light small style={styles.locationText}>
                        {props.location}
                    </TextDefault>  
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default Card