import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { TextDefault } from '../../../../components'
import { colors, scale } from '../../../../utilities'
import styles from '../styles'

function ProductCard(props) {
    const [isLike, isLikeSetter] = useState(false)
    const navigation = useNavigation()
    
    return (
        <TouchableOpacity
            style={styles.searchCard}
            onPress={() => navigation.navigate('ProductDescription', { ...props })}>
            <Image
                source={props.image}
                style={styles.imgResponsive}
            />
            <View style={[styles.flex, styles.descriptionContainer]}>
                <View style={styles.likeRow}>
                    {props.featured ? (
                        <View style={styles.featured}>
                            <TextDefault bold small uppercase>
                                {'Featured'}
                            </TextDefault>
                        </View>
                    ) : (<View />)
                    }
                    <TouchableOpacity style={styles.likeContainer}
                        onPress={() => isLikeSetter(prev => !prev)}>
                        {isLike ? <FontAwesome name="heart" size={scale(20)} color="black" /> :
                            <FontAwesome name="heart-o" size={scale(20)} color="black" />
                        }
                    </TouchableOpacity>
                </View>
                <View style={[styles.flex, styles.infoContainer]}>
                    <View>
                        <TextDefault H5 bolder>
                            {props.price}
                        </TextDefault>
                        <TextDefault numberOfLines={1}>
                            {props.title}
                        </TextDefault>
                    </View>
                    <View style={styles.locationRow}>
                        <MaterialIcons name='location-on' size={scale(15)} color={colors.headerText} />
                        <TextDefault numberOfLines={1} small style={styles.locationText}>
                            {props.location}
                        </TextDefault>
                        <TextDefault numberOfLines={1} small uppercase>
                            {props.date}
                        </TextDefault>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ProductCard