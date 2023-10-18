import { Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { TextDefault } from '../../../components';
import { alignment, colors, scale } from '../../../utilities';
import styles from './styles';
import useSubCategories from '../../../hooks/useSubCategories';

const COLORS = ['#ffd54d', '#6df8f3', '#ff7a7a', '#d5b09f', '#eccbcb']

function Categories() {
    const navigation = useNavigation()
    const route = useRoute()
    const screen = route.params?.screen ?? null

    const { loading, error, subCategories } = useSubCategories()

    function emptyView() {
        return (
            <View style={[styles.flex, styles.emptyContainer]}>
                <Image
                    style={styles.emptyImage}
                    source={require('../../../assets/images/emptyView/noData.png')}
                />
                <TextDefault H5 center bold style={alignment.MTlarge}>
                    {'Не бяха намерени категории.'}
                </TextDefault>
            </View>
        )
    }

    return (
        <View style={[styles.flex, styles.container]}>
            <FlatList
                data={subCategories}
                style={styles.flatList}
                contentContainerStyle={styles.categoryContainer}
                ListEmptyComponent={emptyView}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.spacer} />}
                renderItem={({ item : {image, title, subCategories}, index }) => (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.categoryRow}
                        // onPress={() => navigation.dispatch(StackActions.push('SubCategories', { headerTitle: item.title, screen: screen }))}>
                        onPress={() => navigation.navigate('SubCategories', { headerTitle: title, screen: screen, subCategories: subCategories })}>
                        <View style={styles.rowContainer}>
                            <View style={[styles.image, { backgroundColor: COLORS[index % 5] }]}>
                                <Image
                                    style={styles.imgResponsive}
                                    source={image}
                                />
                            </View>
                            <TextDefault H5 style={styles.fontText}>
                                {title}
                            </TextDefault>
                            <View style={styles.rightIcon}>
                                <Entypo name='chevron-small-right' size={scale(20)} color={colors.buttonbackground} />
                            </View>
                        </View>

                    </TouchableOpacity>
                )
                }
            />

        </View >
    );
} 

export default Categories
