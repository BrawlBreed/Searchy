import { FontAwesome, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { TextDefault } from '../../../../components';
import { colors, scale } from '../../../../utilities';
import styles from '../styles';

function Card(props) {
    const navigation = useNavigation()
    const [isLike, isLikeSetter] = useState(false) 

    return (
        <TouchableOpacity activeOpacity={1}
            style={styles.productCardContainer}
            onPress={() => navigation.navigate('ProductDescription', { ...props })}>
            <View style={styles.topCardContainer}>
                <Image
                    source={props.image}
                    resizeMode="cover"
                    style={styles.imgResponsive}
                />
                <TouchableOpacity activeOpacity={0}
                    onPress={() => isLikeSetter(prev => !prev)}
                    style={styles.heartContainer}>
                    {isLike ? <FontAwesome name="heart" size={scale(18)} color={colors.black} /> :
                        <FontAwesome name="heart-o" size={scale(18)} color={colors.horizontalLine} />
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.botCardContainer}>
                <View>
                    <TextDefault textColor={colors.fontMainColor} H5 bolder>
                        {props.price}
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

export default React.memo(Card)