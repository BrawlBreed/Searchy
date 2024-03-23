import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { FlatList, Image, View } from 'react-native';
import { EmptyButton, TextDefault } from '../../../../components';
import { alignment, colors } from '../../../../utilities';
import Card from './Card/Card';
import styles from './styles';
import { useSelector, useDispatch } from 'react-redux';
import useFavorites from '../../../../hooks/useFavorites';

function Favourite() {
    const navigation = useNavigation()
    const { items, loading, error } = useFavorites({ fetchPolicy: 'network-only'});

    function emptyView() {
        return (
            <View style={[styles.flex, styles.emptyContainer]}>
                <Image
                    style={styles.emptyImage}
                    source={require('../../../../assets/images/emptyView/favourite.png')}
                />
                <TextDefault H4 center bold style={alignment.MTlarge}>
                    {"Няма добавени любими продукти."}
                </TextDefault>
                <TextDefault H5 center light style={alignment.MTsmall}>
                    {"Добавете продукти в любими, за да ги откриете по-лесно!"}
                </TextDefault>
                <EmptyButton
                    title='Добави продукти'
                    onPress={() => navigation.navigate('Main')}
                />
            </View>
        )
    }

    return (
        <View style={[styles.flex, styles.mainContainer]}>
            <FlatList
                data={items}
                style={styles.flex}
                contentContainerStyle={{ flexGrow: 1 }}
                ListEmptyComponent={emptyView}
                numColumns={2}
                renderItem={({ item }) => (
                    <Card {...item} />
                )}
            />
        </View>
    )
}

export default React.memo(Favourite)