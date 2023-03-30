import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { TextDefault } from '../../../../../components';
import { colors, scale } from '../../../../../utilities';
import styles from '../styles';

function Card(props) {
    const navigation = useNavigation()
    return (
        <TouchableOpacity activeOpacity={1}
            style={styles.productCardContainer}
            onPress={() => navigation.navigate('ProductDescription')}>
            <View style={styles.topCardContainer}>
                <Image
                    source={props.image}
                    resizeMode="cover"
                    style={styles.imgResponsive}
                />
                <View activeOpacity={0}
                    style={styles.heartContainer}>
                    <FontAwesome name="heart" size={scale(20)} color={colors.buttonbackground} />
                </View>
            </View>
            <View style={styles.botCardContainer}>
                <TextDefault numberOfLines={2} textColor={colors.fontMainColor}>
                    {props.title}
                </TextDefault>
                <TextDefault textColor={colors.fontMainColor}>
                    {props.price}
                </TextDefault>
            </View>
        </TouchableOpacity>
    )
}

export default React.memo(Card)