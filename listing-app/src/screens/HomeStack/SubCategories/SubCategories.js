import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { TextDefault } from '../../../components';
import styles from './styles';
import useCategories from '../../../hooks/useCategories';
import { alignment } from '../../../utilities';

function SubCategories({ route }) {
    const [subCategory, setSubCategory] = useState([])
    const navigation = useNavigation()
    const headerTitle = route?.params?.headerTitle ?? null
    const screen = route.params?.screen ?? null

    useEffect(() => {
        const subCategories = route.params.subCategories.filter((item) => item.value.category.title === headerTitle)
        setSubCategory(subCategories)
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: headerTitle
        })
    }, [navigation, headerTitle])

    function navigateScreen(title, category) {
        if (screen === 'Filter')
            navigation.navigate('FilterModal', { search: title, category: category })
        else
            navigation.navigate('ProductListing', { search: title, category: category })
    }

    function footer() {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.categoryRow}
                onPress={() => navigateScreen('View All', headerTitle)}
            >
                <TextDefault light H5 style={styles.fontText}>
                    {'Вижте всички'}
                </TextDefault>
            </TouchableOpacity>
        )
    }
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
                data={subCategory}
                style={styles.flatList}
                contentContainerStyle={styles.categoryContainer}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={() => emptyView()}
                ListFooterComponent={footer}
                renderItem={({item}) => {
                    return (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.categoryRow}
                        onPress={() => navigateScreen(item.value.title)}
                    >
                        <TextDefault light H5 style={styles.fontText}>
                            {item.value.title}
                        </TextDefault>
                    </TouchableOpacity>
                )}}
            />

        </View>
    );
}

export default SubCategories
