import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { Image, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { AddFilter, EmptyButton, TextDefault } from '../../../../components';
import { alignment, colors, scale } from '../../../../utilities';
import styles from './styles';
import { Feather, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'

import Card from './Card';

const dataList = [
    {
        status: 'ACTIVE',
        title: 'Japanese 28 inches cycle',
        price: 'RS: 20,000',
        img: require('../../../../assets/images/products/cycle.jpg'),
        views: 9,
        likes: 0,
        postingDate: '29 Sep 2020',
        endingDate: '29 OCT 2020'
    },
    {
        status: 'PENDING',
        title: 'Japanese 28 inches cycle',
        price: 'RS: 20,000',
        img: require('../../../../assets/images/products/cycle.jpg'),
        views: 0,
        likes: 0,
        postingDate: '29 Sep 2020',
        endingDate: '29 OCT 2020'
    }
]

function Ads() {
    const navigation = useNavigation()
    const [visible, setVisible] = useState(false)

    function onModalToggle() {
        setVisible(prev => !prev)
    }

    

    function emptyView() {
        return (
            <View style={[styles.flex, styles.emptyContainer]}>
                <Image
                    style={styles.emptyImage}
                    source={require('../../../../assets/images/emptyView/ads.png')}
                />
                <TextDefault H4 center bold style={alignment.MTlarge}>
                    {"You haven't listed anything yet."}
                </TextDefault>
                <TextDefault H5 center light style={alignment.MTsmall}>
                    {"Let go of what you don't use anymore"}
                </TextDefault>
                <EmptyButton
                    title='Start selling'
                    onPress={() => navigation.navigate('Sell', { screen: 'Home' })}
                />
            </View>
        )
    }

    function header() {
        return (
            <TouchableOpacity style={styles.smallContainer}
                onPress={onModalToggle}>
                <TextDefault bolder H5 style={alignment.PRsmall}>
                    {`View All (${dataList.length})`}
                </TextDefault>
                <Feather name="chevron-down" size={scale(15)} color={colors.fontSecondColor} />
            </TouchableOpacity>
        )
    }

    return (
        <View style={[styles.flex, styles.mainContainer]}>
            <FlatList
                data={dataList}
                style={styles.flex}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={emptyView}
                ListHeaderComponent={header}
                keyExtractor={(item, index) => index.toString()}
                stickyHeaderIndices={[0]}
                renderItem={({ item, index }) => (
                    <Card {...item} />
                )}
            />

            <AddFilter visible={visible} onModalToggle={onModalToggle} active={dataList.length} />
        </View>
    )
}

export default React.memo(Ads)